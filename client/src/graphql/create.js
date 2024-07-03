import { gql } from '@apollo/client';

export const CREATE_SCHOOL = gql `
    mutation createSchool($name: String, $nameMgl: String) {
      createSchool(name: $name, nameMgl: $nameMgl) {
        school {
          id
          name
          nameMgl
        }
      }
    }
`;

export const CREATE_SUB_SCHOOL = gql `
    mutation createSubSchool($name: String, $nameMgl: String, $school: Int!){
      createSubSchool(name: $name, nameMgl: $nameMgl, school: $school) {
        subSchool {
          id
          name
          nameMgl 
          school {
            id
          }
        }
      }
    }
`;

export const REGISTER = gql `
    mutation register($email: String!, $username: String!, $isTeacher: Boolean!, $isStudent: Boolean!, $password1: String!, $password2: String!){
      register(email: $email, username: $username, isTeacher: $isTeacher, isStudent: $isStudent, password1: $password1, password2: $password2) {
          success
          errors
          token
      } 
    }

`;

export const CREATE_TEACHER = gql `
    mutation createTeacher($address: String, $birthCity: Int, $birthDistrict: Int, $birthdate: String, $degree: Int,
                            $familyName: String, $joinBefore: String, $joinDate: String, $name: String, $phone: String, $phone2: String,
                            $registerNo: String, $school: Int, $sex: String, $status: Int, $subSchool: Int, $teacherCode: String!,
                            $username: String!, $password: String!, $email: String!, $access: String!
                            # $user: Int
                            ) {
      createTeacher(address: $address, birthCity: $birthCity, birthDistrict: $birthDistrict, birthdate: $birthdate, degree: $degree,
                             familyName: $familyName, joinBefore: $joinBefore, joinDate: $joinDate, name: $name, phone: $phone, phone2: $phone2, 
                            registerNo: $registerNo, school: $school, sex: $sex, status: $status, subSchool: $subSchool, 
                            teacherCode: $teacherCode, access: $access,
                            username: $username, password: $password, email: $email
                            # user: $user 
                            ) {
        teacher {
          id
        }
      }
    }
`;

export const CREATE_EMPLOYEE = gql `
    mutation createEmployee(
                $address: String
                $birthCity: Int
                $birthDistrict: Int
                $birthdate: String
                $email: String!
                $employeeCode: String!
                $familyName: String
                $group: Int
                $name: String
                $password: String!
                $phone: String
                $phone2: String
                $photo: Upload
                $registerNo: String
                $sex: String
                $status: Int
                $compartment: Int
                $username: String!
              ) {
      createEmployee(
                address: $address
                birthCity: $birthCity
                birthDistrict: $birthDistrict
                birthdate: $birthdate
                email: $email
                employeeCode: $employeeCode
                familyName: $familyName
                group: $group
                name: $name
                password: $password
                phone: $phone
                phone2: $phone2
                photo: $photo
                compartment: $compartment
                registerNo: $registerNo
                sex: $sex
                status: $status
                username: $username
          ) {
          employee {
          id
        }
      }
    }
`;

export const CREATE_STUDENT = gql `
    mutation createStudent($activity: Int, $address: String, $birthCity: Int, $birthDistrict: Int, $birthdate: String,
                            $classes: Int, $classtime: Int, $familyName: String, $joinDate: String,
                            $joinSchoolyear: String, $name: String, $nationality: String, $phone: String, $program: Int, 
                            $registerNo: String, $religion: String, $school: Int, $section: Int, $sex: String, $state: String, $status: Int, 
                            $statusExtra: Int, $surname: String, $studentCode: String,
                            $username: String!, $password: String!) {
      createStudent(activity: $activity, address: $address, birthCity: $birthCity, birthDistrict: $birthDistrict, birthdate: $birthdate, 
                    classes: $classes, familyName: $familyName, joinDate: $joinDate, name: $name, phone: $phone, 
                    registerNo: $registerNo, religion: $religion, school: $school, sex: $sex, status: $status,
                    surname: $surname, studentCode: $studentCode, classtime: $classtime, joinSchoolyear: $joinSchoolyear, 
                    nationality: $nationality, program: $program, section: $section, state: $state, statusExtra: $statusExtra,
                    username: $username, password: $password, email: "test@test.mn") {
        student {
          id
        }
      }
    }
`;

export const CREATE_SECTION = gql `
  mutation createSection($classes: Int, $maxStudentNum: Int, $program: Int, $teacher: Int,  $school: Int, $section: String) {
    createSection(classes: $classes, program: $program, school: $school, section: $section, maxStudentNum: $maxStudentNum, teacher: $teacher) {
      section {
        section
      }
    }
  }
`
export const CREATE_CLASSES = gql `
  mutation createClasses($activity: Int, $classes: String,
                          $program: Int, $school: Int, $status: String) {
    createClasses(activity: $activity, classes: $classes,
                  program: $program, school: $school, status: $status) {
      classes {
        classes
      }
    }
  }
`
export const CREATE_PROGRAM = gql `
    mutation createProgram($program: String, $programMgl: String,  
                           $status: String, $maxStudentNum: Int, $school: Int, $subSchool: Int) {
      createProgram(program: $program, programMgl: $programMgl,  
                    status: $status, maxStudentNum: $maxStudentNum, school: $school, subSchool: $subSchool) {
        program {
          id
        }
      }
    }
`;

export const CREATE_SUBJECT = gql `
  mutation createSubject($credit: String, $subject: String, $content: String, $school: Int, $subSchool: Int) {
    createSubject(credit: $credit, subject: $subject, school: $school, content: $content, subSchool: $subSchool) {
      subject {
        credit
      }
    }
  }
`
export const CREATE_PROGRAM_SUBJECT = gql `
  mutation createProgramSubject($program: Int, $subject: Int) {
    createProgramSubject(program: $program, subject: $subject) {
      programSubjectType {
        id
      }
    }
  }
`;

export const CREATE_ROUTINE_STUDENT = gql `
  mutation createRoutineStudent ($routine: Int, $studentCode: String, $section: Int) {
    createRoutineStudent (routine: $routine, studentCode: $studentCode, section: $section) {
      routineStudent {
        id
      }
    }
  }
`

export const CREATE_PARENT = gql `
    mutation createParent ($address: String, $familyName: String, $name: String, $phone: String, $profession: String, $student: Int) {
        createParent (address: $address, familyName: $familyName, name: $name, phone: $phone, profession: $profession, student: $student) {
            parent {
                name
            }
        }
    }
`;

export const CREATE_EVENT_TYPE = gql `
    mutation createEventType ($color: String, $name: String) {
        createEventType (color: $color, name: $name) {
            eventType {
                name
            }
        }
    }
`;

export const CREATE_EVENT = gql`
    mutation createEvent ($content: String, $description: String, $endAt: String, $eventType: Int, $startAt: String, $title: String) {
        createEvent (content: $content, description: $description, endAt: $endAt, eventType: $eventType, startAt: $startAt, title: $title) {
            event {
                title
            }
        }
    }
`;