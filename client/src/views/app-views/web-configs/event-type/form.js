import React, { useState, useEffect } from 'react';
import { Form, Input, message, Spin } from 'antd';
import { useMutation } from '@apollo/client';
import { BlockPicker } from 'react-color';
import IntlMessage from 'components/util-components/IntlMessage';
import { CREATE_EVENT_TYPE } from 'graphql/create';
import { UPDATE_EVENT_TYPE } from 'graphql/update';

function DegreeForm ({formType, editData, setIsModalVisible, refetch}) {

    const [selectedColor, setSelectedColor] = useState('#22194d');
    const [isPickerVisible, setIsPickerVisible] = useState(false);

    const [form] = Form.useForm();

    const [create, { loading: createLoading }] = useMutation(CREATE_EVENT_TYPE, {
		onCompleted: data => {
            refetch();
            message.success('Амжилттай хадгаллаа');
            setIsModalVisible(false);
		}
	});

    const [update, { loading: updateLoading }] = useMutation(UPDATE_EVENT_TYPE, {
        onCompleted: data => {
            refetch();
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
        if (formType === "edit") {
            values.id = editData.id;
            update({ variables: values });
            form.resetFields();
        } else {
            create({ variables: values });
            form.resetFields();
        }
    };

    const popover = {
        position: 'absolute',
        zIndex: '2',
    }

    const cover = {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
    }
    
    const handleClick = () => {
        setIsPickerVisible(!isPickerVisible);
    }

    const handleClose = () => {
        setIsPickerVisible(false);
    }

    const handleChangeComplete = (color, event) => {
        setSelectedColor(color.hex);
        form.setFieldsValue({ color: color.hex });
    }


    return (
        <>
            <Spin spinning={createLoading || updateLoading} tip="Ачааллаж байна...">
                <Form
                    id="DegreeForm"
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
                                message: "Хоосон орхих боломжгүй"
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item 
                        name="color" 
                        label={<IntlMessage id="color" />} 
                        rules={[
                            { 
                                required: true,
                                message: "Хоосон орхих боломжгүй"
                            }
                        ]}
                    >
                        <Input onClick={handleClick} />
                    </Form.Item>
                </Form>
            </Spin>
            { isPickerVisible &&
                <div style={popover}>
                    <div style={cover} onClick={handleClose} />
                    <BlockPicker
                        color={selectedColor}
                        onChangeComplete={handleChangeComplete} 
                    />
                </div>
            }
        </>
    );
};

export default DegreeForm