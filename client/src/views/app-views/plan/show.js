import React, { forwardRef, useRef, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { Button } from 'antd'
import { PrinterOutlined, RollbackOutlined , CheckOutlined, PlusCircleOutlined } from '@ant-design/icons';
import FormModal from 'components/shared-components/FormModal'
import Loading from 'components/shared-components/Loading'
import IntlMessage from 'components/util-components/IntlMessage'
import { ALL_SUB_PLANS, APPROVE_PLAN, PLAN_BY_ID, ALL_DAILY_PLANS } from 'graphql/plan'
import { Link, useParams } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'
import SubPlan from './sub-plan'
import { CheckPer } from 'hooks/checkPermission';
import moment from 'moment';
import DailyPlan from './daily-plan';
import SubPlanForm from './sub-plan/form';

const PrintCard = forwardRef (({ data, permissions, subPlans, dailyPlans, handleSubEdit }, ref) => {

    return (
        <div className='bg-white rounded-4 p-2' ref={ref} >
            <div className='flex flex-row justify-end'>
                <h4 className='text-black font-bold mr-40'>БАТЛАВ: </h4>
                <h4 className=' text-black font-bold'>{data.planById.approvedBy?.familyName} {data.planById.approvedBy?.name}</h4>
            </div>
            <div>
                <h4 className='text-center text-black uppercase'>
                    {data.planById.section.school.name} {data.planById.section.classes.program.program}-{data.planById.section.section} бүлгийн <br/>
                    {moment(data.planById.startDate).format("YYYY.MM.DD")}-{moment(data.planById.endDate).format("YYYY.MM.DD")} ХҮРТЭЛХ ҮЙЛ АЖИЛЛАГААНЫ ТӨЛӨВЛӨЛТ
                </h4>
            </div>
            <DailyPlan 
                data={dailyPlans?.allDailyPlans}
                permissions={permissions}
            />
            <div className='flex justify-center'>
                <p className='mr-40 text-black'>Төлөвлөгөө боловсруулсан багш:</p>
                <p className='text-black'>{`${data.planById.teacher.familyName} ${data.planById.teacher.name}`}</p>
            </div>
            { subPlans?.allSubPlans.map((item, index) => (
                <SubPlan 
                    onClick={handleSubEdit}
                    key={index} 
                    data={item} 
                    permissions={permissions}
                    teacher={`${data.planById.teacher.familyName} ${data.planById.teacher.name}`}
                />
            ))}
        </div>
    )

});

const Show = () => {

    const { id } = useParams()
    
    const componentRef = useRef();
    const subPlanModalRef = useRef()
    
    const [selectedSubPlan, setSelectedSubPlan] = useState({})

    const { data, loading, error } = useQuery(PLAN_BY_ID, {
        variables: { id: id }
    })

    const { data: dailyPlans } = useQuery(ALL_DAILY_PLANS, {
        variables: { plan: id }
    })

    const { data: subPlans } = useQuery(ALL_SUB_PLANS, {
        variables: { plan: id }
    })
    
    const [approvePlan] = useMutation(APPROVE_PLAN, {
        refetchQueries: [
            { 
                query: PLAN_BY_ID, 
                variables: { id: id } 
            }, 
            { 
                query: ALL_DAILY_PLANS,
                variables: { plan: id } 
            }, 
            { 
                query: ALL_SUB_PLANS,
                variables: { plan: id } 
            },
            // ... subPlans?.allSubPlans.map(item => {
            //     return {
            //         query: ALL_SUB_PLAN_ACTIONS,
            //         variables: { subPlan: item.id }
            //     }
            // })
        ]
    })

    const permissions = {
        create: CheckPer('add_plan'), 
        edit: CheckPer('change_plan'),
        delete: CheckPer('delete_plan'),
        approve_plan: CheckPer('approve_plan')
    }

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    function handleApporve() {
        approvePlan({ variables: { plan: id } });
    }
    
    function handleCancel() {
        subPlanModalRef.current.handleCancel()
    }

    function handleSubCreate() {
        if (permissions.create) {
            setSelectedSubPlan({})
            subPlanModalRef.current.handleOpen()
        }
    }

    function handleSubEdit(params) {
        if (permissions.edit) {
            setSelectedSubPlan(params)
            subPlanModalRef.current.handleOpen()
        }
    }

    if (loading) {
        return <Loading cover='content' />
    }
    
    if (error) {
        return (
            <section className="bg-white ">
                <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                    <div className="mx-auto max-w-screen-sm text-center">
                        <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-mkp-600 ">404</h1>
                        <p className="mb-4 text-3xl tracking-tight font-bold text-mkp-600 md:text-4xl ">Хуудас олдсонгүй.</p>
                        <p className="mb-4 text-lg font-light text-gray-500 ">Уучлаарай, бид энэ хуудсыг олж чадсангүй. </p>
                        <Link to={'/app/plan'} className="inline-flex bg-mkp text-white hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-4">Буцах</Link>
                    </div>   
                </div>
            </section>
        )
    }

    return (
        <>
            <FormModal ref={subPlanModalRef} formName="subPlanForm">
                <SubPlanForm 
                    plan={id}
                    selectedData={selectedSubPlan} 
                    closeModal={handleCancel} 
                />
            </FormModal>
            <div className='flex justify-between mb-4'>
                <div>
                    <Link to={'/app/plan'}>
                        <Button type="default" icon={<RollbackOutlined />} > <IntlMessage id="back" /> </Button>
                    </Link>
                </div>
                <div>
                    { !data.planById.approvedBy && permissions.approve_plan &&
                        <Button className='mr-4 bg-green-400 border-green-200' onClick={handleApporve} type="primary" icon={<CheckOutlined />} > Батлах </Button>
                    }
                    {
                        permissions.create && <Button  className='mr-4 bg-slate-400 border-slate-200' onClick={handleSubCreate} type="primary" icon={<PlusCircleOutlined />} > Төлөвлөгөө нэмэх </Button>
                    }
                    <Button onClick={handlePrint} type="primary" icon={<PrinterOutlined />} > <IntlMessage id="print" /> </Button>
                </div>
            </div>
            <div ref={componentRef}>
                <PrintCard 
                    data={data} 
                    subPlans={subPlans} 
                    dailyPlans={dailyPlans}
                    permissions={permissions} 
                    handleSubEdit={handleSubEdit}
                />
            </div>
        </>
    )
}

export default Show