import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Card, Row, Col, Modal, Select, Spin } from 'antd';
import moment from 'moment';
import { LocationMarkerIcon } from '@heroicons/react/outline';
import { classNames } from 'utils';
import { UserContext } from 'hooks/UserContextProvider';
import Scrollbars from 'react-custom-scrollbars';

const { Option } = Select;

const dateFormat = 'MMMM DD'

function getDaysOfMonth(year, month) {

	var monthDate = moment(year+'-'+month, 'YYYY-MM');

	var daysInMonth = monthDate.daysInMonth();

	var arrDays = [];

	for (let index = 1; index <= daysInMonth; index++) {
		var current = moment(year+'-'+month+'-'+index).date(index);
		arrDays.push(current.format('YYYY-MM-DD'));
	}

	return arrDays;

};

const CalendarApp = ({ data, loading, fetchTimes }) => {
	const [calendarList, setCalendarList] = useState([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedDate, setSelectedDate] = useState();
	const [dates, setDates] = useState(getDaysOfMonth(2022, 10));
	const [currentDate, setCurrentDate] = useState(moment().format("YYYY-MM-DD"))
	
	const { user } = useContext(UserContext)

	const onSelect = value => {
		const selectedDate = moment(value).format((dateFormat))
		setCalendarList(data.filter(asd => asd.date === moment(value).format(('YYYY-MM-DD'))).sort(function(a, b){return a.time - b.time}))
		setModalVisible(true);
		setSelectedDate(selectedDate)
	}

	const onAddEventCancel = () => {
		setModalVisible(false)
	}

	const cellRender = value => {
		const listData = getListData(moment(value).format((dateFormat)));
		return (
			<Scrollbars 
				// className="overflow-y-auto"
			>
				{listData.map(function (item, index) {
					return (
						<li key={index}>
							<button className="flex items-center flex-shrink-0 h-5 px-1 text-xs hover:bg-mkp-200">
								<span className="flex-shrink-0 w-2 h-2 border border-mkp-500 rounded-full"></span>
								<span className="ml-2 font-light leading-none"></span>
								<span className="ml-2 font-medium leading-none truncate">{item.routine.subject.subject}</span>
							</button>
						</li>
					)
				})}
			</Scrollbars>
		);
	}

	const EventModal = ({ visible, cancel }) => {
	
		return (
			<Modal
				width={1500}
				title={selectedDate}
				visible={visible}
				footer={null}
				destroyOnClose={true}
				onCancel={cancel}
			>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					{ calendarList.map((item, index, array) => (
						<div 
							key={index} 
							className={classNames(
								array[index-1]?.time !== item.time && !user.isStudent ? 'col-start-1'
								: '',
								'bg-background p-2 rounded-2'
							)}
						>
							<p className="text-mkp-800 text-sm">{item.routine.classes.program.program} {item.routine.section.section}</p>
							<span className="text-mkp-800 text-sm">{item.routine.teacher.familyName} {item.routine.teacher.name}</span>
							<h3 className="font-bold mt-px">{item.routine.subject.subject} / {item.routine.subject.content}</h3>
							<div className="flex items-center gap-3 mt-2">
								<span className="bg-mkp-100 text-mkp-700 rounded-full px-3 py-1 text-sm">{item.time}</span>
								<span className="text-slate-600 text-sm flex gap-1 items-center"> 
									<LocationMarkerIcon className='w-4 h-4' />{item.room}
								</span>
							</div>
						</div>
					))}
				</div>
				
			</Modal>
		)
	}

	const getListData = (value) => {
		let listData = [];
		data.forEach(elm => {
			const date = moment(elm.date)
			const formatedDate = date.format((dateFormat))
			if(formatedDate === value) {
				listData.push(elm)
			}
		})
		listData.sort(function(a, b){return a.time - b.time})
		return listData;
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

	function onYearSelect(value) {
		setCurrentDate(prevDate => (moment(prevDate).set('year', value).format("YYYY-MM-DD")));
	}

	function onMonthSelect(value) {
		setCurrentDate(prevDate => (moment(prevDate).set('month', value-1).format("YYYY-MM-DD")));
	}

	useEffect(() => {
		fetchTimes({ variables: { date: currentDate } })
		setDates(getDaysOfMonth(moment(currentDate).format("YYYY"), moment(currentDate).format("MM")))
	}, [fetchTimes, currentDate])	

	return (
		<Card className="calendar mb-0">
			<Row>
				<Col xs={24} sm={24} md={24} lg={24}>
					<Spin spinning={loading} >
						<div className="text-gray-700">

							<div className="flex flex-grow w-full h-full overflow-auto"> 
								
								<div className="flex flex-col flex-grow">
									<div className="flex items-center mt-4">
										<div className="flex ml-6 space-x-4">
											<Select 
												onSelect={onYearSelect}
												className='w-28'
												defaultValue={moment(currentDate).format("YYYY")}
											>
												<Option value={moment().format("YYYY")} >{moment().format("YYYY")}</Option>
												<Option value={moment().add(1, 'years').format("YYYY")} >{moment().add(1, 'years').format("YYYY")}</Option>
											</Select>
											<Select 
												onSelect={onMonthSelect}
												className='w-28'
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
										</div>
										<h2 className="ml-2 text-xl font-bold leading-none">{moment(currentDate).format("YYYY-MMMM")}</h2>
									</div>
									<div className="grid grid-cols-7 mt-4">
										<div className="pl-1 text-sm">Да</div>
										<div className="pl-1 text-sm">Мя</div>
										<div className="pl-1 text-sm">Лх</div>
										<div className="pl-1 text-sm">Пү</div>
										<div className="pl-1 text-sm">Ба</div>
										<div className="pl-1 text-sm">Бя</div>
										<div className="pl-1 text-sm">Ня</div>
									</div>
									<div className="grid flex-grow w-full h-auto grid-cols-7 grid-rows-5 gap-px pt-px mt-1 bg-background">
										{ dates.map((item, index) => (
											<Fragment key={index}>
												{ index === 0 &&
													renderNullDate(moment(item).weekday())
												}
												<div 
													className="relative flex flex-col bg-white h-30 group hover:cursor-pointer"
													onClick={() => onSelect(item)}
												>
													<span className="mx-2 my-1 text-xs font-bold">{item}</span>
													{ cellRender(item)}
												</div>
											</Fragment>
										))}
										
									</div>
								</div>
							</div>
						</div>
					</Spin>
				</Col>
			</Row>
			<EventModal 
				visible={modalVisible}
				cancel={onAddEventCancel}
			/>
		</Card>
	)
}

export default CalendarApp

