import React, { useState } from 'react';
import { Calendar, Badge, Card, Row, Col, message, Button, Modal } from 'antd';
import moment from 'moment';
import { PlusCircleOutlined } from '@ant-design/icons';
import { ALL_EVENTS, ALL_EVENT_TYPES } from 'graphql/all';
import IntlMessage from 'components/util-components/IntlMessage';
import { useMutation, useQuery } from '@apollo/client';
import Loading from 'components/shared-components/Loading';
import EventModal from './event-modal';
import EventList from './event-list';
import EventListModal from './event-list-modal';
import { DELETE_EVENT } from 'graphql/delete';

const dateFormat = 'MMMM DD'
const { confirm } = Modal;

const CalendarApp = ({ permissions }) => {
    
	const [calendarList, setCalendarList] = useState([]);
	const [modalVisible, setModalVisible] = useState(false);
    const [eventListModalVisible, setEventListModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState();
    const [dateEvents, setDateEvents] = useState([]);

    const { data: eventTypes } = useQuery(ALL_EVENT_TYPES);

    const { loading, refetch } = useQuery(ALL_EVENTS, {
        onCompleted: data => {
            setCalendarList(data.allEvents);
        }
    })

    const [destroy] = useMutation(DELETE_EVENT, {
        onCompleted: data => {
            setEventListModalVisible(false);
            setModalVisible(false);
            message.success('Амжилттай устлаа!');
            refetch();
        }
    })

	const cellRender = value => {
		const listData = getListData(value.format((dateFormat)));
		return (
			<ul className="calendar-event">
				{listData.map((item, i) => (
					<li key={`${item.title}-${i}`}>
						<Badge color={item.eventType.color} text={item.title}/>
					</li>
				))}
			</ul>
		);
	}

	const getListData = (value) => {
		const listData = [];
		calendarList.forEach(elm => {
			const date = moment(elm.startAt)
			const formatedDate = date.format(dateFormat)
			if(formatedDate === value) {
				listData.push(elm)
			}
		})
        listData.sort(function(a, b){return new Date(a.startAt) - new Date(b.startAt)})
		return listData;
	}

	const onSelect = value => {
        const selectedDate = moment(value).format(dateFormat);
        const listData = []
        calendarList.filter(asd => moment(asd.startAt).format('YYYY-MM-DD') === value.format(('YYYY-MM-DD'))).map(filteredData => (
			listData.push(filteredData)
		))
        listData.sort(function(a, b){return new Date(a.startAt) - new Date(b.startAt)})
        setDateEvents(listData);
        setSelectedDate(selectedDate);
		setEventListModalVisible(true);
	}

	const onDeleteEvent = (item) => {
        
        confirm({
            title: "Устгах уу?",
            okText: "Устгах",
            okType: 'danger',
            cancelText: "Болих",
            onOk() {
                destroy({ variables: { id: item } })
            },
        });
	}

	const onAddEventCancel = () => {
		setModalVisible(false);
        setEventListModalVisible(false);
	}

    if (loading) {
        return (<Loading cover='content' />)
    }

	return (
		<Card 
            className="calendar"
        >
			<div className='justify-between md:flex'>
				<div className='hidden md:block'>
					{ eventTypes?.allEventTypes.map((event, index) => (
						<Badge key={index} className='mr-4' color={event.color} text={event.name}/>
					))}
				</div>
				<div className=''>
					{ permissions.create === true && (
						<Button onClick={() => setModalVisible(true)} type="primary" icon={<PlusCircleOutlined />} block> <IntlMessage id="add_new" /> </Button>
					)}
				</div>
			</div>
			<Row gutter={[16, 16]}>
				<Col xs={24} sm={24} md={9} lg={6}>
					<h2 className="mb-4"><IntlMessage id="event" /></h2>
					<EventList 
                        canDelete={permissions.destroy}
                        canEdit={permissions.edit}
						list={calendarList} 
						onDelete={onDeleteEvent}
                        allEventTypes={eventTypes?.allEventTypes}
                        refetch={refetch}
					/>
				</Col>
				<Col xs={24} sm={24} md={15} lg={18}>
					<Calendar
						onSelect={val => onSelect(val)} 
						dateCellRender={cellRender}
					/>
				</Col>
			</Row>
            <EventListModal 
                canDelete={permissions.destroy}
                onDelete={onDeleteEvent}
                selectedDate={selectedDate}
				visible={eventListModalVisible}
				cancel={onAddEventCancel}
                datas={dateEvents}
            />
			<EventModal 
                refetch={refetch}
				visible={modalVisible}
				cancel={onAddEventCancel}
                allEventTypes={eventTypes?.allEventTypes}
			/>
		</Card>
	)
}

export default CalendarApp

