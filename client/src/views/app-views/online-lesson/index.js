import React, { Suspense, lazy } from 'react'
import { Link, Redirect, Route, Switch, useLocation } from 'react-router-dom'
import Loading from 'components/shared-components/Loading'
import { useQuery } from '@apollo/client'
import { LESSONS_NAV } from 'graphql/lesson'
import { classNames } from 'utils'
import { BookOpenIcon } from '@heroicons/react/outline'

const Lessons = lazy(() => import('./lessons'))
const SubLessons = lazy(() => import('./online-lesson-sub'))
const SubDetail = lazy(() => import('./online-lesson-sub/detail'))

export default function Index(props) {

    const { match } = props

    const location = useLocation()

    const { data, loading } = useQuery(LESSONS_NAV)

    return (
        <>
            <div className="flex flex-col w-full h-full rounded-3xl md:flex-row">
                <div className="flex flex-col w-full bg-mkp/10 m-2 rounded-4 md:w-3/12">
                    <nav className="flex-1 w-full p-6">
                        <div className="space-y-2">
                            {
                                loading ? <Loading /> :
                                    data.allOnlineLessons.map((item, index) => (
                                        <Link
                                            key={index}
                                            to={`${match.url}/sent`}
                                            className="-mx-3 px-3 py-1 flex items-center justify-between text-sm font-medium rounded-lg w-full"
                                        >
                                            <span className="inline-flex border-b-2 border-mkp pb-1 w-full">
                                                <BookOpenIcon
                                                    className={classNames(
                                                        location.pathname === "/app/conversation/sent" ? 'text-mkp-500' : 'text-gray-500',
                                                        `h-6 w-6`
                                                    )}
                                                />
                                                <span
                                                    className={classNames(
                                                        location.pathname === "/app/conversation/sent" ? 'text-mkp-500' : 'text-gray-700',
                                                        `ml-2 `
                                                    )}
                                                >
                                                    {item.subject?.subject}
                                                </span>
                                            </span>
                                        </Link>
                                    ))
                            }
                        </div>
                    </nav>
                </div>
                <Suspense fallback={<Loading cover='content' />}>
                    <Switch>
                        <Route 
                            key={'lessons_by_id'}
                            path={`${match.url}/lessons/:lesson/:subLesson`}
                            render={props => <SubDetail {...props} title={''} />}
                        />
                        <Route
                            key={'lessons_by_id'}
                            path={`${match.url}/lessons/:lesson`}
                            render={props => <SubLessons {...props} title={''} />}
                        />
                        <Route
                            key={'lessons'}
                            path={`${match.url}/lessons`}
                            render={props => <Lessons {...props} title={''} />}
                        />
                        <Redirect from={`${match.url}`} to={`${match.url}/lessons`} />
                    </Switch>
                </Suspense>
            </div>
        </>
    )
}
