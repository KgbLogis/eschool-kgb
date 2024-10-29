import { useState, useEffect } from "react";
import {
  ClassesSVG,
  ConfigSVG,
  ConversationSVG,
  EmployeesAttendanceSVG,
  EmployeesSVG,
  EventSVG,
  HomeSVG,
  LiveSVG,
  OnlineFileSVG,
  OnlineLessonSVG,
  ParentSVG,
  ProgramSVG,
  ReportSVG,
  RoutineSVG,
  SchoolSchemaSVG,
  SchoolSVG,
  StudentSVG,
  SubjectSVG,
  SubSchoolSVG,
  TeacherSVG,
  UsersSVG,
  OnlineViewSVG
} from "assets/svg/menu-icon";
import { CheckPer } from "./checkPermission";

export function useMenu() {
  const [userNav, setUserNav] = useState([]);
  const [configNav, setConfigNav] = useState([]);

  const [isRefetch, setIsRefetch] = useState(true);

  const isLoading = CheckPer("loading");

  const permissions = {
    view_home: CheckPer("view_home"),
    view_student: CheckPer("view_student"),
    view_teacher: CheckPer("view_teacher"),
    view_parent: CheckPer("view_parent"),
    view_employee: CheckPer("view_employee"),
    view_live: CheckPer("view_live"),
    view_school: CheckPer("view_school"),
    view_sub_school: CheckPer("view_sub_school"),
    view_program: CheckPer("view_program"),
    view_classes: CheckPer("view_classes"),
    view_subject: CheckPer("view_subject"),
    view_event: CheckPer("view_event"),
    view_conversation: CheckPer("view_conversation"),
    view_plan: CheckPer("view_plan"),
    view_report: CheckPer("view_report"),
    view_devteacher: CheckPer("view_devteacher"),
    view_online_file: CheckPer("add_online_file"),
    view_online_lesson: CheckPer("view_online_lesson"),
    view_take_test: CheckPer("view_take_test"),
    view_mark_board: CheckPer("view_mark_board"),
    view_routine: CheckPer("view_routine"),
    view_mark_report: CheckPer("view_mark_report"),
    view_student_report: CheckPer("view_student_report"),
    view_employee_attandance: CheckPer("view_employee_attandance"),
    configs: CheckPer("configs"),
    view_planmark: CheckPer("view_planmark"),
    view_event_type: CheckPer("view_event_type"),
    view_mark_percentage: CheckPer("view_mark_percentage"),
    view_mark_setting: CheckPer("view_mark_setting"),
    view_question_level: CheckPer("view_question_level"),
    view_group: CheckPer("view_group"),
    view_teacher_status: CheckPer("view_teacher_status"),
    view_student_status_extra: CheckPer("view_student_status_extra"),
    view_student_status: CheckPer("view_student_status"),
    view_classtime: CheckPer("view_classtime"),
    view_activity: CheckPer("view_activity"),
    view_schoolyear: CheckPer("view_schoolyear"),
    view_degree: CheckPer("view_degree"),
    view_food: CheckPer("view_food"),
    view_foodmenu: CheckPer("view_foodmenu"),
    // view_camera: CheckPer("view_camera"),
    view_contactbook: CheckPer("view_contactbook"),
    view_flex_time: CheckPer("view_flex_time")
  };

  const mainNavTree = [
    {
      key: "view_stdudent",
      path: "#",
      title: "users",
      icon: "users",
      priority: 1,
      breadcrumb: true,
      submenu: [
        {
          key: "view_teacher",
          path: "/app/teacher",
          title: "teacher",
          icon: "teacher",
          priority: 2,
          breadcrumb: true,
          submenu: [],
        },
        {
          key: "view_student",
          path: "/app/student",
          title: "student",
          icon: "student",
          priority: 2,
          breadcrumb: true,
          submenu: [],
        },
        {
          key: "view_parent",
          path: "/app/parent",
          title: "parent",
          icon: "parent",
          priority: 3,
          breadcrumb: true,
          submenu: [],
        },
        {
          key: "view_employee",
          path: "/app/employees",
          title: "employees",
          icon: "employees",
          priority: 1000,
          breadcrumb: true,
          submenu: [],
        },
      ],
    },
    {
      key: "view_subject",
      path: "#",
      title: "school-schema",
      icon: "school-schema",
      priority: 4,
      breadcrumb: true,
      submenu: [
        {
          key: "view_school",
          path: "/app/school",
          title: "school",
          icon: "school",
          priority: 5,
          breadcrumb: true,
          submenu: [],
        },
        {
          key: "view_program",
          path: "/app/programs",
          title: "program",
          icon: "program",
          priority: 7,
          breadcrumb: true,
          submenu: [],
        },
        {
          key: "view_sub_school",
          path: "/app/sub-school",
          title: "sub-school",
          icon: "sub-school",
          priority: 1000,
          breadcrumb: true,
          submenu: [],
        },
        {
          key: "view_classes",
          path: "/app/classes",
          title: "classes",
          icon: "classes",
          priority: 8,
          breadcrumb: true,
          submenu: [],
        },
        {
          key: "view_subject",
          path: "/app/subject",
          title: "subject",
          icon: "subject",
          priority: 9,
          breadcrumb: true,
          submenu: [],
        },
        {
          key: "view_routine",
          path: "/app/routine",
          title: "routine",
          icon: "routine",
          priority: 101,
          breadcrumb: true,
          submenu: [],
        },
      ],
    },
    {
      key: "view_online",
      path: "#",
      title: "online_view",
      icon: "online-lesson-schema",
      priority: 1,
      breadcrumb: true,
      submenu: [
        {
          key: "view_online_file",
          path: "/app/online-file",
          title: "online-file",
          icon: "online-file",
          priority: 12,
          breadcrumb: true,
          submenu: [],
        },
        {
          key: "view_online_lesson",
          path: "/app/online-lesson",
          title: "online-lesson",
          icon: "online-lesson",
          priority: 13,
          breadcrumb: true,
          submenu: [],
        }
      ],
    },
    {
      key: "view_live",
      path: "/app/live",
      title: "live",
      icon: "live",
      priority: 4,
      breadcrumb: true,
      submenu: [],
    },
    {
      key: "view_event",
      path: "/app/event",
      title: "event",
      icon: "event",
      priority: 1000,
      breadcrumb: true,
      submenu: [],
    },
    {
      key: "view_employee_attandance",
      path: "/app/employees-attendance",
      title: "employees-attendance",
      icon: "employees-attendance",
      priority: 1000,
      breadcrumb: true,
      submenu: [],
    },
    {
      key: "view_conversation",
      path: "/app/conversation",
      title: "conversation",
      icon: "conversation",
      priority: 1000,
      breadcrumb: true,
      submenu: [],
    },
    // {
    //   key: "view_plan",
    //   path: "/app/plan",
    //   title: "plan",
    //   icon: PlanSVG,
    //   priority: 1000,
    //   breadcrumb: true,
    //   submenu: [],
    // },
    {
      key: "view_report",
      path: "#",
      title: "report",
      icon: "report",
      priority: 1000,
      breadcrumb: true,
      submenu: [
        {
          key: "view_report",
          path: "/app/report/consolidated-report",
          title: "consolidated-report",
          icon: "consolidated-report",
          priority: 10,
          breadcrumb: true,
          submenu: [],
        },
      ],
    },
    {
      key: "configs",
      path: "/app/configs",
      title: "configs",
      icon: "configs",
      breadcrumb: true,
      submenu: [],
    },
  ];

  const configNavTree = [
    {
      key: "view_schoolyear",
      path: "schoolyear",
      title: "schoolyear",
      breadcrumb: true,
      submenu: [],
    },
    {
      key: "view_activity",
      path: "activity",
      title: "activity",
      breadcrumb: true,
      submenu: [],
    },
    {
      key: "view_classtime",
      path: "class-times",
      title: "class-times",
      breadcrumb: true,
      submenu: [],
    },
    {
      key: "view_student_status",
      path: "student-status",
      title: "student-status",
      breadcrumb: true,
      submenu: [],
    },
    {
      key: "view_student_status_extra",
      path: "student-status-extras",
      title: "student-status-extras",
      breadcrumb: true,
      submenu: [],
    },
    {
      key: "view_teacher_status",
      path: "teacher-status",
      title: "teacher-status",
      breadcrumb: true,
      submenu: [],
    },
    {
      key: "view_degree",
      path: "degree",
      title: "degree",
      breadcrumb: true,
      submenu: [],
    },
    {
      key: "view_group",
      path: "group-permission",
      title: "group-permission",
      breadcrumb: true,
      submenu: [],
    },
    {
      key: "view_event_type",
      path: "event-type",
      title: "event-type",
      breadcrumb: true,
      submenu: [],
    },
    {
      "key": "view_planmark",
      "path": "plan-mark",
      "title": "plan-mark",
      "breadcrumb": true,
      "submenu": []
    }
  ];

  function refetch() {
    setIsRefetch(true);
    setUserNav([]);
  }

  useEffect(() => {
    if (isLoading !== "loading" && isRefetch) {
      mainNavTree.map((nav) => {
        if (nav.submenu.length > 0) {
          const subNav = nav.submenu.filter(
            (subNav) => permissions[subNav.key]
          );
          if (subNav.length > 0) {
            setUserNav((prevNav) => [
              ...prevNav,
              {
                key: nav.key,
                path: nav.path,
                title: nav.title,
                icon: nav.icon,
                breadcrumb: true,
                submenu: subNav,
              },
            ]);
          }
        } else if (permissions[nav.key]) {
          setUserNav((prevNav) => [...prevNav, nav]);
        }
        return null;
      });
      configNavTree.map((nav) => {
        if (permissions[nav.key]) {
          setConfigNav((prevNav) => [...prevNav, nav]);
        }
        return null;
      });
      setIsRefetch(false);
    }
  }, [isLoading, isRefetch, mainNavTree, configNavTree, permissions]);

  return {
    mainNavTree: [
      {
        key: "view_event",
        path: "/app/home",
        title: "home",
        icon: "home",
        priority: 1,
        breadcrumb: true,
        submenu: [],
      },
      ...userNav
    ],
    configNavTree: configNav,
    refetch: refetch,
  };
}
