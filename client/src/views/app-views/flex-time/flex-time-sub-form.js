import React, { useEffect } from 'react'
import { Form, Input, Spin, TimePicker } from 'antd'
import { useMutation } from '@apollo/client'
import moment from 'moment'
import IntlMessage from 'components/util-components/IntlMessage'
import { ALL_FLEX_TIME_SUBS, CREATE_FLEX_TIME_SUB, UPDATE_FLEX_TIME_SUB } from 'graphql/flex-time'

export default function FlexTimeSubForm({ handleCancel, flexTime, flexTimeSub }) {

    const [form] = Form.useForm()

    const [create, { loading: createLoading }] = useMutation(CREATE_FLEX_TIME_SUB, {
        refetchQueries: [
            {
                query: ALL_FLEX_TIME_SUBS,
                variables: { flexTime: flexTime }
            }
        ],
        onCompleted: res => {
            handleCancel()
        }
    })
    const [update, { loading: updateLoading }] = useMutation(UPDATE_FLEX_TIME_SUB, {
        refetchQueries: [
            {
                query: ALL_FLEX_TIME_SUBS,
                variables: { flexTime: flexTime }
            }
        ],
        onCompleted: res => {
            handleCancel()
        }
    })

    function onFinish(values) {
        values.startAt = values.start_end_date[0].format('HH:mm:ss')
        values.endAt = values.start_end_date[1].format('HH:mm:ss')
        values.flexTime = flexTime
        if (flexTimeSub) {
            values.id = flexTimeSub.id
            update({ variables: values })
        } else {
            create({ variables: values })
        }
    }

    useEffect(() => {
        if (flexTimeSub) {
            form.setFieldsValue({
                start_end_date: [
                    moment(`2022-03-13 ${flexTimeSub.startAt}`),
                    moment(`2022-03-13 ${flexTimeSub.endAt}`)
                ],
                ...flexTimeSub
            })
        }
    }, [form, flexTimeSub])


    return (
        <Spin
            tip="Ачааллаж байна..."
            spinning={updateLoading || createLoading}
        >
            <Form
                id="FlexTimeSubForm"
                layout={'vertical'}
                form={form}
                name="FlexTimeSubForm"
                onFinish={onFinish}
            >
                <Form.Item name="action" label={<IntlMessage id="flexTimeAction" />} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    },
                ]}>
                    <Input />
                </Form.Item>
                <Form.Item name="start_end_date" label={<IntlMessage id="start_end_date" />} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    },
                ]}>
                    <TimePicker.RangePicker format="HH:mm" />
                </Form.Item>
                <Form.Item name="content" label={<IntlMessage id="content" />} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    },
                ]}>
                    <Input.TextArea />
                </Form.Item>
            </Form>
        </Spin>
    )
}
