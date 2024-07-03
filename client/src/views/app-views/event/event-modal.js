import { useMutation } from '@apollo/client';
import { Badge, Button, DatePicker, Form, Input, message, Modal, Select } from 'antd';
import IntlMessage from 'components/util-components/IntlMessage';
import { ALL_EVENTS, ALL_EVENTS_BY_DATE } from 'graphql/all';
import { CREATE_EVENT } from 'graphql/create';
import { UPDATE_EVENT } from 'graphql/update';
import moment from 'moment';
import React, { useEffect } from 'react'

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const EventModal = ({ visible, cancel, currentDate, allEventTypes, formType, event = {} }) => {

	const [form] = Form.useForm();

    const [create, { loading: createLoading }] = useMutation(CREATE_EVENT, {
        refetchQueries: [
			{
				query: ALL_EVENTS,
			},
			{
				query: ALL_EVENTS_BY_DATE,
				variables: { date: currentDate }
			}
		],
		onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            cancel();
		},
    })

    const [update, { loading }] = useMutation(UPDATE_EVENT, {
        refetchQueries: [
			{
				query: ALL_EVENTS,
			},
			{
				query: ALL_EVENTS_BY_DATE,
				variables: { date: currentDate }
			}
		],
		onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            cancel();
		},
    })

    useEffect(() => {

        function setEventData() {
            const newData ={
                title: event.title,
                description: event.description,
                content: event.content,
                eventType: event.eventType?.id,
                dates: [ moment.utc(event.startAt), moment.utc(event.endAt) ]
			}
            form.setFieldsValue(newData);
        }

        if (event) {
            setEventData();
        } else {
            form.resetFields()
        }
    }, [event, form])

	const onSubmit = values => {
        values.startAt = moment.utc(values.dates[0]).format('YYYY-MM-DD HH:mm')
        values.endAt = moment.utc(values.dates[1]).format('YYYY-MM-DD HH:mm')
        if (values.hasOwnProperty('endAt')) {
            if (formType === 'edit') {
                values.id = event.id;
                update({ variables: values });
            } else {
                create({ variables: values });
            }
        }
	}

	return (
		<Modal
			visible={visible}
			footer={null}
			destroyOnClose={true}
            onCancel={cancel}
            forceRender
        >
			<Form
                layout="vertical" 
				name="event-form"
                id="event-form"
                form={form}
				preserve={false}
				onFinish={onSubmit}
            >
				<Form.Item name="title" label={<IntlMessage id="title" />} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    },
                ]}>
					<Input />
				</Form.Item>
				<Form.Item name="eventType" label={<IntlMessage id="event-type" />} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    },
                ]}>
					<Select>
						{
							allEventTypes?.map((elm, index) => (
								<Option value={elm.id} key={index}>
									<Badge color={elm.color} />
									<span className="text-capitalize font-weight-semibold">{elm.name}</span>
								</Option>
							))
						}
					</Select>
				</Form.Item>
                <Form.Item name="description" label={<IntlMessage id="description" />} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    },
                ]}>
					<TextArea rows={4} />
				</Form.Item>
                <Form.Item name="content" label={<IntlMessage id="content" />} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    },
                ]}>
					<TextArea rows={4} />
				</Form.Item>
				<Form.Item name="dates" label={<IntlMessage id="start_end_date" />} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    },
                ]}>
                    <RangePicker className="w-100" showTime />
				</Form.Item>
				<Form.Item className="text-right mb-0">
					<Button type="primary" htmlType="submit" loading={createLoading || loading}>
                        <IntlMessage id="main.okText" />
					</Button>
				</Form.Item>
			</Form>
		</Modal>
	)
}

export default EventModal