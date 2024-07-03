import React, { useEffect } from 'react';
import { Form, Input, message, Spin } from 'antd';
import IntlMessage from 'components/util-components/IntlMessage';
import { useMutation } from '@apollo/client';
import { ALL_SUB_PLAN_ACTIONS, CREATE_SUB_PLAN_ACTION, UPDATE_SUB_PLAN_ACTION } from 'graphql/plan';
import BraftEditor from 'braft-editor';

function SubPlanActionForm ({ closeModal, selectedData, subPlan }) {

    const [form] = Form.useForm();

    const [create, { loading: createLoading }] = useMutation(CREATE_SUB_PLAN_ACTION, {
        refetchQueries: [{
            query: ALL_SUB_PLAN_ACTIONS,
            variables: { subPlan: subPlan }
        }],
        onCompleted: data => {
            closeModal();
            message.success("Амжилттай хадгаллаа")
        }
    })

    const [update, { loading: updateLoading }] = useMutation(UPDATE_SUB_PLAN_ACTION, {
        refetchQueries: [{
            query: ALL_SUB_PLAN_ACTIONS,
            variables: { subPlan: subPlan }
        }],
        onCompleted: data => {
            closeModal();
            message.success("Амжилттай хадгаллаа")
        }
    })

    useEffect(() => {
        if (selectedData.id) {
            const formData ={
                action: selectedData.action,
                teacherActivity: BraftEditor.createEditorState(selectedData.teacherActivity),
                studentActivity: BraftEditor.createEditorState(selectedData.studentActivity)
			}
            form.setFieldsValue(formData);
        } else {
            form.resetFields()
        }
    }, [selectedData, form])
    

    const onFinish = values => {
        values.subPlan= subPlan
        values.teacherActivity = values.teacherActivity.toHTML();
        values.studentActivity = values.studentActivity.toHTML();
        if (selectedData.id) {
            values.id = selectedData.id
            update({ variables: values })
        } else {
            create({ variables: values })
        }
    };

    return (
        <Spin spinning={createLoading || updateLoading} tip="Ачааллаж байна...">
            <Form  
                id="subPlanActionForm"
                layout={'vertical'}
                form={form}
                name="subPlanActionForm" 
                onFinish={onFinish}
            >
                <Form.Item name="action" label={`Үйл ажиллагаа`} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    },
                    {
                        max: 100,
                        message: <IntlMessage id="form.max" />
                    }
                ]}>
                    <Input />
                </Form.Item>
                <Form.Item name="teacherActivity" label={`Багшийн дэмжлэг, чиглүүлэг`} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    }
                ]}>
                    <BraftEditor
                        className='border rounded-2'
                        language="en"
                    />
                </Form.Item>
                <Form.Item name="studentActivity" label={`Хүүхдийн үйл ажиллагаа`} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
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

export default SubPlanActionForm