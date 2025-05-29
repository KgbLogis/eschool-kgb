import React, { useContext, useEffect, useState } from 'react';
import { Button, Form, Input, Alert, Row, Col, Select, InputNumber } from "antd";
import {
    AUTH_TOKEN,
} from 'redux/constants/Auth';
import { useHistory } from "react-router-dom";
import { motion } from "framer-motion"
import { gql, useMutation, useQuery } from '@apollo/client';
import IntlMessage from 'components/util-components/IntlMessage';
import { UserContext } from 'hooks/UserContextProvider';
import { ALL_CLASSTIME } from 'graphql/core';

const { Option } = Select

const REGISTER = gql`
    mutation register(
        $address: String
        $classtime: ID
        $email: String!
        $familyName: String
        $name: String
        $password: String!
        $phone: Int
        $sex: String
    ){
        register(
            address: $address
            classtime: $classtime
            email: $email
            familyName: $familyName
            name: $name
            password: $password
            phone: $phone
            sex: $sex
        ) {
            success
            token
        }
    }
`;

export const RegisterForm = props => {
    let history = useHistory();

    const { user, refetch } = useContext(UserContext);
    const token = localStorage.getItem(AUTH_TOKEN);
    const [showMessage, setShowMessage] = useState(false)
    const [error, setError] = useState({})

    const { data: classTimes } = useQuery(ALL_CLASSTIME)

    function hideAuthMessage() {
        setShowMessage(false)
    }

    function showAuthMessage() {
        setShowMessage(true)
    }

    const [onRegister, { loading }] = useMutation(REGISTER, {
        onCompleted: data => {
            localStorage.setItem(AUTH_TOKEN, data.register.token);
            refetch()
        },
        onError: err => {
            setError({
                email: err.graphQLErrors[0].extensions.errors.email,
                phone: err.graphQLErrors[0].extensions.errors.phone
            })
            showAuthMessage()
        }
    });

    const phoneRegEx = new RegExp(/^[7-9][0-9]{3}[0-9]{4}$/u);

    if (showMessage) {
        setTimeout(() => {
            hideAuthMessage();
        }, 3000);
    }

    useEffect(() => {
        if (token && user) {
            history.push('/app/home')
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, token])

    return (
        <div>
            {showMessage &&
                <motion.div
                    initial={{ opacity: 0, marginBottom: 0 }}
                    animate={{
                        opacity: showMessage ? 1 : 0,
                        marginBottom: showMessage ? 20 : 0
                    }}>
                    <Alert type="error" showIcon message={<IntlMessage id="register-fail" />}></Alert>
                </motion.div>
            }
            <Form
                layout="vertical"
                name="login-form"
                onFinish={e => {
                    onRegister({ variables: e });
                }}
            >
                <Row gutter={[16, 24]}>
                    <Col className="gutter-row" span={12}>
                        <Form.Item
                            name="familyName"
                            label={<IntlMessage id="familyName" />}
                            rules={[
                                {
                                    required: true,
                                    message: 'Нэвтрэх нэр оруулна уу',
                                }
                            ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="phone"
                            label={<IntlMessage id="phone" />}
                            help={error.phone}
                            validateStatus={error.phone && "error"}
                            rules={[
                                {
                                    required: true,
                                    message: 'Нэвтрэх нэр оруулна уу',
                                },
                                {
                                    validator(rule, value) {
                                        if (phoneRegEx.test(value)) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject('Утасны дугаар буруу байна!');
                                    },
                                }
                            ]}>
                            <InputNumber className='w-full' />
                        </Form.Item>
                        <Form.Item
                            name="classtime"
                            label={<IntlMessage id="classtime" />}
                            rules={[
                                {
                                    required: true,
                                    message: 'Нэвтрэх нэр оруулна уу',
                                }
                            ]}>
                            <Select>
                                {classTimes?.allClasstimes.map((classtime) => (
                                    <Option key={classtime.id} value={classtime.id} >{classtime.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label={<IntlMessage id="password" />}
                            rules={[
                                {
                                    required: true,
                                    message: 'Нууц үг оруулна уу',
                                }
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={12}>
                        <Form.Item
                            name="name"
                            label={<IntlMessage id="name" />}
                            rules={[
                                {
                                    required: true,
                                    message: 'Нэвтрэх нэр оруулна уу',
                                }
                            ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="sex"
                            label={<IntlMessage id="sex" />}
                            rules={[
                                {
                                    required: true,
                                    message: 'Нэвтрэх нэр оруулна уу',
                                }
                            ]}>
                            <Select>
                                <Option value="Эрэгтэй"><IntlMessage id="sex.male" /></Option>
                                <Option value="Эмэгтэй"><IntlMessage id="sex.female" /></Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label={<IntlMessage id="email" />}
                            help={error.email}
                            validateStatus={error.email && "error"}
                            rules={[
                                {
                                    required: true,
                                    message: 'Нэвтрэх нэр оруулна уу',
                                }
                            ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="address"
                            label={<IntlMessage id="address" />}
                            rules={[
                                {
                                    required: true,
                                    message: 'Нэвтрэх нэр оруулна уу',
                                }
                            ]}>
                            <Input.TextArea />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading}> <IntlMessage id="main.register" /></Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default RegisterForm
