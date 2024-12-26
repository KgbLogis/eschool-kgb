import React, { useState } from 'react';
import { CalendarOutlined } from '@ant-design/icons';
import EventCard from './event-card';
import EventModal from './event-modal';
import Scrollbars from 'react-custom-scrollbars';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';

const EventList = props => {

    const { list, onDelete, canDelete, canEdit, allEventTypes, currentDate } = props

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState({});

    const groups = list.reduce((groups, event) => {
        const date = event.startAt.split('T')[0];

        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(event);
        return groups;
    }, {});

    const groupArrays = Object.keys(groups).map((date) => {
        return {
            date,
            events: groups[date]
        };
    });

    groupArrays.sort(function (a, b) { return new Date(a.date) - new Date(b.date) })

    const onSingleEventSelect = (data) => {
        setModalVisible(true);
        setSelectedEvent(data);
    }

    const onSingleEventSelectCancel = () => {
        setModalVisible(false)
    }

    return (
        <>
            <div className="flex justify-between items-center text-white p-2 bg-emind rounded-2 mx-4 mt-2">
                <div>
                    <ChevronLeftIcon className='h-4 w-4' />
                </div>
                <div>
                    <h4 className="mb-0 text-white">
                        <CalendarOutlined />
                        <span className="ml-2">{currentDate}</span>
                    </h4>
                </div>
                <div>
                    <ChevronRightIcon className='h-4 w-4' />
                </div>
            </div>
            <div className='h-5/6' >
                {groupArrays.map((item, index) => (
                    <div key={index} className="p-4 hidden md:block">
                        <h4>
                            <CalendarOutlined />
                            <span className="ml-2">{item.date}</span>
                        </h4>
                        {item.events.map((event, i) => (
                            <EventCard
                                key={i}
                                data={event}
                                canDelete={canDelete}
                                canEdit={canEdit}
                                onDelete={onDelete}
                                onSingleEventSelect={onSingleEventSelect}
                            />
                        ))}
                    </div>
                ))}
            </div>
            <EventModal
                formType={'edit'}
                cancel={onSingleEventSelectCancel}
                visible={modalVisible}
                allEventTypes={allEventTypes}
                event={selectedEvent}
                currentDate={currentDate}
                canEdit={canEdit}
            />
        </>
    )
}

export default EventList