import React, { useEffect } from 'react';
import { Form, Input, message, Spin } from 'antd';
import { useMutation } from '@apollo/client';
import { ALL_ACTIVITY, CREATE_ACTIVITY, UPDATE_ACTIVITY } from 'graphql/core'
import IntlMessage from 'components/util-components/IntlMessage';

function ActivityForm ({editData, formType, setIsModalVisible}) {

    const [form] = Form.useForm();

    const [createActivity, { loading }] = useMutation(CREATE_ACTIVITY, {
        refetchQueries: [ALL_ACTIVITY],
		onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            setIsModalVisible(false);
		}
	});

    const [updateActivity, { loading: updateLoading }] = useMutation(UPDATE_ACTIVITY, {
        refetchQueries: [ALL_ACTIVITY],
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
            updateActivity({ variables: values });
            form.resetFields();
        } else {
            createActivity({ variables: values });
            form.resetFields();
        }
    };

    return (
        <Spin spinning={loading || updateLoading} tip="Ачааллаж байна...">
            <Form  
                id="ActivityForm"
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

export default ActivityForm