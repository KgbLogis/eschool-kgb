import React, { useEffect } from 'react';
import { Form, Input, message, Spin, Row, Col, Button, InputNumber  } from 'antd';
import { useMutation } from '@apollo/client';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { CREATE_MARK_SETTING, UPDATE_MARK_SETTING, ALL_MARK_SETTING } from 'graphql/mark';
import IntlMessage from 'components/util-components/IntlMessage';

function MarkSettingForm ({formType, editData, setIsModalVisible}) {

    const [form] = Form.useForm();

    const [createMarkSetting, { loading: createLoading }] = useMutation(CREATE_MARK_SETTING, {
        refetchQueries: [ALL_MARK_SETTING],
		onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            setIsModalVisible(false);
		}
	});

    const [update, { loading: updateLoading }] = useMutation(UPDATE_MARK_SETTING, {
        refetchQueries: [ALL_MARK_SETTING],
        onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            setIsModalVisible(false);
        }
    });

    useEffect(() => {
        if(formType === "edit") {
            form.setFieldsValue(editData);
        } else if(formType === "create") {
            form.resetFields();
        }
    }, [editData, form, formType]);

    

    const onFinish = values => {
        if(formType === "edit") {
            values.id = editData.id;
            update({ variables: values })
        } else if(formType === "create") {
            values.fields.map((variable) => (
                createMarkSetting({ variables: variable})
            ))
        }
    };

    return (
        <Spin spinning={createLoading || updateLoading} tip="Ачааллаж байна...">
            <Form  
                id="MarkSettingForm"
                                layout={'vertical'}
                form={form}
                name="control-hooks" 
                onFinish={onFinish}
            >
                { formType === 'create' ? 
                    <Form.List name="fields">
                        {(fields, { add, remove }) => {
                            return (
                            <Row gutter={[16, 16]}>
                                {fields.map((field, index) => (
                                <Col span={8} key={field.key}>
                                    <Form.Item 
                                        name={[index, "name"]} 
                                        label="Нэр"
                                        rules={[
                                            { 
                                                required: true,
                                                message: "Хоосон орхих боломжгүй"
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Нэр" />
                                    </Form.Item>
                                    <Form.Item 
                                        name={[index, "percentage"]} 
                                        label="Үнэлгээний хувь"
                                        rules={[
                                            { 
                                                required: true,
                                                message: "Хоосон орхих боломжгүй"
                                            },
                                            
                                        ]}
                                    >
                                        <InputNumber min={1} max={100} bordered placeholder="Үнэлгээний хувь" style={{ width: '100%' }} />
                                    </Form.Item>
                                    {fields.length > 1 ? (
                                    <Button
                                        type="primary" danger
                                        onClick={() => remove(field.name)}
                                        icon={<MinusCircleOutlined />}
                                    >
                                        Устгах
                                    </Button>
                                    ) : null}
                                </Col>
                                ))}
                                <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    style={{ width: "100%", margin: "29px" }}
                                >
                                    <PlusOutlined /> <IntlMessage id="add-field" />
                                </Button>
                                </Form.Item>
                            </Row >
                            );
                        }}
                    </Form.List>
                    :
                    <>
                        <Form.Item name="name" label={<IntlMessage id="name" />} rules={[
                            { 
                                required: true,
                                message: "Хоосон орхих боломжгүй"
                            }
                        ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="percentage" label={<IntlMessage id="mark-percentage" />} rules={[
                            { 
                                required: true,
                                message: "Хоосон орхих боломжгүй"
                            }
                        ]}>
                            <InputNumber min={1} max={100} bordered placeholder="Үнэлгээний хувь" style={{ width: '100%' }} />
                        </Form.Item>
                    </>
                }
                
            </Form>
        </Spin>
    );
};

export default MarkSettingForm