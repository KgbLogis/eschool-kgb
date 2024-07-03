import React, { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client';
import { Checkbox, message, Modal } from 'antd';
import { DeleteTwoTone } from '@ant-design/icons';
import { PlusCircleIcon } from '@heroicons/react/outline'
import { ALL_SUB_PLAN_ACTIONS, DELETE_SUB_PLAN_ACTION, DELETE_SUB_PLAN, ALL_SUB_PLANS, APPROVE_SUB_PLAN_ACTION } from 'graphql/plan';
import FormModal from 'components/shared-components/FormModal';
import SubPlanActionForm from './sub-plan-action-form';
import { classNames, getSubjectNameByValue } from 'utils';
import { useParams } from 'react-router-dom';

const { confirm } = Modal

const SubPlanActionsRow = ({ onActionRowClick, item, onDelete, permissions }) => {

    const [points, setPoints] = useState({ x: 0, y: 0 });
    const [show, setShow] = useState(false);

    const contextMenuRef = useRef()

    const [approveSubPlanAction, { loading: approveSubPlanActionLoading }] = useMutation(APPROVE_SUB_PLAN_ACTION, {
        refetchQueries: [{
            query: ALL_SUB_PLAN_ACTIONS,
            variables: { subPlan: item.subPlan.id }
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

    function onCheckBoxChange(e) {
        approveSubPlanAction({ variables: { subPlanAction: item.id, isApproved: e.target.checked } });
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
                onClick={() => onActionRowClick(item)}
            >
                <td className="text-sm text-gray-900 border-r print:break-before-auto">{item.action}</td>
                <td className="text-sm text-gray-900 border-r print:break-before-auto" dangerouslySetInnerHTML={{ __html: item.teacherActivity }} />
                <td className="text-sm text-gray-900 border-r print:break-before-auto" dangerouslySetInnerHTML={{ __html: item.studentActivity }} />
                <td
                    className="text-sm text-gray-900 border-r print:hidden"
                    onClick={e => permissions.approve_plan && (e && e.stopPropagation) && e.stopPropagation()}
                >
                    {permissions.approve_plan ?
                        <Checkbox
                            onChange={e => onCheckBoxChange(e)}
                            disabled={approveSubPlanActionLoading}
                            checked={item.approvedBy ? true : false}
                        >
                            {item.approvedBy ? 'Баталсан' : 'Батлагдаагүй'}
                        </Checkbox>
                        :
                        <span>{item.approvedBy ? 'Баталсан' : 'Батлагдаагүй'}</span>
                    }
                </td>
            </tr>
            {show &&
                <tr
                    ref={contextMenuRef}
                    className={classNames(show ? 'absolute' : 'hidden', ' z-10')}
                    style={{
                        top: points.y,
                        left: points.x
                    }}
                >
                    <td className="bg-white w-60 border border-gray-300 rounded-lg flex flex-col text-sm py-4 px-2 text-gray-500">
                        <div className="flex py-1 px-2 rounded hover:bg-background hover:cursor-pointer" onClick={() => onDelete(item.id)}>
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

const Index = ({ data, permissions, teacher, onClick }) => {

    const { id } = useParams()

    const [selectedData, setSelectedData] = useState({})
    const [points, setPoints] = useState({ x: 0, y: 0 });
    const [show, setShow] = useState(false);

    const subPlanActionModalRef = useRef()
    const contextMenuRef = useRef()

    const { data: actions, refetch } = useQuery(ALL_SUB_PLAN_ACTIONS, {
        variables: { subPlan: data.id }
    })

    const [deleteSubPlan] = useMutation(DELETE_SUB_PLAN, {
        refetchQueries: [{
            query: ALL_SUB_PLANS,
            variables: { plan: id }
        }],
        onCompleted: data => {
            message.success("Амжилттай устлаа")
        }
    })

    const [deletePlanAction] = useMutation(DELETE_SUB_PLAN_ACTION, {
        onCompleted: data => {
            message.success("Амжилттай устлаа")
            refetch()
        }
    })

    function onDelete(id) {
        confirm({
            title: 'Устгах уу?',
            okText: 'Устгах',
            okType: 'danger',
            cancelText: 'Болих',
            onOk() {
                deletePlanAction({ variables: { id: id } })
            },
        });
    }

    function onDeleteSubPlan(id) {
        confirm({
            title: 'Устгах уу?',
            okText: 'Устгах',
            okType: 'danger',
            cancelText: 'Болих',
            onOk() {
                deleteSubPlan({ variables: { id: id } })
            },
        });
    }

    function handleCancel() {
        subPlanActionModalRef.current.handleCancel()
    }

    function handleOpen() {
        if (permissions.create) {
            setSelectedData({})
            subPlanActionModalRef.current.handleOpen()
        }
    }

    function onActionRowClick(params) {
        if (permissions.edit) {
            setSelectedData(params)
            subPlanActionModalRef.current.handleOpen()
        }
    }

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

    return (
        <>
            <FormModal ref={subPlanActionModalRef} formName="subPlanActionForm">
                <SubPlanActionForm
                    subPlan={data.id}
                    selectedData={selectedData}
                    closeModal={handleCancel}
                />
            </FormModal>
            <div
                className='hover:cursor-pointer page-break'
                onContextMenuCapture={(e) => {
                    e.preventDefault();
                    if (permissions.delete) {
                        setShow(true);
                        setPoints({ x: e.pageX, y: e.pageY });
                    }
                }}
            >
                <div onClick={() => onClick(data)}>
                    {data.subjectName &&
                        <div className='font-bold text-black whitespace-pre-line'>
                            Суралцахуйн чиглэл: {getSubjectNameByValue(data.subjectName)}
                        </div>
                    }
                    {data.content &&
                        <div className='flex flex-row justify-'>
                            <div className='font-bold text-black pr-1'>Агуулга:</div>
                            <div dangerouslySetInnerHTML={{ __html: data.content }} />
                        </div>
                    }
                    {data.walk &&
                        <div className='font-bold text-black whitespace-pre-line'>
                            Алхалт: {data.walk}
                        </div>
                    }
                    {data.running &&
                        <div className='font-bold text-black whitespace-pre-line'>
                            Гүйлт: {data.running}
                        </div>
                    }
                    {data.jumping &&
                        <div className='font-bold text-black whitespace-pre-line'>
                            Үсрэлт: {data.jumping}
                        </div>
                    }
                    {data.shoot &&
                        <div className='font-bold text-black whitespace-pre-line'>
                            Шидэлт: {data.shoot}
                        </div>
                    }
                    {data.game &&
                        <div className='font-bold text-black whitespace-pre-line'>
                            Гар хурууны хөдөлгөөнөө зохицуулна: {data.hand}
                        </div>
                    }
                    {data.body &&
                        <div className='font-bold text-black whitespace-pre-line'>
                            Бие хөгжүүлэх дасгал: {data.body}
                        </div>
                    }
                    {data.game &&
                        <div className='font-bold text-black whitespace-pre-line'>
                            Тоглоом: {data.game}
                        </div>
                    }
                    {data.goal &&
                        <div className='flex flex-row'>
                            <div className='font-bold text-black pr-1'>Зорилго:</div>
                            <div dangerouslySetInnerHTML={{ __html: data.goal }} />
                        </div>
                    }
                    {data.teachingMethods &&
                        <div className='flex flex-row'>
                            <div className='font-bold text-black pr-1'>Заах арга:</div>
                            <div dangerouslySetInnerHTML={{ __html: data.teachingMethods }} />
                        </div>
                    }
                    {data.consumables &&
                        <div className='flex flex-row'>
                            <div className='font-bold text-black pr-1'>Хэрэглэгдэхүүн:</div>
                            <div dangerouslySetInnerHTML={{ __html: data.consumables }} />
                        </div>
                    }

                </div>
                <div
                    ref={contextMenuRef}
                    className={classNames(show ? 'absolute' : 'hidden', ' z-10')}
                    style={{
                        top: points.y,
                        left: points.x
                    }}
                >
                    <div className="bg-white w-60 border border-gray-300 rounded-lg flex flex-col text-sm py-4 px-2 text-gray-500">
                        <div className="flex py-1 px-2 rounded hover:bg-background hover:cursor-pointer" onClick={() => onDeleteSubPlan(data.id)}>
                            <div className="w-8">
                                <DeleteTwoTone twoToneColor="#eb2f96" key="delete" />
                            </div>
                            <div>Устгах</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <div className="sm:-mx-6 lg:-mx-8">
                    <div className="py-2 inline-block min-w-full print:block sm:px-6 lg:px-8">
                        <div className="">
                            <table className="w-full table-fixed border text-center print:break-before-all">
                                <thead>
                                    <tr className="border-b">
                                        <td className="px-6 py-4  text-sm font-bold text-gray-900 border-r">Үйл ажиллагаа</td>
                                        <td className="text-sm text-gray-900 font-bold px-6 py-4 border-r">Багшийн дэмжлэг, чиглүүлэг</td>
                                        <td className="text-sm text-gray-900 font-bold px-6 py-4 border-r">Хүүхдийн үйл ажиллагаа</td>
                                        <td className="text-sm text-gray-900 font-bold px-6 py-4 border-r print:hidden">Төлөв</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {actions?.allSubPlanActions.map((item, index) => (
                                        <SubPlanActionsRow
                                            key={index}
                                            item={item}
                                            permissions={permissions}
                                            onDelete={onDelete}
                                            onActionRowClick={onActionRowClick}
                                        />
                                    ))}
                                    {permissions.create &&
                                        <tr className="bg-white border-b print:hidden">
                                            <td className="px-6 py-4  font-bold text-gray-900 border-r" colSpan={4}>
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
            <div className='flex justify-center'>
                <p className='mr-40 text-black'>Төлөвлөгөө боловсруулсан багш:</p>
                <p className='text-black'>{teacher}</p>
            </div>
        </>
    )
}

export default Index