import React from 'react';
import { Button } from 'antd'
import { DeleteTwoTone, EditTwoTone } from '@ant-design/icons';
import moment from 'moment';
import { CalendarIcon } from '@heroicons/react/outline';

const EventCard = ({ data, canDelete, onDelete, onSingleEventSelect, canEdit }) => {

    const cardActions = (item) => {
        return (
            <div className='flex justify-between p-2 border-t border-gray-light'>
                { canEdit === true && 
                    <Button
                        onClick={() => onSingleEventSelect(data)}
                        type='text'
                        shape="circle"
                        icon={<EditTwoTone twoToneColor="#ffdb00"/>}
                    />
                }
                { canDelete === true &&
                    <Button
                        onClick={() => onDelete(item.id)}
                        type='text'
                        shape="circle"
                        icon={<DeleteTwoTone twoToneColor={'#f42f2f'}/>}
                    />
                }
            </div>
        )
    }

    return (
        <div 
            className={`flex flex-row justify-between mt-2 hover:cursor-pointer hover:-translate-y-1 hover:scale-102 duration-300`}
        >
            <div className='w-[5%] rounded-l-6' style={{ background: data.eventType.color }} ></div>
            <div className='px-4 w-full'>
                <p
                    className="text-base font-medium text-slate-600 dark:text-navy-100"
                >
                    {data.title}
                </p>
                <div>
                    <span className='flex items-center'>
                        <CalendarIcon className='h-4 text-emind mr-2' />
                        {moment.utc(data.startAt).format('HH:mm')} - {moment.utc(data.endAt).format('HH:mm')}
                    </span>
                    <p className="font-normal text-gray-700 text-sm mb-2">
                        {data.description}
                    </p>
                    <p className="font-normal text-gray-700 text-sm mb-4">
                        {data.content}
                    </p>
                </div>
                { canDelete || canEdit ? (
                    cardActions(data)
                ) : null}
            </div>
        </div>
    )
}

export default EventCard