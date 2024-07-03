import React, { useEffect } from 'react';
import { Form, Input, message, Spin } from 'antd';
import { useMutation } from '@apollo/client';
import { CREATE_QUESTION_LEVEL, UPDATE_QUESTION_LEVEL, ALL_QUESTION_LEVELS } from 'graphql/test';
import IntlMessage from 'components/util-components/IntlMessage';

function TestLevelForm ({formType, editData, setIsModalVisible}) {

    const [form] = Form.useForm();

    const [create, { loading: createLoading }] = useMutation(CREATE_QUESTION_LEVEL, {
        refetchQueries: [ALL_QUESTION_LEVELS],
		onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            setIsModalVisible(false);
            form.resetFields();
		},
	});

    const [update, { loading: updateLoading }] = useMutation(UPDATE_QUESTION_LEVEL, {
        refetchQueries: [ALL_QUESTION_LEVELS],
        onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            setIsModalVisible(false);
            form.resetFields();
        },
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
        } else {
            create({ variables: values });
        }
    };

    return (
        <Spin spinning={createLoading || updateLoading} tip="Ачааллаж байна...">
            <Form  
                id="TestLevelForm"
                layout={'vertical'}
                form={form}
                name="control-hooks" 
                onFinish={onFinish}
            >
                <Form.Item name="level" label={<IntlMessage id="level" />} rules={[
                    { 
                        required: true,
                        message: "Хоосон орхих боломжгүй"
                    }
                ]}>
                    <Input />
                </Form.Item>
            </Form>
        </Spin>
    );
};

export default TestLevelForm