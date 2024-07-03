import React, { useState } from 'react';
import { CalendarOutlined } from '@ant-design/icons';
import EventCard from './event-card';
import EventModal from './event-modal';
import Scrollbars from 'react-custom-scrollbars';

const EventList = props => {

	const { list, onDelete, canDelete, canEdit, allEventTypes, refetch } = props

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

    groupArrays.sort(function(a, b){return new Date(a.date) - new Date(b.date)})

    const onSingleEventSelect = (event) => {
        setModalVisible(true);
        setSelectedEvent(event);
    }

	const onSingleEventSelectCancel = () => {
		setModalVisible(false)
	}

	return (
        <>
            <Scrollbars className='h-5/6' >
                { groupArrays.map((item, index) => (
                    <div key={index} className="p-4">
                        <h4>
                            <CalendarOutlined />
                            <span className="ml-2">{item.date}</span>
                        </h4>
                        { item.events.map((event, i) => (
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
            </Scrollbars>
            <EventModal
                formType={'edit'}
                refetch={refetch}
                cancel={onSingleEventSelectCancel}
                visible={modalVisible}
                allEventTypes={allEventTypes}
                event={selectedEvent}
                canEdit={canEdit}
            />
        </>
	)
}

export default EventList