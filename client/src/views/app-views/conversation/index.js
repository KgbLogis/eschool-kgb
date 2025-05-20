import React, { lazy, Suspense, useRef } from 'react'
import { Button } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons';
import { Link, Redirect, Route, Switch, useLocation } from 'react-router-dom'
import Loading from 'components/shared-components/Loading'
import { classNames } from 'utils';
import FormModal from 'components/shared-components/FormModal';
import ConversationForm from './form';
import { InboxSVG, SentSVG } from 'assets/svg/menu-icon';

const Index = (props) => {

    const { match } = props

    const location = useLocation()

    const formModalRef = useRef()

    const Inbox = lazy(() => import(`./inbox`))
    const Sent = lazy(() => import('./sent'))

    function handleOpen() {
        formModalRef.current.handleOpen()
    }

    function handleCancel() {
        formModalRef.current.handleCancel()
    }

    return (
        <>
            <FormModal ref={formModalRef} okText={"Илгээх"}>
                <ConversationForm handleCancel={handleCancel} />
            </FormModal>
            <div className="flex flex-col w-full h-full rounded-3xl md:flex-row">
                <div className="flex flex-col w-full bg-mkp/10 m-2 rounded-4 md:w-2/12">
                    <Button 
                        className='mx-auto mt-4' 
                        type='primary' 
                        icon={<PlusCircleOutlined />} 
                        onClick={handleOpen}
                    >Захидал бичих</Button>
                    <nav className="flex-1 w-64 p-6">
                        <div className="space-y-2">
                            <Link 
                                to={`${match.url}/inbox`}
                                className="-mx-3 px-3 py-1 flex items-center justify-between text-sm font-medium rounded-lg"
                            >
                                <span className="inline-flex">
                                    <InboxSVG
                                        className={classNames(
                                            location.pathname === "/app/conversation/inbox" ? 'fill-mkp-500' : 'fill-gray-500',
                                            `h-6 w-6`
                                        )}
                                    />
                                <span
                                    className={classNames(
                                        location.pathname === "/app/conversation/inbox" ? 'text-mkp-500' : 'text-gray-700',
                                        `ml-2 `
                                    )}
                                >Ирсэн</span>
                                </span>
                            </Link>
                            <Link 
                                to={`${match.url}/sent`}
                                className="-mx-3 px-3 py-1 flex items-center justify-between text-sm font-medium rounded-lg"
                            >
                                <span className="inline-flex">
                                    <SentSVG 
                                        className={classNames(
                                            location.pathname === "/app/conversation/sent" ? 'fill-mkp-500' : 'fill-gray-500',
                                            `h-6 w-6`
                                        )}
                                    />
                                <span 
                                    className={classNames(
                                        location.pathname === "/app/conversation/sent" ? 'text-mkp-500' : 'text-gray-700',
                                        `ml-2 `
                                    )}
                                >Илгээсэн</span>
                                </span>
                            </Link>
                        </div>
                    </nav>
                </div>
                <Suspense fallback={<Loading cover='content' />}>
                    <Switch>
                        <Route 
                            key={'inbox'} 
                            path={`${match.url}/inbox`}  
                            render={props => <Inbox {...props} title={''} />}
                        />
                        <Route 
                            key={'sent'} 
                            path={`${match.url}/sent`}  
                            render={props => <Sent {...props} title={''} />}
                        />
                        <Redirect from={`${match.url}`} to={`${match.url}/inbox`} />
                    </Switch>
                </Suspense>
            </div>
        </>
    )
}

export default Index