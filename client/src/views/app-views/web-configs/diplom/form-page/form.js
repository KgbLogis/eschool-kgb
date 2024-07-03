import { useMutation } from '@apollo/client';
import { Affix, Button, Card, Col, Form, Input, message, Row, Typography } from 'antd'
import IntlMessage from 'components/util-components/IntlMessage';
import { CREATE_DIPLOM, UPDATE_DIPLOM } from 'graphql/diplom';
import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom';

const { Paragraph } = Typography;
const { TextArea } = Input;

const diplomtexts = [
    "name",
    "name_mgl",
    "family_name",
    "family_name_mgl",
    "school",
    "school_mgl",
    "religion",
    "register_no",
    "date"
]

const DiplomForm = ({ type, diplom }) => {

    const [form] = Form.useForm();
    const history = useHistory();

    const [create, { loading: createLoading }] = useMutation(CREATE_DIPLOM, {
        onCompleted: data => {
            message.success('Амжилттай хадгаллаа!')
            history.goBack();
        }
    })

    const [update, { loading: updateLoading }] = useMutation(UPDATE_DIPLOM, {
        onCompleted: data => {
            message.success('Амжилттай хадгаллаа!')
            history.goBack();
        }
    })
    
    useEffect(() => {
        if (diplom && type === 'update') {
            form.setFieldsValue(diplom);
        }
    }, [diplom, form, type])
    

    const onFinish = (values) => {
        if (type === 'create') {
            create({ variables: values })
        }
        if (type === 'update') {
            values.id = diplom.id
            update({ variables: values })
        }
    }

    return (
        <>
            <Row gutter={[16, 16]} className='mt-4'>
                <Col span={16} >
                    <Form  
                        id="diplom"
                        layout={'vertical'}
                        form={form}
                        name="control-hooks" 
                        onFinish={onFinish}
                    >
                        <Form.Item 
                            name="name" 
                            label={<IntlMessage id="name" />} 
                            rules={[
                                { 
                                    required: true,
                                    message: <IntlMessage id="form.required" /> 
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item 
                            name="mainMid" 
                            label={<IntlMessage id="mainMid" />} 
                            rules={[
                                { 
                                    required: true,
                                    message: <IntlMessage id="form.required" /> 
                                }
                            ]}
                        >
                            <TextArea rows={4} />
                        </Form.Item>
                        <Form.Item 
                            name="mainBottom1" 
                            label={<IntlMessage id="mainBottom1" />} 
                            rules={[
                                { 
                                    required: true,
                                    message: <IntlMessage id="form.required" /> 
                                }
                            ]}
                        >
                            <TextArea rows={4} />
                        </Form.Item>
                        <Form.Item 
                            name="mainBottom2" 
                            label={<IntlMessage id="mainBottom2" />} 
                            rules={[
                                { 
                                    required: true,
                                    message: <IntlMessage id="form.required" /> 
                                }
                            ]}
                        >
                            <TextArea rows={4} />
                        </Form.Item>
                        <Form.Item 
                            name="mainBottom3" 
                            label={<IntlMessage id="mainBottom3" />} 
                            rules={[
                                { 
                                    required: true,
                                    message: <IntlMessage id="form.required" /> 
                                }
                            ]}
                        >
                            <TextArea rows={4} />
                        </Form.Item>
                        <Form.Item 
                            name="mglMainMid" 
                            label={<IntlMessage id="mglMainMid" />} 
                            rules={[
                                { 
                                    required: true,
                                    message: <IntlMessage id="form.required" /> 
                                }
                            ]}
                        >
                            <TextArea rows={4} />
                        </Form.Item>
                        <Form.Item 
                            name="mglMainBottom1" 
                            label={<IntlMessage id="mglMainBottom1" />} 
                            rules={[
                                { 
                                    required: true,
                                    message: <IntlMessage id="form.required" /> 
                                }
                            ]}
                        >
                            <TextArea rows={4} />
                        </Form.Item>
                        <Form.Item 
                            name="mglMainBottom1Sub" 
                            label={<IntlMessage id="mglMainBottom1Sub" />} 
                            rules={[
                                { 
                                    required: true,
                                    message: <IntlMessage id="form.required" /> 
                                }
                            ]}
                        >
                            <TextArea rows={4} />
                        </Form.Item>
                        <Form.Item 
                            name="mglMainBottom2" 
                            label={<IntlMessage id="mglMainBottom2" />} 
                            rules={[
                                { 
                                    required: true,
                                    message: <IntlMessage id="form.required" /> 
                                }
                            ]}
                        >
                            <TextArea rows={4} />
                        </Form.Item>
                        <Form.Item 
                            name="mglMainBottom2Sub" 
                            label={<IntlMessage id="mglMainBottom2Sub" />} 
                            rules={[
                                { 
                                    required: true,
                                    message: <IntlMessage id="form.required" /> 
                                }
                            ]}
                        >
                            <TextArea rows={4} />
                        </Form.Item>
                        <Form.Item 
                            name="mglMainBottom3" 
                            label={<IntlMessage id="mglMainBottom3" />} 
                            rules={[
                                { 
                                    required: true,
                                    message: <IntlMessage id="form.required" /> 
                                }
                            ]}
                        >
                            <TextArea rows={4} />
                        </Form.Item>
                        <Form.Item 
                            name="mglMainBottom3Sub" 
                            label={<IntlMessage id="mglMainBottom3Sub" />} 
                            rules={[
                                { 
                                    required: true,
                                    message: <IntlMessage id="form.required" /> 
                                }
                            ]}
                        >
                            <TextArea rows={4} />
                        </Form.Item>
                        <Form.Item 
                            name="markBottom1" 
                            label={<IntlMessage id="markBottom1" />} 
                            rules={[
                                { 
                                    required: true,
                                    message: <IntlMessage id="form.required" /> 
                                }
                            ]}
                        >
                            <TextArea rows={4} />
                        </Form.Item>
                        <Form.Item 
                            name="markBottom2" 
                            label={<IntlMessage id="markBottom2" />} 
                            rules={[
                                { 
                                    required: true,
                                    message: <IntlMessage id="form.required" /> 
                                }
                            ]}
                        >
                            <TextArea rows={4} />
                        </Form.Item>
                        <Form.Item 
                            name="mglMarkBottom1" 
                            label={<IntlMessage id="mglMarkBottom1" />} 
                            rules={[
                                { 
                                    required: true,
                                    message: <IntlMessage id="form.required" /> 
                                }
                            ]}
                        >
                            <TextArea rows={4} />
                        </Form.Item>
                        <Form.Item 
                            name="mglMarkBottom2" 
                            label={<IntlMessage id="mglMarkBottom2" />} 
                            rules={[
                                { 
                                    required: true,
                                    message: <IntlMessage id="form.required" /> 
                                }
                            ]}
                        >
                            <TextArea rows={4} />
                        </Form.Item>
                        <Form.Item className='text-right'>
                            <Button className="mr-2" type="primary" htmlType="submit" loading={createLoading || updateLoading}>
                                <IntlMessage id="main.okText" />
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
                <Col span={8} >
                    <Affix
                        offsetTop={120} 
                    >
                        <Card
                            type="inner"
                            title="Ашилгах түлхүүр үгс"
                        >
                            { diplomtexts.map((text, index) => (
                                <Paragraph key={index} copyable={{ text: `[${text}]` }}> {`[${text}]`} </Paragraph>
                            ))}
                        </Card>
                    </Affix>
                </Col>
            </Row>
        </>
    )
}

export default DiplomForm