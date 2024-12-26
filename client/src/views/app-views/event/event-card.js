import React, { useState } from 'react';
import { Button, Modal, Popconfirm } from 'antd'
import { DeleteOutlined, FormOutlined } from '@ant-design/icons';
import moment from 'moment';
import { CalendarIcon } from '@heroicons/react/outline';

const EventCard = ({ data, canDelete, onDelete, onSingleEventSelect, canEdit }) => {

    const [isEventModalVisible, setIsEventModalVisible] = useState(false)

    function handleCancel() {
        setIsEventModalVisible(false);
    }

    function handleEdit() {
        onSingleEventSelect(data);
        setIsEventModalVisible(false);
    }

    return (
        <>
            <div
                className={`bg-emind flex flex-row rounded-2 justify-between mt-2 hover:cursor-pointer hover:-translate-y-1 hover:scale-102 duration-300`}
                onClick={() => setIsEventModalVisible(true)}
            >
                <div className='px-4 w-full'>
                    <p
                        className="text-base font-medium text-slate-100 mt-2"
                    >
                        {data.title}
                    </p>
                    <div>
                        <span className='flex items-center text-slate-200'>
                            <CalendarIcon className='h-4 mr-2' />
                            {moment.utc(data.startAt).format('HH:mm')} - {moment.utc(data.endAt).format('HH:mm')}
                        </span>
                        <div className='w-full mt-1' style={{ borderLeft: `2px solid ${data.eventType.color}` }}>
                            <p className="font-normal text-gray-200 text-sm mb-2 ml-2">
                                {data.description}
                            </p>
                        </div>
                    </div>
                    {/* {show ? (
                    cardActions(data)
                ) : null} */}
                </div>
            </div>
            <Modal
                title={data.title}
                visible={isEventModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <div className='absolute w-full rounded-t-1 h-14 top-[0px] right-0' style={{ backgroundColor: data.eventType.color }} />
                <div className='absolute top-[13px] right-12'>
                    {canDelete && (
                        <Popconfirm
                            title="Үйл ажиллагаа устгах"
                            description="Энэ үйл ажиллагааг устгах уу?"
                            onConfirm={() => onDelete(data.id)}
                            okText="Устгах"
                            cancelText="Болих"
                        >
                            <Button
                                size='small'
                                type='text'
                                className='ml-2 h-[22px] w-[22px]'
                                icon={<DeleteOutlined className='brightness-50 hover:brightness-[.25] text-slate-100' style={{ color: data.eventType.color }} />}
                            />
                        </Popconfirm>
                    )}
                    {canEdit && (
                        <Button
                            size='small'
                            type='text'
                            className='ml-2 h-[22px] w-[22px]'
                            onClick={() => handleEdit()}
                            icon={<FormOutlined className='brightness-50 hover:brightness-[.25] text-slate-100' style={{ color: data.eventType.color }} />}
                        />
                    )}
                </div>
                <div className="relative">
                    <div
                        className={`flex flex-row justify-between`}
                    >
                        <div>
                            <span className='flex items-center'>
                                <CalendarIcon className='h-4 text-emind mr-2' />
                                {moment.utc(data.startAt).format('HH:mm')} - {moment.utc(data.endAt).format('HH:mm')}
                            </span>
                            <p className="whitespace-pre-line font-normal text-gray-700 text-sm mb-2">
                                {data.description}
                            </p>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default EventCard