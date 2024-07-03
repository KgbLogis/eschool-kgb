import React, { useRef, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { PlusCircleOutlined } from '@ant-design/icons';
import Loading from 'components/shared-components/Loading'
import { ALL_FLEX_TIMES, ALL_FLEX_TIME_SUBS, DELETE_FLEX_TIME, DELETE_FLEX_TIME_SUB } from 'graphql/flex-time'
import { classNames } from 'utils'
import FlexTimeSubForm from './flex-time-sub-form'
import FormModal from 'components/shared-components/FormModal'
import { Button, Modal } from 'antd'
import IntlMessage from 'components/util-components/IntlMessage';
import { CheckPer } from 'hooks/checkPermission';
import { PencilIcon, XIcon } from '@heroicons/react/outline';
import FlexTimeForm from './flex-time-form';

const { confirm } = Modal;

function FlexTimeSub({ flexTime }) {

    const modalRef = useRef();

    const permissions = {
        create: CheckPer('add_flex_time_sub'),
        update: CheckPer('change_flex_time_sub'),
        delete: CheckPer('delete_flex_time_sub')
    }

    const { data, loading, refetch } = useQuery(ALL_FLEX_TIME_SUBS, {
        variables: { flexTime: flexTime }
    })

    const [destroy] = useMutation(DELETE_FLEX_TIME_SUB, {
        onCompleted: res => {
            refetch()
        }
    })

    const [selectedFlexTimeSub, setSelectedFlexTimeSub] = useState(undefined)

    function handleCancel() {
        modalRef.current.handleCancel()
        setSelectedFlexTimeSub(undefined)
    }

    function handleOpen({ flexTimeSub }) {
        if (permissions.update) {
            modalRef.current.handleOpen()
            setSelectedFlexTimeSub(flexTimeSub)
        }
    }

    function handleDelete(id) {
        confirm({
            title: 'Устгах уу?',
            okText: 'Устгах',
            okType: 'danger',
            cancelText: 'Болих',
            onOk() {
                destroy({ variables: { id: id } });
            },
        });
    }

    if (loading) {
        return <Loading cover='content' />
    }

    return (
        <>
            {permissions.update &&
                <FormModal
                    ref={modalRef}
                    formName="FlexTimeSubForm"
                    forceRender={true}
                >
                    <FlexTimeSubForm
                        handleCancel={handleCancel}
                        flexTime={flexTime}
                        flexTimeSub={selectedFlexTimeSub}
                    />
                </FormModal>
            }
            <div className='flex justify-end mb-4'>
                {permissions.create &&
                    <Button
                        onClick={() => handleOpen({ flexTimeSub: undefined })}
                        type="primary"
                        icon={<PlusCircleOutlined />}
                    >
                        {` `}<IntlMessage id="add_new" />
                    </Button>
                }
            </div>
            <div className='space-y-2'>
                {data?.allFlexTimeSubs.map((flexTimeSub, index) => (
                    <div
                        key={index}
                        className='relative flex flex-row gap-3 rounded-2 bg-emind-200 hover:cursor-pointer'
                        onClick={() => handleOpen({ flexTimeSub: flexTimeSub })}
                    >
                        {permissions.delete &&
                            <div
                                className='absolute right-0 p-2'
                                onClick={e => (e && e.stopPropagation) && e.stopPropagation()}
                            >
                                <XIcon
                                    className='h-4 w-4 hover:text-red-500'
                                    onClick={() => handleDelete(flexTimeSub.id)}
                                />
                            </div>
                        }
                        <div className='flex flex-col items-center justify-center w-20 gap-2 mx-4 text-slate-600'>
                            <span className='mt-2 after:content-[""] after:border-l-4 after:h-20 after:w-0 after:mx-auto after:border-slate-600 after:block after:rounded-2'>
                                {flexTimeSub.startAt.slice(0, 5).toString()}
                            </span>
                            <span className='mb-2'>
                                {flexTimeSub.endAt.slice(0, 5).toString()}
                            </span>
                        </div>
                        <div className='py-4'>
                            <p className='text-xl font-bold'>{flexTimeSub.action}</p>
                            <div className='text-sm text-slate-600'>
                                {flexTimeSub.content}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default function Index() {

    const modalRef = useRef();

    const [selectedFlexTime, setSelectedFlexTime] = useState(undefined)

    const permissions = {
        create: CheckPer('add_flex_time'),
        update: CheckPer('change_flex_time'),
        delete: CheckPer('delete_flex_time')
    }

    const { data: flexTimesData, loading: flexTimesLoading, refetch } = useQuery(ALL_FLEX_TIMES)

    const [destroy] = useMutation(DELETE_FLEX_TIME, {
        onCompleted: res => {
            refetch()
            setSelectedFlexTime(undefined)
        }
    })

    function onFlexTimeClick(flexTime) {
        setSelectedFlexTime(flexTime)
    }

    function handleCancel() {
        modalRef.current.handleCancel()
    }

    function handleOpen({ flexTime }) {
        if (permissions.update) {
            modalRef.current.handleOpen()
            setSelectedFlexTime(flexTime)
        }
    }

    function handleDelete(id) {
        confirm({
            title: 'Устгах уу?',
            okText: 'Устгах',
            okType: 'danger',
            cancelText: 'Болих',
            onOk() {
                destroy({ variables: { id: id } });
            },
        });
    }

    if (flexTimesLoading) {
        return (<Loading cover='content' />)
    }



    return (
        <>
            <div className='max-w-5xl mx-auto'>
                {permissions.update &&
                    <FormModal
                        ref={modalRef}
                        formName="FlexTimeForm"
                        forceRender={true}
                    >
                        <FlexTimeForm
                            handleCancel={handleCancel}
                            flexTime={selectedFlexTime}
                        />
                    </FormModal>
                }
                <div className='flex justify-end mb-4'>
                    {permissions.create &&
                        <Button
                            onClick={() => handleOpen({ flexTime: undefined })}
                            type="primary"
                            icon={<PlusCircleOutlined />}
                        >
                            {` `}<IntlMessage id="add_new" />
                        </Button>
                    }
                </div>
                <div className='mb-4'>
                    <div className='flex flex-wrap gap-5'>
                        {flexTimesData.allFlexTimes.map((flexTime, index) => (
                            <div
                                key={index}
                                onClick={() => onFlexTimeClick(flexTime)}
                                className={classNames(
                                    selectedFlexTime === flexTime ? 'bg-emind-300' : 'bg-emind-200',
                                    'relative flex-grow basis-60 text-center rounded-2 hover:cursor-pointer'
                                )}
                            >
                                {permissions.delete &&
                                    <div
                                        className='absolute right-0 p-2 flex gap-2'
                                        onClick={e => (e && e.stopPropagation) && e.stopPropagation()}
                                    >
                                        <PencilIcon
                                            className='h-4 w-4 hover:text-yellow-500'
                                            onClick={() => handleOpen({ flexTime: flexTime })}
                                        />
                                        <XIcon
                                            className='h-4 w-4 hover:text-red-500'
                                            onClick={() => handleDelete(flexTime.id)}
                                        />
                                    </div>
                                }
                                <p className='p-4 '>{flexTime.program.program}</p>
                            </div>
                        ))}
                    </div>
                </div>
                {selectedFlexTime && <FlexTimeSub flexTime={selectedFlexTime.id} />}
            </div>
        </>
    )
}
