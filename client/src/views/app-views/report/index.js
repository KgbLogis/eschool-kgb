import React, { lazy, Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom';
import Loading from 'components/shared-components/Loading';

// const Dashboard = lazy(() => import('./dashboard'));
// const Report = lazy(() => import('./report'));
// const Attendance = lazy(() => import('./attendance'));
// const MarkConsolidation = lazy(() => import('./mark-consolidation'));
const ConsolidatedReport = lazy(() => import('./consolidated-report'));

const Index = (props) => {

    const { match } = props

    const routes = [
        {
            name: 'Нэгдсэн тайлан',
            key: 'view_report',
            route: 'consolidated-report',
            component: ConsolidatedReport
        },
    ]

    return (
        <Suspense fallback={<Loading />}>
            <Switch>
                { routes.map((route, index) => (
                    <Route
                        key={index}
                        path={`${match.url}/${route.route}`} 
                        component={route.component} 
                    />
                ))}
                <Redirect from={`${match.url}`} to={`${match.url}/dashboard`} />
            </Switch>
        </Suspense>
    )
}

export default Index