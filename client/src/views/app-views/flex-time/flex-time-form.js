import React, { useEffect } from 'react'
import { Form, Select, Spin, Switch } from 'antd'
import { useMutation, useQuery } from '@apollo/client'
import IntlMessage from 'components/util-components/IntlMessage'
import { ALL_FLEX_TIMES, CREATE_FLEX_TIME, UPDATE_FLEX_TIME } from 'graphql/flex-time'
import { SELECT_PROGRAM } from 'graphql/select'

const { Option } = Select

export default function FlexTimeForm({ handleCancel, flexTime }) {

    const [form] = Form.useForm()

    const { data: programData } = useQuery(SELECT_PROGRAM)

    const [create, { loading: createLoading }] = useMutation(CREATE_FLEX_TIME, {
        refetchQueries: [
            {
                query: ALL_FLEX_TIMES
            }
        ],
        onCompleted: res => {
            handleCancel()
        }
    })
    const [update, { loading: updateLoading }] = useMutation(UPDATE_FLEX_TIME, {
        refetchQueries: [
            {
                query: ALL_FLEX_TIMES
            }
        ],
        onCompleted: res => {
            handleCancel()
        }
    })

    function onFinish(values) {
        if (flexTime) {
            values.id = flexTime.id
            update({ variables: values })
        } else {
            create({ variables: values })
        }
    }

    useEffect(() => {
        if (flexTime) {
            form.setFieldsValue({
                program: flexTime.program.id,
                isCurrent: flexTime.isCurrent
            })
        }
    }, [form, flexTime])


    return (
        <Spin
            tip="Ачааллаж байна..."
            spinning={updateLoading || createLoading}
        >
            <Form
                id="FlexTimeForm"
                layout={'vertical'}
                form={form}
                name="FlexTimeForm"
                onFinish={onFinish}
            >
                <Form.Item name="program" label={<IntlMessage id="program" />} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    },
                ]}>
                    <Select>
                        {programData?.allPrograms.map(program => (
                            <Option key={program.id} value={program.id}>{program.program}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="isCurrent" label={<IntlMessage id="isCurrent" />} valuePropName="checked" rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    },
                ]}>
                    <Switch checkedChildren="Үндсэн" unCheckedChildren="Үндсэн биш" />
                </Form.Item>
            </Form>
        </Spin>
    )
}
