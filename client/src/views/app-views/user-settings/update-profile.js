import React, { useContext, useState } from 'react';
import { Form, Avatar, Button, Input, Row, Col, Card, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { ROW_GUTTER } from 'constants/ThemeConstant';
import { UserContext } from 'hooks/UserContextProvider';
import { BASE_SERVER_URL } from 'configs/AppConfig';
import IntlMessage from 'components/util-components/IntlMessage';
import { useMutation, useQuery } from '@apollo/client';
import { MY_PROFILE, UPDATE_PROFILE } from 'graphql/user';

const { TextArea } = Input;

const UpdateProfile = () => {

    const phoneRegEx = new RegExp(/^[7-9][0-9]{3}[0-9]{4}$/u);

    const [form] = Form.useForm();
    
    const contextData = useContext(UserContext)
    const [user] = useState(contextData.user);

    const { refetch } = useQuery(MY_PROFILE, {
        onCompleted: data => {
            form.setFieldsValue(data.accountSelf)
        }
    })

    const [update, { loading: updateLoading }] = useMutation(UPDATE_PROFILE, {
        onCompleted: data => {
            message.success("Амжилттай шинэчиллээ!");
            refetch();
        }
    })

    const onFinish = (values) => {
        update({ variables: values })
    }

    return (
        <Card>
            <Row>
                <Col xs={24} sm={24} md={8} className='text-center mt-4'>
                    {( () => {
                        if (user.isStudent) {
                            return (
                                <Avatar
                                    size={300} 
                                    src={BASE_SERVER_URL+user.student.photo}
                                />
                            )
                        } else if (user.isTeacher) {
                            return (
                                <Avatar
                                    size={300} 
                                    src={BASE_SERVER_URL+user.teacher.photo}
                                />
                            )
                        } else {
                            return (
                                <Avatar
                                    size={300} 
                                    style={{ backgroundColor: '#87d068' }}
                                    icon={<UserOutlined />}
                                />
                            )
                        }
                    })()}
                    {/* <div className="mt-5">
                        <Upload onChange={`onUploadAavater`} showUploadList={false} action={`   `}>
                            <Button icon={<UploadOutlined />} type="primary"> <IntlMessage id="main.upload-image" /></Button>
                        </Upload>
                    </div> */}
                </Col>
                <Col xs={24} sm={24} md={16}>
                    <div className="mt-4">
                        <Form
                            name="basicInformation"
                            layout="vertical"
                            onFinish={onFinish}
                            form={form}
                        >
                            <Row>
                                <Col xs={24} sm={24} md={24} lg={24}>
                                    <Row gutter={ROW_GUTTER}>
                                        <Col xs={24} sm={24} md={12}>
                                            <Form.Item
                                                label={<IntlMessage id="familyName" />}
                                                name="familyName"
                                                rules={[
                                                    { 
                                                        required: true,
                                                        message: <IntlMessage id="form.required" />
                                                    }
                                                ]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={24} md={12}>
                                            <Form.Item
                                                label={<IntlMessage id="name" />}
                                                name="name"
                                                rules={[
                                                    { 
                                                        required: true,
                                                        message: <IntlMessage id="form.required" />
                                                    }
                                                ]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={24} md={24}>
                                            <Form.Item
                                                label={<IntlMessage id="email" />}
                                                name="email"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: <IntlMessage id="form.required" />
                                                    },
                                                    {
                                                        type: 'email',
                                                        message: 'И-мэйл буруу байна'
                                                    },
                                                ]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={24} md={12}>
                                            <Form.Item
                                                label={<IntlMessage id="phone" />}
                                                name="phone"
                                                rules={[
                                                    { 
                                                        required: true,
                                                        message: <IntlMessage id="form.required" />
                                                    },
                                                    {
                                                        validator(rule, value) {
                                                            if (!phoneRegEx.test(value)) {
                                                                return Promise.reject('Утасны дугаар буруу байна!');
                                                            }
                                                            return Promise.resolve();
                                                        },
                                                    }
                                                ]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={24} md={12}>
                                            <Form.Item
                                                label={<IntlMessage id="phone2" />}
                                                name="phone2"
                                                rules={[
                                                    { 
                                                        required: true,
                                                        message: <IntlMessage id="form.required" />
                                                    },
                                                    {
                                                        validator(rule, value) {
                                                            if (!phoneRegEx.test(value)) {
                                                                return Promise.reject('Утасны дугаар буруу байна!');
                                                            }
                                                            return Promise.resolve();
                                                        },
                                                    }
                                                ]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={24} md={12}>
                                            <Form.Item
                                                label={<IntlMessage id="address" />}
                                                name="address"
                                                rules={[
                                                    { 
                                                        required: true,
                                                        message: <IntlMessage id="form.required" />
                                                    }
                                                ]}
                                            >
                                                <TextArea rows={4} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Form.Item className='text-right'>
                                        <Button type="primary" htmlType="submit" loading={updateLoading}>
                                            {<IntlMessage id="main.okText" />}
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Card>
    )
};

export default UpdateProfile;
