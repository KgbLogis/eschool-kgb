import React from 'react';
import { Form, Button, Input, Row, Col, message, Card, Typography } from 'antd';
import { CheckCircleTwoTone   } from '@ant-design/icons';
import IntlMessage from 'components/util-components/IntlMessage';
import { useMutation } from '@apollo/client';
import { CHANGE_PASSWORD } from 'graphql/user';

const { Paragraph, Title } = Typography;

const UpdatePassword = () => {

    const [form] = Form.useForm();

    const [changePassword] = useMutation(CHANGE_PASSWORD, {
        onCompleted: data => {
            if (data.passwordChange.success === true) {
                message.success('Амжилттай!')
            }
            if (data.passwordChange.success === false) {
                if (data.passwordChange.errors.oldPassword) {
                    form.setFields([
                        {
                            name: 'oldPassword',
                            errors: [
                                data.passwordChange.errors.oldPassword.map((err, index) => (
                                    <>
                                        <IntlMessage key={index} id={err.message} /> <br/>
                                    </>
                                ))
                            ]
                        }
                    ])
                }
                if (data.passwordChange.errors.newPassword2) {
                    form.setFields([
                        {
                            name: 'newPassword2',
                            errors: [
                                data.passwordChange.errors.newPassword2.map((err, index) => (
                                    <>
                                        <IntlMessage key={index} id={err.message} /> <br/>
                                    </>
                                ))
                            ]
                        }
                    ])
                }
            }
        }
    })

    const onFinish = (values) => {
        changePassword({ variables: values })
    }

    return (
        <Card>
            <Row>
                <Col xs={24} sm={24} md={8} className='mt-4'>
                    <Title level={2} type="secondary" className='mb-4'><IntlMessage id="password.title" /></Title>
                    <Paragraph  type="secondary"><CheckCircleTwoTone  />  <IntlMessage id="password.requirement1" /></Paragraph >
                    <Paragraph  type="secondary"><CheckCircleTwoTone  />  <IntlMessage id="password.requirement2" /></Paragraph >
                    <Paragraph  type="secondary"><CheckCircleTwoTone  />  <IntlMessage id="password.requirement3" /></Paragraph >
                    <Paragraph  type="secondary"><CheckCircleTwoTone  />  <IntlMessage id="password.requirement4" /></Paragraph >
                </Col>
                <Col xs={24} sm={24} md={16}>
                    <div className="mt-4">
                        <Form
                            name="changePasswordForm"
                            layout="vertical"
                            form={form}
                            onFinish={onFinish}
                        >
                            <Form.Item
                                label={<IntlMessage id="current_password" />}
                                name="oldPassword"
                                rules={
                                    [
                                        { 
                                            required: true,
                                            message: <IntlMessage id="form.required" />
                                        },
                                    ]
                                }
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item
                                label={<IntlMessage id="new_password" />}
                                name="newPassword1"
                                rules={[{ 
                                    required: true,
                                    message: <IntlMessage id="form.required" />
                                }]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item
                                label={<IntlMessage id="confirm_password" />}
                                name="newPassword2"
                                rules={
                                    [
                                        { 
                                            required: true,
                                            message: <IntlMessage id="form.required" />
                                        },
                                    ]
                                }
                            >
                                <Input.Password />
                            </Form.Item>
                            <div className='text-right'>
                                <Button type="primary" htmlType="submit">
                                    {<IntlMessage id="change_password" />}
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Card>
    )
};

export default UpdatePassword;
