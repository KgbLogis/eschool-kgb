import React, { useEffect, useRef, useState } from 'react'
import { useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { ALL_DAILY_PLANS, APPROVE_DAILY_PLAN, DELETE_DAILY_PLAN } from 'graphql/plan';
import { DeleteTwoTone } from '@ant-design/icons';
import { Checkbox, message, Modal } from 'antd';
import { PlusCircleIcon } from '@heroicons/react/outline';
import FormModal from 'components/shared-components/FormModal';
import DailyPlanForm from './form';

const { confirm } = Modal

const DailyPlanRow = ({ onRowClick, item, permissions }) => {

    const [points, setPoints] = useState({ x: 0, y: 0 });
    const [show, setShow] = useState(false);

    const contextMenuRef = useRef()

    const { id } = useParams()

    const [deleteDailyPlan] = useMutation(DELETE_DAILY_PLAN, {
        refetchQueries: [{
            query: ALL_DAILY_PLANS,
            variables: { plan: id }
        }],
        onCompleted: data => {
            message.success("Амжилттай устлаа")
        }
    })

    const [approveDailyPlan, { loading: approveDailyPlanLoading }] = useMutation(APPROVE_DAILY_PLAN, {
        refetchQueries: [{
            query: ALL_DAILY_PLANS,
            variables: { plan: id }
        }]
    })

    useEffect(() => {

        function onClickOutside() {
            setShow(false)
        }

        const handleClickOutside = (event) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
                onClickOutside && onClickOutside();
            }
        };
        document.addEventListener('contextmenu', handleClickOutside, true);
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('contextmenu', handleClickOutside, true);
            document.addEventListener('click', handleClickOutside, true);
        };
    }, []);

    function onDeleteDailyPlan(id) {
        confirm({
            title: 'Устгах уу?',
            okText: 'Устгах',
            okType: 'danger',
            cancelText: 'Болих',
            onOk() {
                deleteDailyPlan({ variables: { id: id } })
            },
        });
    }

    function onCheckBoxChange(e) {
        approveDailyPlan({ variables: { dailyPlan: item.id, isApproved: e.target.checked } });
    }

    return (
        <>
            <tr
                className="border-b hover:cursor-pointer break-after-auto break-inside-avoid"
                onContextMenuCapture={(e) => {
                    e.preventDefault();
                    if (permissions.delete) {
                        setShow(true);
                        setPoints({ x: e.pageX, y: e.pageY });
                    }
                }}
                onClick={() => onRowClick(item)}
            >
                <td className="text-sm text-gray-900 border-r print:break-before-auto">{item.action}</td>
                {item.isAllDay ?
                    <>
                        <td
                            className="text-sm text-gray-900 border-r print:break-before-auto"
                            dangerouslySetInnerHTML={{ __html: item.allDay }}
                            colSpan={5}
                        />
                        <td
                            className="text-sm text-gray-900 border-r print:hidden"
                            onClick={e => permissions.approve_plan && (e && e.stopPropagation) && e.stopPropagation()}
                        >
                            {permissions.approve_plan ?
                                <Checkbox
                                    onChange={e => onCheckBoxChange(e)}
                                    disabled={approveDailyPlanLoading}
                                    checked={item.approvedBy ? true : false}
                                >
                                    {item.approvedBy ? 'Баталсан' : 'Батлагдаагүй'}
                                </Checkbox>
                                :
                                <span>{item.approvedBy ? 'Баталсан' : 'Батлагдаагүй'}</span>
                            }
                        </td>
                    </>
                    :
                    <>
                        <td
                            className="text-sm text-gray-900 border-r print:break-before-auto"
                            dangerouslySetInnerHTML={{ __html: item.monday }}
                        />
                        <td
                            className="text-sm text-gray-900 border-r print:break-before-auto"
                            dangerouslySetInnerHTML={{ __html: item.tuesday }}
                        />
                        <td
                            className="text-sm text-gray-900 border-r print:break-before-auto"
                            dangerouslySetInnerHTML={{ __html: item.wednesday }}
                        />
                        <td
                            className="text-sm text-gray-900 border-r print:break-before-auto"
                            dangerouslySetInnerHTML={{ __html: item.thursday }}
                        />
                        <td
                            className="text-sm text-gray-900 border-r print:break-before-auto"
                            dangerouslySetInnerHTML={{ __html: item.friday }}
                        />
                        <td
                            className="text-sm text-gray-900 border-r print:hidden"
                            onClick={e => permissions.approve_plan && (e && e.stopPropagation) && e.stopPropagation()}
                        >
                            {permissions.approve_plan ?
                                <Checkbox
                                    onChange={e => onCheckBoxChange(e)}
                                    disabled={approveDailyPlanLoading}
                                    checked={item.approvedBy ? true : false}
                                >
                                    {item.approvedBy ? 'Баталсан' : 'Батлагдаагүй'}
                                </Checkbox>
                                :
                                <span>{item.approvedBy ? 'Баталсан' : 'Батлагдаагүй'}</span>
                            }
                        </td>
                    </>
                }
            </tr>
            {show &&
                <tr ref={contextMenuRef} className="absolute z-10" style={{
                    top: points.y,
                    left: points.x
                }}>
                    <td className="bg-white w-60 border border-gray-300 rounded-lg flex flex-col text-sm py-4 px-2 text-gray-500">
                        <div className="flex py-1 px-2 rounded hover:bg-background hover:cursor-pointer" onClick={() => onDeleteDailyPlan(item.id)}>
                            <div className="w-8">
                                <DeleteTwoTone twoToneColor="#eb2f96" key="delete" />
                            </div>
                            <div>Устгах</div>
                        </div>
                    </td>
                </tr>
            }
        </>
    )
}

const DailyPlan = ({ data = [], permissions }) => {

    const [selectedData, setSelectedData] = useState({})

    const dailyPlanModalRef = useRef()

    function handleCancel() {
        dailyPlanModalRef.current.handleCancel()
    }

    function handleOpen() {
        if (permissions.create) {
            setSelectedData({})
            dailyPlanModalRef.current.handleOpen()
        }
    }

    function onRowClick(params) {
        if (permissions.edit) {
            setSelectedData(params)
            dailyPlanModalRef.current.handleOpen()
        }
    }

    return (
        <>
            <FormModal ref={dailyPlanModalRef} formName="dailyPlanForm">
                <DailyPlanForm
                    subPlan={data.id}
                    selectedData={selectedData}
                    closeModal={handleCancel}
                />
            </FormModal>
            <div className="flex flex-col">
                <div className="sm:-mx-6 lg:-mx-8">
                    <div className="py-2 inline-block min-w-full print:block sm:px-6 lg:px-8">
                        <div className="">
                            <table className="w-full table-fixed border text-center print:break-before-all">
                                <thead>
                                    <tr className="border-b">
                                        <td className="px-6 py-4  text-sm font-bold text-gray-900 border-r">Үйл ажиллагаа</td>
                                        <td className="text-sm text-gray-900 font-bold px-6 py-4 border-r">Даваа</td>
                                        <td className="text-sm text-gray-900 font-bold px-6 py-4 border-r">Мягмар</td>
                                        <td className="text-sm text-gray-900 font-bold px-6 py-4 border-r">Лхагва</td>
                                        <td className="text-sm text-gray-900 font-bold px-6 py-4 border-r">Пүрэв</td>
                                        <td className="text-sm text-gray-900 font-bold px-6 py-4 border-r">Баасан</td>
                                        <td className="text-sm text-gray-900 font-bold px-6 py-4 border-r print:hidden">Төлөв</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item, index) => (
                                        <DailyPlanRow
                                            onRowClick={onRowClick}
                                            key={index}
                                            item={item}
                                            permissions={permissions}
                                        />
                                    ))}
                                    {permissions.create &&
                                        <tr className="bg-white border-b print:hidden">
                                            <td className="px-6 py-4  font-bold text-gray-900 border-r" colSpan={7}>
                                                <PlusCircleIcon className='h-6 m-auto hover:cursor-pointer' onClick={() => handleOpen()} />
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DailyPlan