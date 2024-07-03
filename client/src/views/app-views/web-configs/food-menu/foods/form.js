import React, { useEffect } from 'react';
import { Form, Input, message, Spin } from 'antd';
import { useMutation } from '@apollo/client';
import IntlMessage from 'components/util-components/IntlMessage';
import { ALL_FOODS, CREATE_FOOD, UPDATE_FOOD } from 'graphql/food';
import BraftEditor from 'braft-editor';
import { useParams } from 'react-router-dom';

function DegreeForm ({formType, editData, setIsModalVisible}) {

    const { foodMenu } = useParams()

    const [form] = Form.useForm();

    const [create, { loading: createLoading }] = useMutation(CREATE_FOOD, {
        refetchQueries: [{
            query: ALL_FOODS,
            variables: { foodMenu: foodMenu }
        }],
		onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            setIsModalVisible(false);
		}
	});

    const [update, { loading: updateLoading }] = useMutation(UPDATE_FOOD, {
        refetchQueries: [{
            query: ALL_FOODS,
            variables: { foodMenu: foodMenu }
        }],
        onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            setIsModalVisible(false);
        }
    });

    useEffect(() => {
        if(formType === "edit") {
            const newData = {
                ingredients: BraftEditor.createEditorState(editData.ingredients),
                name: editData.name
            }
            form.setFieldsValue(newData);
        } else {
            form.resetFields();
        }
    }, [editData, form, formType]);

    

    const onFinish = values => {
        values.ingredients = values.ingredients.toHTML();
        values.foodMenu = foodMenu
        if (formType === "edit") {
            values.id = editData.id;
            update({ variables: values });
        } else {
            create({ variables: values });
        }
    };
        
    return (
        <Spin spinning={createLoading || updateLoading} tip="Ачааллаж байна...">
            <Form  
                id="DegreeForm"
                layout={'vertical'}
                form={form}
                name="control-hooks" 
                onFinish={onFinish}
            >
                <Form.Item name="name" label={<IntlMessage id="name" />} rules={[
                    { 
                        required: true,
                        message: "Хоосон орхих боломжгүй"
                    }
                ]}>
                    <Input />
                </Form.Item>
                <Form.Item name="ingredients" label={<IntlMessage id="ingredients" />} rules={[
                    { 
                        required: true,
                        message: "Хоосон орхих боломжгүй"
                    }
                ]}>
                    <BraftEditor
                        className='border rounded-2'
                        language="en"
                    />
                </Form.Item>
            </Form>
        </Spin>
    );
};

export default DegreeForm