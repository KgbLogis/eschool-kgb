import React, { useEffect } from 'react';
import { Form, Input, message, Spin } from 'antd';
import { useMutation } from '@apollo/client';
import { ALL_STUDENT_STATUS, CREATE_STUDENT_STATUS, UPDATE_STUDENT_STATUS } from 'graphql/core'
import IntlMessage from 'components/util-components/IntlMessage';

function StatusForm ({editData, formType, setIsModalVisible}) {

    const [form] = Form.useForm();

    const [createStatus, { loading }] = useMutation(CREATE_STUDENT_STATUS, {
        refetchQueries: [ALL_STUDENT_STATUS],
		onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            setIsModalVisible(false);
		}
	});

    const [updateStatus, { loading: updateLoading }] = useMutation(UPDATE_STUDENT_STATUS, {
        refetchQueries: [ALL_STUDENT_STATUS],
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
        if (formType === "edit") {
            values.id = editData.id;
            updateStatus({ variables: values });
        } else {
            createStatus({ variables: values });
        }
        form.resetFields();
    };

    return (
        <Spin spinning={loading || updateLoading} tip="Ачааллаж байна...">
            <Form  
                id="StatusForm"
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
            </Form>
        </Spin>
    );
};

export default StatusForm