import React, { useState } from "react";
import { Skeleton } from 'antd';
import StatisticWidget from 'components/shared-components/StatisticWidget';
import ChartWidget from 'components/shared-components/ChartWidget';
import { withRouter } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import IntlMessage from "components/util-components/IntlMessage";
import { StudentSVG, SubjectSVG, TeacherSVG } from "assets/svg/menu-icon";

const DASHBOARD = gql `
    query dashboard {
        dashboard {
            studentCount
            teacherCount
            parentCount
            subjectCount
            logins {
                loginDate
                loginCount
            }
        }
    }
`

export const DefaultDashboard = () => {

    const [countData, setCountData] = useState([])
    const [series, setSeries] = useState([])
    const [xAxis, setXAxis] = useState([])
    
    const { loading } = useQuery(DASHBOARD, {
        onCompleted: data => {
            setCountData([
                {
                    title: <IntlMessage id="student-registration" />,
                    value: data.dashboard.studentCount,
                    svg: StudentSVG,
                    color: 'rgba(159, 177, 183, .1)'
                },
                {
                    title: <IntlMessage id="teacher-registration" />,
                    value: data.dashboard.teacherCount,
                    svg: TeacherSVG,
                    color: 'rgba(159, 177, 183, .1)'
                },
                {
                    title: <IntlMessage id="subject-registration" />,
                    value: data.dashboard.subjectCount,
                    svg: SubjectSVG,
                    color: 'rgba(159, 177, 183, .1)'
                }
            ])
            const ser = data.dashboard.logins.map(item => {
                setXAxis(prevData => [...prevData, item.loginDate])
                return item.loginCount
            })
            setSeries([
                {
                    name: 'Нэвтэрсэн тоо',
                    data: ser
                }
            ])
        }
    });

    return (
        <>  
            <Skeleton loading={loading} active rows={6}>
                <div className="mb-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    { countData?.map((elm, i) => (
                        <StatisticWidget
                            key={i} 
                            color={elm.color}
                            title={elm.title} 
                            value={elm.value}
                            Svg={elm.svg}
                        />
                    ))}
                </div>
                <ChartWidget 
                    title={<IntlMessage id="main.site_status" />}
                    series={series} 
                    xAxis={xAxis} 
                    className="h-2/3"
                />
            </Skeleton>
        </>
    )
}

export default withRouter(DefaultDashboard);
