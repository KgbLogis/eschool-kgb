import React, { Fragment, useEffect, useState } from 'react';
import { Badge, message, Button, Modal, Select } from 'antd';
import moment from 'moment';
import { PlusCircleOutlined } from '@ant-design/icons';
import { ALL_EVENTS, ALL_EVENTS_BY_DATE, ALL_EVENT_TYPES } from 'graphql/all';
import IntlMessage from 'components/util-components/IntlMessage';
import { useMutation, useQuery } from '@apollo/client';
import Loading from 'components/shared-components/Loading';
import EventModal from './event-modal';
import EventList from './event-list';
import EventListModal from './event-list-modal';
import { DELETE_EVENT } from 'graphql/delete';
import { classNames } from 'utils';

const dateFormat = 'MMMM DD'
const { confirm } = Modal;
const { Option } = Select;

function getDaysOfMonth(year, month) {

	var monthDate = moment(year + '-' + month, 'YYYY-MM');

	var daysInMonth = monthDate.daysInMonth();

	var arrDays = [];

	for (let index = 1; index <= daysInMonth; index++) {
		var current = moment(year + '-' + month + '-' + index).date(index);
		arrDays.push(current);
	}

	return arrDays;

};

const CalendarApp = ({ permissions }) => {

	const [calendarList, setCalendarList] = useState([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [eventListModalVisible, setEventListModalVisible] = useState(false);
	const [selectedDate, setSelectedDate] = useState();
	const [dateEvents, setDateEvents] = useState([]);
	const [dates, setDates] = useState(getDaysOfMonth(2023, 10));
	const [currentDate, setCurrentDate] = useState(moment().format("YYYY-MM-DD"))

	const { data: eventTypes } = useQuery(ALL_EVENT_TYPES);

	const { loading } = useQuery(ALL_EVENTS, {
		onCompleted: data => {
			setCalendarList(data.allEvents);
		}
	})

	const { data: calendarData } = useQuery(ALL_EVENTS_BY_DATE, {
		variables: { date: currentDate }
	})

	const [destroy] = useMutation(DELETE_EVENT, {
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
			setEventListModalVisible(false);
			setModalVisible(false);
			message.success('Амжилттай устлаа!');
		}
	})

	const getListData = (value) => {
		const listData = [];
		calendarData?.allEventsByDate.forEach(elm => {
			const startAt = moment(elm.startAt).format("YYYY-MM-DD")
			const endAt = moment(elm.endAt).format("YYYY-MM-DD")
			const isBetween = moment(value).isBetween(startAt, endAt, undefined, '[]');
			if (isBetween) {
				listData.push(elm)
			}
		})
		return listData;
	}

	const cellRender = value => {
		const listData = getListData(value.format(("YYYY-MM-DD")));
		return (
			<ul className="calendar-event">
				{listData.map((item, i) => (
					<li key={`${item.title}-${i}`}>
						<Badge color={item.eventType.color} text={item.title} />
					</li>
				))}
			</ul>
		);
	}

	const onSelect = value => {
		const selectedDate = moment(value).format(dateFormat);
		const listData = getListData(value.format(("YYYY-MM-DD")));
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

	function onYearSelect(value) {
		setCurrentDate(prevDate => (moment(prevDate).set('year', value).format("YYYY-MM-DD")));
	}

	function onMonthSelect(value) {
		setCurrentDate(prevDate => (moment(prevDate).set('month', value - 1).format("YYYY-MM-DD")));
	}

	function renderNullDate(value) {

		const nullDates = []

		for (let index = 1; index < value; index++) {
			nullDates.push(<div key={index}></div>)
		}

		return (
			nullDates
		)
	}
	useEffect(() => {
		setDates(getDaysOfMonth(moment(currentDate).format("YYYY"), moment(currentDate).format("MM")))
	}, [currentDate])

	if (loading) {
		return (<Loading cover='content' />)
	}

	return (
		<>
			<div className='flex flex-col md:flex-row gap-3'>
				<div className='bg-mkp/10 rounded-4 p-2 md:basis-1/4'>
					<div className='flex flex-row justify-center mt-4'>
						{eventTypes?.allEventTypes.map((event, index) => (
							<span key={index} className="inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-bold text-mkp">
								<svg className="h-3 w-3" viewBox="0 0 6 6" aria-hidden="true" fill={event.color}>
									<circle cx={3} cy={3} r={3} />
								</svg>
								{event.name}
							</span>
						))}
					</div>
					<EventList
						currentDate={currentDate}
						canDelete={permissions.destroy}
						canEdit={permissions.edit}
						list={calendarList}
						onDelete={onDeleteEvent}
						allEventTypes={eventTypes?.allEventTypes}
					/>
				</div>
				<div className='md:basis-3/4'>
					{/* <Calendar
						onSelect={val => onSelect(val)} 
						dateCellRender={cellRender}
					/> */}
					<div className="text-gray-700">
						<div className="flex flex-grow w-full h-full overflow-auto">
							<div className="flex flex-col flex-grow">
								<div className="flex justify-between text-center items-center">
									<div className="flex text-center items-center space-x-4">
										<Select
											onSelect={onYearSelect}
											className=' custom-select text-white active:text-white'
											defaultValue={moment(currentDate).format("YYYY")}
										>
											<Option value={moment().format("YYYY")} >{moment().format("YYYY")}</Option>
											<Option value={moment().add(1, 'years').format("YYYY")} >{moment().add(1, 'years').format("YYYY")}</Option>
										</Select>
										<Select
											onSelect={onMonthSelect}
											// className='w-28'
											defaultValue={moment(currentDate).format("M")}
										>
											<Option value={"1"}>1 сар</Option>
											<Option value={"2"}>2 сар</Option>
											<Option value={"3"}>3 сар</Option>
											<Option value={"4"}>4 сар</Option>
											<Option value={"5"}>5 сар</Option>
											<Option value={"6"}>6 сар</Option>
											<Option value={"7"}>7 сар</Option>
											<Option value={"8"}>8 сар</Option>
											<Option value={"9"}>9 сар</Option>
											<Option value={"10"}>10 сар</Option>
											<Option value={"11"}>11 сар</Option>
											<Option value={"12"}>12 сар</Option>
										</Select>
										<h2 className="text-xl font-bold leading-none text-mkp">{moment(currentDate).format("YYYY-MMMM")}</h2>
									</div>
									<div className=''>
										{permissions.create === true && (
											<Button onClick={() => setModalVisible(true)} type="primary" icon={<PlusCircleOutlined />} block> <IntlMessage id="add_new" /> </Button>
										)}
									</div>
								</div>
								<div className="grid grid-cols-7 py-2 rounded-t-2 mt-2 bg-mkp/10 text-mkp">
									<div className="pl-1 text-sm font-bold text-center ">{moment.weekdays(1)}</div>
									<div className="pl-1 text-sm font-bold text-center ">{moment.weekdays(2)}</div>
									<div className="pl-1 text-sm font-bold text-center ">{moment.weekdays(3)}</div>
									<div className="pl-1 text-sm font-bold text-center ">{moment.weekdays(4)}</div>
									<div className="pl-1 text-sm font-bold text-center ">{moment.weekdays(5)}</div>
									<div className="pl-1 text-sm font-bold text-center ">{moment.weekdays(6)}</div>
									<div className="pl-1 text-sm font-bold text-center ">{moment.weekdays(7)}</div>
								</div>
								<div className="grid flex-grow w-full h-auto grid-cols-7 grid-rows-5 rounded-2">
									{dates.map((item, index) => (
										<Fragment key={index}>
											{index === 0 &&
												renderNullDate(moment(item).isoWeekday())
											}
											<div
												className={classNames(
													moment(item).day() === 0 || moment(item).day() === 6 ? 'bg-mkp/10 text-mkp' : 'bg-white',
													'relative flex flex-col h-30 group border border-mkp hover:cursor-pointer'
												)}
												onClick={() => onSelect(item)}
											>
												<span className="text-right mx-2 my-1 text-lg font-bold">{moment(item).format("DD")}</span>
												{cellRender(item)}
											</div>
										</Fragment>
									))}

								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<EventListModal
				canDelete={permissions.destroy}
				onDelete={onDeleteEvent}
				selectedDate={selectedDate}
				visible={eventListModalVisible}
				cancel={onAddEventCancel}
				datas={dateEvents}
			/>
			<EventModal
				currentDate={currentDate}
				visible={modalVisible}
				cancel={onAddEventCancel}
				allEventTypes={eventTypes?.allEventTypes}
			/>
		</>
	)
}

export default CalendarApp

