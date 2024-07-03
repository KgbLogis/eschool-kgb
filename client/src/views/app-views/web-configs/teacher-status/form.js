import React, { useEffect } from 'react';
import { Form, Input, message, Spin } from 'antd';
import { useMutation } from '@apollo/client';
import { ALL_TEACHER_STATUS, UPDATE_TEACHER_STATUS, CREATE_TEACHER_STATUS } from 'graphql/core'
import IntlMessage from 'components/util-components/IntlMessage';

function StatusForm (props) {

    const [form] = Form.useForm();

    const [createStatus, { loading }] = useMutation(CREATE_TEACHER_STATUS, {
        refetchQueries: [ALL_TEACHER_STATUS],
		onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            props.setIsModalVisible(false);
		}
	});

    const [updateStatus, { loading: updateLoading }] = useMutation(UPDATE_TEACHER_STATUS, {
        refetchQueries: [ALL_TEACHER_STATUS],
        onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            props.setIsModalVisible(false);
        }
    });

    useEffect(() => {
        if(props.formType === "edit") {
            form.setFieldsValue(props.editData);
        } else if(props.formType === "create") {
            form.resetFields();
        }
    }, [props.editData, form, props.formType]);

    const onFinish = values => {
        if (props.formType === "edit") {
            values.id = props.editData.id;
            updateStatus({ variables: values });
        } else {
            createStatus({ variables: values });
        }
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