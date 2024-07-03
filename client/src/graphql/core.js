import { gql } from "@apollo/client";

export const ALL_DEGREES = gql`
  	query allDegrees {
        allDegrees {
            id
            name
        }
	}
`;

export const CREATE_DEGREE = gql `
    mutation createDegree($name: String) {
      createDegree(name: $name) {
        degree {
          id
          name
        }
      }
    }
`;

export const UPDATE_DEGREE  = gql `
    mutation updateDegree ($id: ID, $name: String) {
        updateDegree (id: $id, name: $name) {
            degree {
                id
                name
            }
        }
    }
`;

export const DELETE_DEGREE = gql `
    mutation deleteDegree($id: ID!){
        deleteDegree(id: $id){
            degree{
                name
            }
        }
    }
`;

export const ALL_ACTIVITY = gql`
  	query allActivitys {
        allActivitys {
            id
            name
        }
	}
`;

export const CREATE_ACTIVITY = gql `
    mutation createActivity($name: String) {
      createActivity(name: $name) {
        activity {
          id
          name
        }
      }
    }
`;

export const UPDATE_ACTIVITY  = gql `
    mutation updateActivity ($id: ID, $name: String) {
        updateActivity (id: $id, name: $name) {
            activity {
                name
            }
        }
    }
`;

export const DELETE_ACTIVITY = gql `
    mutation deleteActivity($id: ID!){
        deleteActivity(id: $id){
            activity{
                name
            }
        }
    }
`;

export const ALL_STUDENT_STATUS = gql `
    query allStudentStatuss {
        allStudentStatuss {
            id
            name
        }
    }
`;

export const CREATE_STUDENT_STATUS = gql `
    mutation createStudentStatus($name: String) {
        createStudentStatus(name: $name) {
            studentStatus {
                id
                name
            }
        }
    }
`;

export const UPDATE_STUDENT_STATUS = gql `
    mutation updateStudentStatus ($id: ID, $name: String) {
        updateStudentStatus (id: $id, name: $name) {
            studentStatus {
                id
                name
            }
        }
    }
`;

export const DELETE_STUDENET_STATUS = gql `
    mutation deleteStudentStatus ($id: ID) {
        deleteStudentStatus (id: $id) {
            studentStatus {
                name
            }
        }
    }
`;

export const ALL_STUDENT_STATUS_EXTRA = gql `
    query allStudentStatusExtras {
        allStudentStatusExtras {
            id
            name
        }
    }
`;

export const CREATE_STUDENT_STATUS_EXTRA = gql `
    mutation createStudentStatusExtra($name: String) {
        createStudentStatusExtra(name: $name) {
            studentStatusExtra {
                id
                name
            }
        }
    }
`;

export const UPDATE_STUDENT_STATUS_EXTRA = gql `
    mutation updateStudentStatusExtra ($id: ID, $name: String) {
        updateStudentStatusExtra (id: $id, name: $name) {
            studentStatusExtra {
                id
                name
            }
        }
    }
`;

export const DELETE_STUDENET_STATUS_EXTRA = gql `
    mutation deleteStudentStatusExtra ($id: ID) {
        deleteStudentStatusExtra (id: $id) {
            studentStatusExtra {
                name
            }
        }
    }
`;


export const ALL_TEACHER_STATUS = gql `
    query allTeacherStatuss {
        allTeacherStatuss {
            id
            name
        }
    }
`;

export const CREATE_TEACHER_STATUS = gql `
    mutation createTeacherStatus($name: String) {
        createTeacherStatus(name: $name) {
            teacherStatus {
                id
                name
            }
        }
    }
`;

export const UPDATE_TEACHER_STATUS = gql `
    mutation updateTeacherStatus ($id: ID, $name: String) {
        updateTeacherStatus (id: $id, name: $name) {
            teacherStatus {
                id
                name
            }
        }
    }
`;

export const DELETE_STEACHER_STATUS = gql `
    mutation deleteTeacherStatus ($id: ID) {
        deleteTeacherStatus (id: $id) {
            teacherStatus {
                name
            }
        }
    }
`;

export const ALL_CLASSTIME = gql `
    query allClasstimes {
        allClasstimes {
            id
            name
        }
    }
`;

export const CREATE_CLASSTIME = gql `
    mutation createClasstime($name: String) {
        createClasstime(name: $name) {
            classtime {
                id
                name
            }
        }
    }
`;

export const UPDATE_CLASSTIME = gql `
    mutation updateClasstime ($id: ID, $name: String) {
        updateClasstime (id: $id, name: $name) {
            classtime {
                id
                name
            }
        }
    }
`;

export const DELETE_SCLASSTIME = gql `
    mutation deleteClasstime ($id: ID) {
        deleteClasstime (id: $id) {
            classtime {
                name
            }
        }
    }
`;

export const CREATE_ROUTINE = gql `
    mutation createRoutine ($classes: Int, $endDate: Date, $program: Int, $room: String, $schoolyear: Int, $section: Int, $startDate: Date, 
                            $subject: Int, $teacher: Int, $time: String, $type: String, $weekly: Int) {
        createRoutine (classes: $classes, endDate: $endDate, program: $program, room: $room, schoolyear: $schoolyear, section: $section, 
                        startDate: $startDate, subject: $subject, teacher: $teacher, time: $time, type: $type, weekly: $weekly) {
            routine {
                id
            }
        }
    }
`;

export const ALL_MENUS = gql `
    query allMenus{
        allMenus {
            priority
            key
            path
            title
            icon
            breadcrumb
            subMenu
            menuSet {
                priority
                key
                path
                title
                icon
                breadcrumb
                subMenu
            }
        }
    }
`; 

export const UPDATE_MENU = gql `
    mutation updateMenu($breadcrumb: Boolean, $icon: String, $id: ID, $priority: Int, $status: String, $submenu: Int) {
        updateMenu (breadcrumb: $breadcrumb, icon: $icon, id: $id, priority: $priority, status: $status, submenu: $submenu) {
            menu {
                id
            }
        }
    }
`;

export const ALL_SCHOOLYEAR = gql `
    query allSchoolyears {
        allSchoolyears {
            id
            schoolyear
            startDate
            endDate
            isCurrent
        }
    }
`;

export const CREATE_SCHOOLYEAR = gql `
    mutation createSchoolyear ($endDate: String, $schoolyear: String, $startDate: String, $isCurrent: Boolean) {
        createSchoolyear (endDate: $endDate, schoolyear: $schoolyear, startDate: $startDate, isCurrent: $isCurrent) {
            schoolyear {
                schoolyear
            }
        }
    }
`;

export const UPDATE_SCHOOLYEAR = gql `
    mutation updateSchoolyear ($endDate: String, $id: ID, $schoolyear: String, $startDate: String, $isCurrent: Boolean) {
        updateSchoolyear (endDate: $endDate, id: $id, schoolyear: $schoolyear, startDate: $startDate, isCurrent: $isCurrent) {
            schoolyear {
                schoolyear
            }
        }
    }
`;

export const DELETE_SCHOOLYEAR = gql `
    mutation deleteSchoolyear ($id: ID) {
        deleteSchoolyear (id: $id) {
            schoolyear {
                schoolyear
            }
        }
    }
`;