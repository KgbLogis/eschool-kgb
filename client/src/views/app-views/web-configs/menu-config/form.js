import React, { useEffect } from 'react';
import { Form, Input, message, Spin, Row, Col, Select, InputNumber } from 'antd';
import Icon from '@ant-design/icons';
import { useMutation } from '@apollo/client';
import { ALL_MENUS, UPDATE_MENU } from 'graphql/core';
import { svg } from 'configs/MenuIcon';

const { Option } = Select;

function ActivityForm ({editData, formType, setIsModalVisible}) {

    const [form] = Form.useForm();

    const [updateMenu, { loading }] = useMutation(UPDATE_MENU, {
        refetchQueries: [ALL_MENUS],
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
        values.breadcrumb = editData.breadcrumb;
        values.submenu = editData.menuSet;
        values.id = editData.id;
        updateMenu({ variables: values });
        form.resetFields();
    };

    return (
        <Spin spinning={loading} tip="Ачааллаж байна...">
            <Form  
                id="ActivityForm"
                                layout={'vertical'}
                form={form}
                name="control-hooks" 
                onFinish={onFinish}
            >
                <Row gutter={[16, 24]}>
                    <Col className="gutter-row" span={12}>
                        <Form.Item name="title" label="Нэр" rules={[
                            { 
                                required: true,
                                message: "Хоосон орхих боломжгүй"
                            }
                        ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="priority" label="Дараалал" rules={[
                            { 
                                required: true,
                                message: "Хоосон орхих боломжгүй"
                            }
                        ]}>
                            <InputNumber style={{ width: '100%' }} min={1} max={30} />
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={12}>
                        <Form.Item name="icon" label="Айкон" rules={[
                            { 
                                required: true,
                                message: "Хоосон орхих боломжгүй"
                            }
                        ]}>
                            <Select>
                                { svg.map((icon, index) => (
                                    <Option key={index} value={icon.name}>
                                        <Icon component={icon.svg} /> {icon.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="status" label="Төлөв" rules={[
                            { 
                                required: true,
                                message: "Хоосон орхих боломжгүй"
                            }
                        ]}>
                            <Select
                                placeholder="Төлөв сонгох"
                            >
                                <Option value="OPEN" key={0} >Нээлттэй</Option>
                                <Option value="CLOSED" key={1} >Хаалттай</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Spin>
    );
};

export default ActivityForm