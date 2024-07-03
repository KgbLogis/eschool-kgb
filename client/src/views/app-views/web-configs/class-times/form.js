import React, { useEffect } from 'react';
import { Form, Input, message, Spin } from 'antd';
import { useMutation } from '@apollo/client';
import { ALL_CLASSTIME, UPDATE_CLASSTIME, CREATE_CLASSTIME } from 'graphql/core'
import IntlMessage from 'components/util-components/IntlMessage';

function ClassTimeForm (props) {

    const [form] = Form.useForm();

    const [createClassTime, { loading }] = useMutation(CREATE_CLASSTIME, {
        refetchQueries: [ALL_CLASSTIME],
		onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            props.setIsModalVisible(false);
		}
	});

    const [updateClassTime, { loading: updateLoading }] = useMutation(UPDATE_CLASSTIME, {
        refetchQueries: [ALL_CLASSTIME],
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
            updateClassTime({ variables: values });
        } else {
            createClassTime({ variables: values });
        }
        form.resetFields();
    };

    return (
        <Spin spinning={loading || updateLoading} tip="Ачааллаж байна...">
            <Form  
                id="ClassTimeForm"
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

export default ClassTimeForm