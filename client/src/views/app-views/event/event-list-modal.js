import React from 'react'
import { Modal } from 'antd';
import EventCard from './event-card';

const EventListModal = ({ visible, cancel, selectedDate, datas, canDelete, onDelete }) => {

    return (
        <Modal
            title={selectedDate}
			visible={visible}
			footer={null}
			destroyOnClose={true}
            onCancel={cancel}
        >
            { datas.map((data, index) => (
                <EventCard 
                    key={index} 
                    data={data} 
                    canDelete={canDelete}
                    onDelete={onDelete}
                />
            ))}
        </Modal>
        
    )
}

export default EventListModal