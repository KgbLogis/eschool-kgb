import React, { lazy, Suspense } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { Helmet } from "react-helmet";
import Loading from 'components/shared-components/Loading';
import { APP_PREFIX_PATH, APP_NAME } from 'configs/AppConfig'
import { CheckPer } from 'hooks/checkPermission';

const Program = lazy(() => import(`./programs`));
const DailyFood = lazy(() => import(`./daily-food`));
const Food = lazy(() => import('./daily-food/food'))
const ProgramSubject = lazy(() => import('./program-subject'));
const Section = lazy(() => import(`./section`));
const Student = lazy(() => import(`./student`));
const Teacher = lazy(() => import(`./teacher`));
const TeacherPermission = lazy(() => import('./teacher/permissions'));
const School = lazy(() => import(`./school`));
const SubSchool = lazy(() => import(`./sub_school`));
const Classes = lazy(() => import(`./classes`));
const Mark = lazy(() => import(`./mark`));
const Subject = lazy(() => import(`./subject`));
const OnlineLesson = lazy(() => import(`./online-lesson`));
const OnlineFile = lazy(() => import(`./online-file`));
const Config = lazy(() => import(`./web-configs`));
const Parent = lazy(() => import(`./parent`));
const TestLib = lazy(() => import('./online-test-library'));
const Question = lazy(() => import('./questions'));
const TakeTest = lazy(() => import('./take-test'));
const TakeTestDetail = lazy(() => import('./take-test/detail'));
const Exam = lazy(() => import('./take-test/exam'));
const ShowScore = lazy(() => import('./take-test/show-score'));
const Routine = lazy(() => import(`./routine`));
const MarkBoard = lazy(() => import(`./mark-board`));
const StudentReport = lazy(() => import(`./student-report`));
const UpdatePassword = lazy(() => import('./user-settings/update-password'));
const UpdateProfile = lazy(() => import('./user-settings/update-profile'));
const Live = lazy(() => import('./live'));
const MarkConsolidation = lazy(() => import('./mark-consolidation'));
const TransferStudent = lazy(() => import('./transfer-student'));
const Event = lazy(() => import('./event'));
const EmployeesAttendance = lazy(() => import('./employees-attendance'));
const Employees = lazy(() => import('./employees'));
const Support = lazy(() => import('./support'))
const Plan = lazy(() => import('./plan'))
const ShowPlan = lazy(() => import('./plan/show'))
const Conversation = lazy(() => import('./conversation'))
const DevTeacher = lazy(() => import('./dev-teacher'))
const Assessment = lazy(() => import('./assessment'))
const ContactBook = lazy(() => import('./contact-book'))
const Report = lazy(() => import('./report'))
const FlexTime = lazy(() => import('./flex-time'))

export const AppViews = (currentTitle) => {

    const title = currentTitle.currentTitle;

    return (
        <>
            <Helmet>
                <title>{APP_NAME}</title>
            </Helmet>
            <Suspense fallback={<Loading cover="content" />}>
                <Switch>
                    <Route
                        path={`${APP_PREFIX_PATH}/home`}
                        component={lazy(() => import(`./home`))}
                    />
                    <Route
                        path={`${APP_PREFIX_PATH}/support`}
                        render={props => <Support {...props} />}
                    />
                    <Route
                        path={`${APP_PREFIX_PATH}/conversation`}
                        render={props => <Conversation {...props} />}
                    />
                    <Route
                        path={`${APP_PREFIX_PATH}/student/transfer-student`}
                        render={props => <TransferStudent {...props} />}
                    />
                    <Route
                        path={`${APP_PREFIX_PATH}/report`}
                        render={props => <Report {...props} />}
                    />
                    {CheckPer('view_student') &&
                        <Route
                            path={`${APP_PREFIX_PATH}/student`}
                            render={props => <Student {...props}
                                title={title} />}
                        />
                    }
                    <Route
                        path={`${APP_PREFIX_PATH}/teacher/permissions`}
                        render={props => <TeacherPermission {...props}
                        />}
                    />
                    {CheckPer('view_teacher') &&
                        <Route
                            path={`${APP_PREFIX_PATH}/teacher`}
                            render={props => <Teacher {...props}
                                title={title} />}
                        />
                    }
                    {CheckPer('view_school') &&
                        <Route
                            path={`${APP_PREFIX_PATH}/school`}
                            render={props => <School {...props}
                                title={title} />}
                        />
                    }
                    {CheckPer('view_sub_school') &&
                        <Route
                            path={`${APP_PREFIX_PATH}/sub-school`}
                            render={props => <SubSchool {...props}
                                title={title} />}
                        />
                    }
                    {CheckPer('view_classes') &&
                        <Route
                            path={`${APP_PREFIX_PATH}/classes`}
                            render={props => <Classes {...props}
                                title={title} />}
                        />
                    }
                    {CheckPer('view_program_subject') &&
                        <Route
                            path={`${APP_PREFIX_PATH}/programs/:program`}
                            render={props => <ProgramSubject {...props}
                                title={`Хөтөлбөрийн хичээл`} />}
                        />
                    }
                    {CheckPer('view_program') &&
                        <Route
                            path={`${APP_PREFIX_PATH}/programs`}
                            render={props => <Program {...props}
                                title={title} />}
                        />
                    }
                    <Route
                        path={`${APP_PREFIX_PATH}/food/:dailyMenu`}
                        render={props => <Food {...props}
                            title={title} />}
                    />
                    <Route
                        path={`${APP_PREFIX_PATH}/food`}
                        render={props => <DailyFood {...props}
                            title={title} />}
                    />
                    {CheckPer('view_section') &&
                        <Route
                            path={`${APP_PREFIX_PATH}/section`}
                            render={props => <Section {...props}
                                title={title} />}
                        />
                    }
                    {CheckPer('view_mark') &&
                        <Route
                            path={`${APP_PREFIX_PATH}/mark`}
                            render={props => <Mark {...props}
                                title={title} />}
                        />
                    }
                    {CheckPer('view_subject') &&
                        <Route
                            path={`${APP_PREFIX_PATH}/subject`}
                            render={props => <Subject {...props}
                                title={title} />}
                        />
                    }
                    {CheckPer('view_online_file') &&
                        <Route
                            path={`${APP_PREFIX_PATH}/online-file`}
                            render={props => <OnlineFile {...props}
                                title={title} />}
                        />
                    }
                    {/* {CheckPer('view_online_sub') &&
                        <Route
                            path={`${APP_PREFIX_PATH}/online-lesson/:lesson/:subLesson`}
                            render={props => <Detail {...props}
                                viewAttendance={viewAttendance}
                                title={title} />}
                        />
                    }
                    {CheckPer('view_online_sub') &&
                        <Route
                            path={`${APP_PREFIX_PATH}/online-lesson/:lesson`}
                            render={props => <SubLesson {...props}
                                title={title} />}
                        />
                    } */}
                    {CheckPer('view_online_lesson') &&
                        <Route
                            path={`${APP_PREFIX_PATH}/online-lesson`}
                            render={props => <OnlineLesson {...props}
                                title={title} />}
                        />
                    }
                    {CheckPer('view_parent') &&
                        <Route
                            path={`${APP_PREFIX_PATH}/parent`}
                            render={props => <Parent {...props}
                                title={title} />}
                        />
                    }
                    <Route
                        path={`${APP_PREFIX_PATH}/plan/:id`}
                        render={props => <ShowPlan {...props} />}
                    />
                    <Route
                        path={`${APP_PREFIX_PATH}/plan`}
                        render={props => <Plan {...props}
                            title={title} />}
                    />
                    {CheckPer('view_routine') &&
                        <Route
                            title={title}
                            path={`${APP_PREFIX_PATH}/routine`}
                            render={props => <Routine {...props} title={title} />}
                        />
                    }
                    <Route
                        title={title}
                        path={`${APP_PREFIX_PATH}/dev-teacher`}
                        render={props => <DevTeacher {...props} title={title} />}
                    />
                    <Route
                        title={title}
                        path={`${APP_PREFIX_PATH}/assessment`}
                        render={props => <Assessment {...props} title={title} />}
                    />
                    {CheckPer('view_mark_board') &&
                        <Route
                            title={title}
                            path={`${APP_PREFIX_PATH}/mark-board`}
                            render={props => <MarkBoard {...props} title={title} />}
                        />
                    }
                    {
                        <Route
                            title={title}
                            path={`${APP_PREFIX_PATH}/mark-consolidation`}
                            render={props => <MarkConsolidation {...props} title={title} />}
                        />
                    }
                    <Route
                        title={title}
                        path={`${APP_PREFIX_PATH}/employees-attendance`}
                        render={props => <EmployeesAttendance {...props} title={title} />}
                    />
                    <Route
                        title={title}
                        path={`${APP_PREFIX_PATH}/employees`}
                        render={props => <Employees {...props} title={title} />}
                    />
                    <Route
                        path={`${APP_PREFIX_PATH}/student-report`}
                        render={props => <StudentReport {...props}
                            title={title} />}
                    />
                    <Route
                        path={`${APP_PREFIX_PATH}/live`}
                        render={props => <Live {...props}
                            title={title} />}
                    />
                    <Route
                        path={`${APP_PREFIX_PATH}/my-score`}
                        render={props => <ShowScore {...props}
                            title={title} />}
                    />
                    <Route
                        path={`${APP_PREFIX_PATH}/online-test-library/:test`}
                        render={props => <Question {...props}
                            title={title} />}
                    />
                    <Route
                        path={`${APP_PREFIX_PATH}/online-test-library`}
                        render={props => <TestLib {...props}
                            title={title} />}
                    />
                    <Route
                        path={`${APP_PREFIX_PATH}/take-test/:test`}
                        render={props => <TakeTestDetail {...props}
                            title={title} />}
                    />
                    <Route
                        path={`${APP_PREFIX_PATH}/take-test`}
                        render={props => <TakeTest {...props}
                            title={title} />}
                    />
                    <Route
                        path={`${APP_PREFIX_PATH}/exam/:test`}
                        render={props => <Exam {...props}
                            title={title} />}
                    />
                    <Route
                        path={`${APP_PREFIX_PATH}/update-profile`}
                        render={props => <UpdateProfile {...props}
                            title={title} />}
                    />
                    <Route
                        path={`${APP_PREFIX_PATH}/update-password`}
                        render={props => <UpdatePassword {...props}
                            title={title} />}
                    />
                    <Route
                        path={`${APP_PREFIX_PATH}/configs`}
                        render={props => <Config {...props}
                            title={title} />}
                    />
                    <Route
                        path={`${APP_PREFIX_PATH}/event`}
                        render={props => <Event {...props}
                            title={title} />}
                    />
                    <Route
                        path={`${APP_PREFIX_PATH}/contact-book`}
                        render={props => <ContactBook {...props}
                            title={title} />}
                    />
                    <Route 
                        path={`${APP_PREFIX_PATH}/flex-time`}
                        render={props => <FlexTime {...props}
                            title={title} />}
                    
                    />
                    <Redirect from={`${APP_PREFIX_PATH}`} to={`${APP_PREFIX_PATH}/home`} />
                </Switch>
            </Suspense>
        </>
    )
}

export default React.memo(AppViews);