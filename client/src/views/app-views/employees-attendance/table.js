import React, { useState } from 'react'
import { Card, DatePicker, Empty, Spin, Table } from 'antd'
import { useQuery } from '@apollo/client';
import moment from 'moment';
import Flex from 'components/shared-components/Flex'
import { ALL_EMPLOYEES_ATTANDANCE_BY_RANGE } from 'graphql/all';
import IntlMessage from 'components/util-components/IntlMessage';

const EmployeesAttendance = () => {

    const [data, setData] = useState([]);

    const [startDate, setStartDate] = useState(moment().startOf('day'))
    const [endDate, setEndDate] = useState(moment().endOf('day'))

    const { loading } = useQuery(ALL_EMPLOYEES_ATTANDANCE_BY_RANGE, {
        variables: {
            startDate: startDate,
            endDate: endDate
        },
        onCompleted: data => {
            setData(data.employeesAttandanceByRange);
        }
    })

    const tableColumns = [
        {
            key: 'employeeCode',
            title: <IntlMessage id="employeeCode" />,
            dataIndex: 'employeeCode',
            render: (_, elm) => (
                <>
                    {elm.user.isTeacher && <span>{elm.user.teacher?.teacherCode}</span>}
                    {elm.user.isEmployee && <span>{elm.user.employee?.employeeCode}</span>}
                </>
            )
        },
        {
            key: 'familyName',
            title: <IntlMessage id="familyName" />,
            dataIndex: 'familyName',
            render: (_, elm) => (
                <>
                    {elm.user.isTeacher && <span>{elm.user.teacher?.familyName}</span>}
                    {elm.user.isEmployee && <span>{elm.user.employee?.familyName}</span>}
                </>
            )
        },
        {
            key: 'name',
            title: <IntlMessage id="name" />,
            dataIndex: 'name',
            render: (_, elm) => (
                <>
                    {elm.user.isTeacher && <span>{elm.user.teacher?.name}</span>}
                    {elm.user.isEmployee && <span>{elm.user.employee?.name}</span>}
                </>
            )
        },
        {
            key: 'name',
            title: "Албан тушаал",
            dataIndex: 'name',
            render: (_, elm) => (
                elm.user.groups?.map((item, index) => (
                    <span key={index} >{item.name} <br /></span>
                ))
            )
        },
        {
            key: 'timeIn',
            title: "Орсон цаг",
            dataIndex: 'timeIn',
            render: (text, elm) => (
                elm.isIn && moment(text).format('YYYY-MM-DD LTS')
            )
        },
        {
            key: 'timeOut',
            title: "Гарсан цаг",
            dataIndex: 'timeOut',
            render: (text, elm) => (
                elm.isOut && moment(text).format('YYYY-MM-DD LTS')
            )
        },
    ]

    function onDateChange(value) {
        if (value) {
            setStartDate(moment(value).startOf('day'))
            setEndDate(moment(value).endOf('day'))
        }
    }

    return (
        <Card>
            <Flex alignItems="center" justifyContent="between" mobileFlex={false}>
                <Flex className="mb-1" mobileFlex={false}>
                    <div className="mr-md-3 mb-3">
                        <DatePicker
                            defaultValue={moment()}
                            onChange={e => onDateChange(e)}
                        />
                    </div>
                </Flex>
            </Flex>
            <div className="table-responsive">
                <Table
                    columns={tableColumns}
                    size="small"
                    dataSource={data}
                    rowKey='id'
                    bordered
                    locale={{
                        emptyText: loading ? <Spin /> : <Empty />
                    }}
                />
            </div>
        </Card>
    )
}

export default EmployeesAttendance