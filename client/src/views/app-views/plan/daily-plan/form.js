import React, { useEffect } from 'react';
import { Form, Input, message, Select, Spin } from 'antd';
import IntlMessage from 'components/util-components/IntlMessage';
import { useMutation } from '@apollo/client';
import { ALL_DAILY_PLANS, CREATE_DAILY_PLAN, UPDATE_DAILY_PLAN } from 'graphql/plan';
import BraftEditor from 'braft-editor';
import { useParams } from 'react-router-dom';

const { Option } = Select

function DailyPlanForm ({ closeModal, selectedData }) {

    const [form] = Form.useForm();

    const { id } = useParams()

    const [create, { loading: createLoading }] = useMutation(CREATE_DAILY_PLAN, {
        refetchQueries: [{
            query: ALL_DAILY_PLANS,
            variables: { plan: id }
        }],
        onCompleted: data => {
            closeModal();
            message.success("Амжилттай хадгаллаа")
        }
    })

    const [update, { loading: updateLoading }] = useMutation(UPDATE_DAILY_PLAN, {
        refetchQueries: [{
            query: ALL_DAILY_PLANS,
            variables: { plan: id }
        }],
        onCompleted: data => {
            closeModal();
            message.success("Амжилттай хадгаллаа")
        }
    })

    useEffect(() => {
        if (selectedData.id) {
            const formData = {
                action: selectedData.action,
                isAllDay: selectedData.isAllDay,
                ...( selectedData.allDay ?
                        {
                            allDay: BraftEditor.createEditorState(selectedData.allDay)
                        }
                    :
                        {
                            monday: BraftEditor.createEditorState(selectedData.monday),
                            tuesday: BraftEditor.createEditorState(selectedData.tuesday),
                            wednesday: BraftEditor.createEditorState(selectedData.wednesday),
                            thursday: BraftEditor.createEditorState(selectedData.thursday),
                            friday: BraftEditor.createEditorState(selectedData.friday)
                        }
                )
			}
            form.setFieldsValue(formData);
        } else {
            form.resetFields()
        }
    }, [selectedData, form])
    

    const onFinish = values => {
        values.plan = id
        if (values.isAllDay) {
            values.allDay = values.allDay.toHTML();
        } else{
            values.monday = values.monday.toHTML();
            values.tuesday = values.tuesday.toHTML();
            values.wednesday = values.wednesday.toHTML();
            values.thursday = values.thursday.toHTML();
            values.friday = values.friday.toHTML();
        }
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
                id="dailyPlanForm"
                layout={'vertical'}
                form={form}
                name="dailyPlanForm" 
                onFinish={onFinish}
            >
                <Form.Item name="action" label={'Үйл ажиллагаа'} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    },
                    {
                        max: 50,
                        message: <IntlMessage id="form.max" />
                    }
                ]}>
                    <Input />
                </Form.Item>
                <Form.Item name="isAllDay" label={<IntlMessage id="isAllDay" />} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    }
                ]}>
                    <Select>
                        <Option value={true}>Бүх өдөр</Option>
                        <Option value={false}>Өдөр өдрөөр</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) => prevValues.isAllDay !== currentValues.isAllDay}
                >
                {({ getFieldValue }) =>
                    getFieldValue('isAllDay') === true ? (
                        <Form.Item name="allDay" label={<IntlMessage id="allDay" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <BraftEditor
                                className='border rounded-2'
                                language="en"
                            />
                        </Form.Item>
                    ) : 
                    <>
                        <Form.Item name="monday" label={<IntlMessage id="monday" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <BraftEditor
                                className='border rounded-2'
                                language="en"
                            />
                        </Form.Item>
                        <Form.Item name="tuesday" label={<IntlMessage id="tuesday" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <BraftEditor
                                className='border rounded-2'
                                language="en"
                            />
                        </Form.Item>
                        <Form.Item name="wednesday" label={<IntlMessage id="wednesday" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <BraftEditor
                                className='border rounded-2'
                                language="en"
                            />
                        </Form.Item>
                        <Form.Item name="thursday" label={<IntlMessage id="thursday" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <BraftEditor
                                className='border rounded-2'
                                language="en"
                            />
                        </Form.Item>
                        <Form.Item name="friday" label={<IntlMessage id="friday" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <BraftEditor
                                className='border rounded-2'
                                language="en"
                            />
                        </Form.Item>
                    </>
                }
                </Form.Item>
            </Form>
        </Spin>
    );
};

export default DailyPlanForm