import React, { useState } from "react";
import { Skeleton } from 'antd';
import StatisticWidget from 'components/shared-components/StatisticWidget';
import ChartWidget from 'components/shared-components/ChartWidget';
import { withRouter } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import IntlMessage from "components/util-components/IntlMessage";
import { OnlineLessonSVG, StudentSVG, SubjectSVG, TeacherSVG } from "assets/svg/menu-icon";

const DASHBOARD = gql`
    query dashboard {
        dashboard {
            studentCount
            teacherCount
            parentCount
            subjectCount
            onlineLessonCount
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
                    color1: '#C67BFC',
                    color2: '#5971FF',
                    colorType: 1
                },
                {
                    title: <IntlMessage id="teacher-registration" />,
                    value: data.dashboard.teacherCount,
                    svg: TeacherSVG,
                    color: 'rgba(159, 177, 183, .1)',
                    color1: '#727DFD',
                    color2: '#33A1EE',
                    colorType: 2
                },
                {
                    title: <IntlMessage id="subject-registration" />,
                    value: data.dashboard.subjectCount,
                    svg: SubjectSVG,
                    color: 'rgba(159, 177, 183, .1)',
                    color1: '#E7687F',
                    color2: '#F29A5F',
                    colorType: 3
                },
                {
                    title: <IntlMessage id="online-lesson-registration" />,
                    value: data.dashboard.onlineLessonCount,
                    svg: OnlineLessonSVG,
                    color: 'rgba(159, 177, 183, .1)',
                    color1: '#43D49B',
                    color2: '#9ADD68',
                    colorType: 4
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
                <div className="mb-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {countData?.map((elm, i) => (
                        <StatisticWidget
                            key={i}
                            color={elm.color}
                            title={elm.title}
                            value={elm.value}
                            Svg={elm.svg}
                            colorType={elm.colorType}
                            color1={elm.color1}
                            color2={elm.color2}
                        />
                    ))}
                </div>
                <ChartWidget
                    title={<IntlMessage id="main.site_status" />}
                    series={series}
                    xAxis={xAxis}
                    className="h-2/3"
                    customOptions={{
                        colors: ['#009A8E']
                    }}
                />
            </Skeleton>
        </>
    )
}

export default withRouter(DefaultDashboard);
