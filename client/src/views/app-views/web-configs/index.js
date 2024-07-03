import React, { lazy, Suspense } from 'react';
import { Menu, PageHeader } from 'antd';
import { Link, useLocation, useHistory } from 'react-router-dom';
import InnerAppLayout from 'layouts/inner-app-layout';
import { Switch, Route, Redirect } from "react-router-dom";
import Loading from 'components/shared-components/Loading';
import { CheckPer } from 'hooks/checkPermission';
import IntlMessage from "components/util-components/IntlMessage";
import { useMenu } from 'hooks/useMenu';

const prefix = ''

const SettingsMenu = (props) => {
    const { configNavTree } = useMenu()
	const { match, location } = props
	
	return (
		<div className="w-100">
			{/* <Spin> */}
				<Menu
					defaultSelectedKeys={`${match.url}/${prefix}degree`}
					mode="inline"
					selectedKeys={[location.pathname]}
				>
					{configNavTree?.map(elm => {
						if (elm.submenu.length === 0) {
							return (
								<Menu.Item key={`${match.url}/${prefix}${elm.path}`}>
									<span><IntlMessage id={elm.title} /></span>
									<Link to={`${match.url}/${prefix}${elm.path}`}/>
								</Menu.Item>
							)
						} else {
							return (
								<Menu.SubMenu key={`${match.url}/${prefix}${elm.path}`} title={elm.title}>
									{elm.submenu.map(item =>(
										<Menu.Item key={`${match.url}/${prefix}${item.path}`}>
											<span><IntlMessage id={item.title} /></span>
											<Link to={`${match.url}/${prefix}${item.path}`}/>
										</Menu.Item>
									))}
								</Menu.SubMenu>
							)
						}
					})}
				</Menu>
			{/* </Spin> */}
		</div>
	)
}

const Settings = props => {

	const { match } = props
    const location = useLocation();
    const history = useHistory();

    const spiltedLocation = location.pathname.split('/')

    const name = spiltedLocation.slice(3)[0];

	const Degree = lazy(() => import(`./degree/index`));
	const Activity = lazy(() => import(`./activity/index`));
	const StudentStatus = lazy(() => import(`./student-status/index`));
	const StudentStatusExtra = lazy(() => import(`./student-status-extra/index`));
	const TeacherStatus = lazy(() => import(`./teacher-status/index`));
	const ClassTimes = lazy(() => import(`./class-times/index`));
	const MarkPercentage = lazy(() => import(`./mark-percentage/index`));
	const MarkSetting = lazy(() => import(`./mark-setting/index`));
	const TestLevel = lazy(() => import('./test-level'));
    const Schoolyear = lazy(() => import('./schoolyear'));
    const EventType = lazy(() => import('./event-type'));
    const GroupPer = lazy(() => import('./group-permission'));

    const FoodMenu = lazy(() => import('./food-menu'))
    const FoodMenuFoods = lazy(() => import('./food-menu/foods'))

    const Diplom = lazy(() => import('./diplom'));

    const DiplomFormPage = lazy(() => import('./diplom/form-page'));

	return (
		<InnerAppLayout 
			sideContent={<SettingsMenu {...props}/>}
			mainContent={
                <>
                    <PageHeader
                        title={<IntlMessage id={name ? name : 'configs'} />}
                        onBack={name === spiltedLocation.pop() ? null : () => history.goBack()}
                    />
                    <div className="p-4">
                        <div className="container-fluid">
                            <Suspense fallback={<Loading />}>
                                <Switch>
                                    { CheckPer('view_degree') && 
                                        <Route 
                                            key={'degree'} 
                                            path={`${match.url}/${prefix}degree`}  
                                            render={props => <Degree {...props} title={''} />}
                                        />
                                    }
                                    { CheckPer('view_activity') && 
                                        <Route 
                                            key={'activity'} 
                                            path={`${match.url}/${prefix}activity`}  
                                            render={props => <Activity {...props} title={''} />}
                                        />
                                    }
                                    { CheckPer('view_student_status') && 
                                        <Route 
                                            key={'student-status'} 
                                            path={`${match.url}/${prefix}student-status`}  
                                            render={props => <StudentStatus {...props} title={''} />}
                                        />
                                    }
                                    { CheckPer('view_student_status_extra') && 
                                        <Route 
                                            key={'student-status-extras'} 
                                            path={`${match.url}/${prefix}student-status-extras`}  
                                            render={props => <StudentStatusExtra {...props} title={''} />}
                                        />
                                    }
                                    { CheckPer('view_teacher_status') && 
                                        <Route 
                                            key={'teacher-status'} 
                                            path={`${match.url}/${prefix}teacher-status`}  	
                                            render={props => <TeacherStatus {...props} title={''} />}
                                        />
                                    }
                                    { CheckPer('view_classtime') && 
                                        <Route 
                                            key={'class-times'} 
                                            path={`${match.url}/${prefix}class-times`}  	
                                            render={props => <ClassTimes {...props} title={''} />}
                                        />
                                    }
                                    { CheckPer('view_mark_percentage') && 
                                        <Route 
                                            key={'mark-percentage'} 
                                            path={`${match.url}/${prefix}mark-percentage`}  	
                                            render={props => <MarkPercentage {...props} title={''} />}
                                        />
                                    }
                                    { CheckPer('view_mark_setting') && 
                                        <Route 
                                            key={'mark-setting'} 
                                            path={`${match.url}/${prefix}mark-setting`}  	
                                            render={props => <MarkSetting {...props} title={''} />}
                                        />
                                    }
                                    { CheckPer('view_question_level') &&
                                        <Route 
                                            key={'question_level'} 
                                            path={`${match.url}/${prefix}test-level`}
                                            render={props => <TestLevel {...props} /> } 
                                        />
                                    }
                                    { CheckPer('view_foodmenu') &&
                                        <Route 
                                            key={'food-menu'} 
                                            path={`${match.url}/${prefix}food-menu/:foodMenu`}
                                            render={props => <FoodMenuFoods {...props} /> } 
                                        />
                                    }
                                    { CheckPer('view_foodmenu') &&
                                        <Route 
                                            key={'food-menu'} 
                                            path={`${match.url}/${prefix}food-menu`}
                                            render={props => <FoodMenu {...props} /> } 
                                        />
                                    }
                                    { CheckPer('view_schoolyear') &&
                                        <Route 
                                            key={'schoolyear'} 
                                            path={`${match.url}/${prefix}schoolyear`}
                                            render={props => <Schoolyear {...props} /> } 
                                        />
                                    }
                                    <Route
                                        key={'EventType'}
                                        path={`${match.url}/${prefix}event-type`}
                                        render={props => <EventType {...props} />}
                                    />
                                    { CheckPer('change_permission') &&
                                        <Route
                                            key={'group-permission'}
                                            path={`${match.url}/${prefix}group-permission`}
                                            render={props => <GroupPer {...props} />}
                                        />
                                    }
                                    <Route
                                        key={'Diplom create'}
                                        path={`${match.url}/${prefix}diplom/create`}
                                        render={props => <DiplomFormPage {...props} />}
                                    />
                                    <Route
                                        key={'Diplom edit'}
                                        path={`${match.url}/${prefix}diplom/edit`}
                                        render={props => <DiplomFormPage {...props} />}
                                    />
                                    <Route
                                        key={'Diplom'}
                                        path={`${match.url}/${prefix}diplom`}
                                        render={props => <Diplom {...props} />}
                                    />
                                    <Redirect from={`${match.url}`} to={`${match.url}/${prefix}schoolyear`} />
                                </Switch>
                            </Suspense>
                        </div>
                    </div>
                </>
			}
			sideContentWidth={300}
			sideContentGutter={false}
			border
		/>
	)
}

export default Settings
