import React, { useContext, useEffect, useState } from 'react';
import { Button, Form, Input, Alert, message, Row, Col, Select } from "antd";
import { UserOutlined, LockOutlined } from '@ant-design/icons';
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
        }
    }
`;

export const RegisterForm = props => {
    let history = useHistory();

    const { user, refetch } = useContext(UserContext);
    const token = localStorage.getItem(AUTH_TOKEN);
    const [showMessage, setShowMessage] = useState(false)

    const { data: classTimes } = useQuery(ALL_CLASSTIME)

    function hideAuthMessage() {
        setShowMessage(false)
    }

    function showAuthMessage() {
        setShowMessage(true)
    }

    const [onRegister, { loading, error }] = useMutation(REGISTER, {
        onCompleted: data => {

        },
        onError: err => {
            setShowMessage(true)
        }
    });

    if (showMessage) {
        setTimeout(() => {
            hideAuthMessage();
        }, 3000);
    }

    // useEffect(() => {
    //     if (token && user) {
    //         history.push('/app/home')
    //     }
    // }, [user, token])

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
                            <Input prefix={<UserOutlined className="text-primary" />} />
                        </Form.Item>
                        <Form.Item
                            name="phone"
                            label={<IntlMessage id="phone" />}
                            rules={[
                                {
                                    required: true,
                                    message: 'Нэвтрэх нэр оруулна уу',
                                }
                            ]}>
                            <Input prefix={<UserOutlined className="text-primary" />} />
                        </Form.Item>
                        <Form.Item
                            name="username"
                            label={<IntlMessage id="username" />}
                            rules={[
                                {
                                    required: true,
                                    message: 'Нэвтрэх нэр оруулна уу',
                                }
                            ]}>
                            <Input prefix={<UserOutlined className="text-primary" />} />
                        </Form.Item>
                        <Form.Item
                            name="username"
                            label={<IntlMessage id="username" />}
                            rules={[
                                {
                                    required: true,
                                    message: 'Нэвтрэх нэр оруулна уу',
                                }
                            ]}>
                                <Select>
                                    { classTimes?.allClasstimes.map((classtime) => (
                                        <Option key={classtime.id} value={classtime.id} >{classtime.name}</Option>
                                    ))}
                                </Select>
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
                            <Input prefix={<UserOutlined className="text-primary" />} />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label={<IntlMessage id="email" />}
                            rules={[
                                {
                                    required: true,
                                    message: 'Нэвтрэх нэр оруулна уу',
                                }
                            ]}>
                            <Input prefix={<UserOutlined className="text-primary" />} />
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
                            <Input.Password prefix={<LockOutlined className="text-primary" />} />
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
