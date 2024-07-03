import React, { useEffect } from 'react';
import { Form, Input, message, Spin, Row, Col, Button, InputNumber  } from 'antd';
import { useMutation } from '@apollo/client';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { CREATE_MARK_PERCENTAGE, UPDATE_MARK_PERCENTAGE, ALL_MARK_PERCENTAGE } from 'graphql/mark';
import IntlMessage from 'components/util-components/IntlMessage';

function MarkPercentageForm ({formType, editData, setIsModalVisible}) {

    const [form] = Form.useForm();

    const [createMarkPercentage, { loading: createLoading, error, called }] = useMutation(CREATE_MARK_PERCENTAGE, {
        refetchQueries: [ALL_MARK_PERCENTAGE],
		onCompleted: data => {
            setIsModalVisible(false);
		}
	});

    const [update, { loading: updateLoading }] = useMutation(UPDATE_MARK_PERCENTAGE, {
        refetchQueries: [ALL_MARK_PERCENTAGE],
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
        if (called === true) {
            message.success('Амжилттай хадгаллаа');
        }
    }, [called, editData, form, formType]);

    

    const onFinish = values => {

        if(formType === "edit") {
            values.id = editData.id;
            update({ variables: values })
        } else {
            values.fields.map(function(hmm) {
                let i = hmm.minPercentage;
                let n = hmm.maxPercentage;
            
                for (i; i <= n; i++) {
                    let variable = {
                        diam: hmm.diam,
                        type: hmm.type ,
                        percentage: i
                    }
                    createMarkPercentage({ variables: variable})
                }
                return null
            })
        }
    };
        
    if (error) message.error(`${error.message}`);

    return (
        <Spin spinning={createLoading || updateLoading} tip="Ачааллаж байна...">
            <Form  
                id="MarkPercentageForm"
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
                                        name={[index, "type"]}
                                        label="Үнэлгээ"
                                        rules={[
                                            { 
                                                required: true,
                                                message: "Хоосон орхих боломжгүй"
                                            }
                                        ]}
                                    >
                                        <Input placeholder="Үнэлгээ" />
                                    </Form.Item>
                                    <Form.Item
                                        label="Үнэлгээний дээд / доод хувь"
                                    >
                                        <Input.Group compact>
                                            <Form.Item
                                                name={[index, "maxPercentage"]}
                                                noStyle
                                                rules={[
                                                    { 
                                                        required: true,
                                                        message: "Хоосон орхих боломжгүй"
                                                    },
                                                    () => ({
                                                        validator(_, value) {
                                                            if (value?.length > 3 || value > 100) {
                                                                return Promise.reject("100-аас дээш тоо оруулах боломжгүй");
                                                            }
                                                            return Promise.resolve();
                                                        },
                                                    }),
                                                ]}
                                            >
                                                <InputNumber min={1} placeholder="Дээд хувь" />
                                            </Form.Item>
                                            <Form.Item
                                                name={[index, "minPercentage"]}
                                                noStyle
                                                rules={[
                                                    { 
                                                        required: true,
                                                        message: "Хоосон орхих боломжгүй"
                                                    },
                                                    () => ({
                                                        validator(_, value) {
                                                            if (value?.length > 3 || value > 100) {
                                                                return Promise.reject("100-аас дээш тоо оруулах боломжгүй");
                                                            }
                                                            return Promise.resolve();
                                                        },
                                                    }),
                                                ]}
                                            >
                                                <InputNumber style={{ marginLeft: '10px' }} min={0} placeholder="Доод хувь" />
                                            </Form.Item>
                                        </Input.Group>
                                    </Form.Item>
                                    <Form.Item 
                                        name={[index, "diam"]} 
                                        label="Үнэлгээний голч"
                                        rules={[
                                            { 
                                                required: true,
                                                message: "Хоосон орхих боломжгүй"
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Үнэлгээний голч" />
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
                        <Form.Item
                            name="type"
                            label="Үнэлгээ"
                            rules={[
                                { 
                                    required: true,
                                    message: "Хоосон орхих боломжгүй"
                                }
                            ]}
                        >
                            <Input placeholder="Үнэлгээ" />
                        </Form.Item>
                        <Form.Item
                            name="percentage"
                            label="Үнэлгээний дээд / доод хувь"
                        >
                            <InputNumber style={{ width: "100%" }} min={0} placeholder="Доод хувь" />
                        </Form.Item>
                        <Form.Item 
                            name="diam"
                            label="Үнэлгээний голч"
                            rules={[
                                { 
                                    required: true,
                                    message: "Хоосон орхих боломжгүй"
                                },
                            ]}
                        >
                            <Input placeholder="Үнэлгээний голч" />
                        </Form.Item>
                    </>
                }
            </Form>
        </Spin>
    );
};

export default MarkPercentageForm