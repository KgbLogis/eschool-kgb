import { gql } from '@apollo/client'

export const DELETE_CITY = gql `
    mutation deleteCity($id: ID!){
        deleteCity(id: $id){
            city{
              name
              code
            }
        }
    }
`

export const DELETE_USER = gql `
    mutation deleteAccount($username: String) {
        deleteAccount(username: $username) {
            account {
                username
            }
        }
    }
`

export const DELETE_TEACHER = gql `
    mutation deleteTeacher($id: ID!){
      deleteTeacher(id: $id){
            teacher{
              name
            }
        }
    }
`;

export const DELETE_EMPLOYEES = gql `
  mutation deleteEmployee($id: ID){
    deleteEmployee(id: $id){
      employee{
        name
      }
    }
  }
  `;

export const DELETE_SUBJECT = gql `
  mutation deleteSubject ($id: ID) {
    deleteSubject (id: $id) {
      subject {
        credit
      }
    }
  }
`

export const DELETE_STUDENT = gql `
    mutation deleteStudent($id: ID!){
      deleteStudent(id: $id){
            student{
              surname
            }
        }
    }
`

export const DELETE_SUB_SCHOOL = gql `
  mutation deleteSubSchool($id: ID){
    deleteSubSchool(id: $id){
      subSchool{
        name
      }
    }
}
`

export const DELETE_SCHOOL = gql `
  mutation deleteSchool($id: ID!){
    deleteSchool(id: $id){
      school{
        name
      }
    }
}
`

export const DELETE_SECTION = gql `
  mutation deleteSection($id: ID){
    deleteSection(id: $id){
      section{
        section
      }
    }
}
`

export const DELETE_CLASS = gql `
  mutation deleteClasses($id: ID!){
    deleteClasses(id: $id){
      classes{
        classes
      }
    }
}
`

export const DELETE_PROGRAM = gql `
    mutation deleteProgram($id: ID!){
        deleteProgram(id: $id){
            program{
                program
            }
        }
    }
`;

export const DELETE_ROUTINE = gql `
    mutation deleteRoutine ($id: ID) {
        deleteRoutine (id: $id) {
            routine {
                createdAt
            }
        }
    }
`;

export const DELETE_PARENT = gql `
    mutation deleteParent ($id: ID) {
        deleteParent (id: $id) {
            parent {
                name
            }
        }
    }
`;

export const DELETE_EVENT_TYPE = gql `
    mutation deleteEventType ($id: ID) {
        deleteEventType (id: $id) {
            eventType {
                name
            }
        }
    }
`;

export const DELETE_EVENT = gql`
    mutation deleteEvent ($id: ID) {
        deleteEvent (id: $id) {
            event {
                title
            }
        }
    }
`;
