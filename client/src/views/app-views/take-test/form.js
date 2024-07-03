import React, { useEffect } from 'react';
import { Form, Input, message, Spin, DatePicker, InputNumber, Select } from 'antd';
import { useMutation } from '@apollo/client';
import { ALL_TAKE_TEST, UPDATE_TAKE_TEST, CREATE_TAKE_TEST } from 'graphql/test';
import moment from 'moment';
import IntlMessage from 'components/util-components/IntlMessage';

const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

function TestForm ({editData, formType, setIsModalVisible}) {

    const [form] = Form.useForm();

    const [create, { loading: createLoading }] = useMutation(CREATE_TAKE_TEST, {
        refetchQueries: [ALL_TAKE_TEST],
		onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            setIsModalVisible(false);
		}
	});

    const [update, { loading: updateLoading }] = useMutation(UPDATE_TAKE_TEST, {
        refetchQueries: [ALL_TAKE_TEST],
        onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            setIsModalVisible(false);
        }
    })

    useEffect(() => {
        if(formType === "edit") {
            let splitStart = editData.startAt.split('T')
            splitStart = splitStart[0]+' '+splitStart[1];
            splitStart = splitStart.split('+')
            splitStart= splitStart[0];
            let splitEnd = editData.endAt.split('T')
            splitEnd = splitEnd[0]+' '+splitEnd[1];
            splitEnd = splitEnd.split('+')
            splitEnd= splitEnd[0];
            const newData ={
				title: editData.title,
				description: editData.description,
				duration: editData.duration,
                status: editData.status,
                date: [moment(splitStart), moment(splitEnd)],
			}
            form.setFieldsValue(newData);
        } else if(formType === "create") {
            form.resetFields();
        }
    }, [editData, form, formType]);

    const onFinish = values => {
        values.date.map(function (date, index) {
            if (index === 0) {
                values.startAt = moment(date).format("YYYY-MM-DDTHH:mm:ss+00:00")
            } else {
                values.endAt = moment(date).format("YYYY-MM-DDTHH:mm:ss+00:00") 
            }
            return null
        })
        if (formType === "edit") {
            values.id = editData.id
            update({ variables: values})
        } else {
            values.status = "CLOSED";
            create({ variables: values })
        }
    };

    return (
        <Spin spinning={createLoading || updateLoading} tip="Ачааллаж байна...">
            <Form  
                id="TestForm"
                layout={'vertical'}
                form={form}
                name="school" 
                onFinish={onFinish}
            >
                <Form.Item name="title" label={<IntlMessage id="title" />} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    },
                ]}>
                    <Input />
                </Form.Item>
                <Form.Item name="description" label={<IntlMessage id="description" />} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    },
                ]}>
                    <TextArea rows={4} />
                </Form.Item>
                <Form.Item name="date" label={<IntlMessage id="start_end_date" />} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    }
                ]}>
                     <RangePicker showTime />
                </Form.Item>
                <Form.Item name="duration" label={<IntlMessage id="duration" />} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    }
                ]}>
                    <InputNumber min={1} style={{ width: '100%' }}  />
                </Form.Item>
                { formType === "edit" &&
                    <Form.Item name="status" label={<IntlMessage id="status" />} rules={[
                        {
                            required: true,
                            message: <IntlMessage id="form.required" />
                        }
                    ]}>
                        <Select>
                            <Option value={'OPEN'} >{<IntlMessage id="status.open" />}</Option>
                            <Option value={'CLOSED'} >{<IntlMessage id="status.closed" />}</Option>
                        </Select>
                    </Form.Item>
                }
            </Form>
        </Spin>
    );
};

export default TestForm