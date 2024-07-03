import { gql } from '@apollo/client'

export const ALL_PERMISSION = gql `
    query allPermissions {
        allPermissions {
            id
            name
            codename
        }
    }
`;

export const ME = gql `
    query me{
        me{
            username
        }
    }
`;

export const MY_PERMISSION = gql `
    query userPermissions {
        userPermissions {
            codename
        }
    }
`;

export const USER_PERMISSION = gql`
    query customUserPermissions ($userId: Int) {
        customUserPermissions (userId: $userId) {
            id
            codename 
        }
    }
`;

export const PERMISSIONS = gql`
    query permissions {
        permissions {
            name
            codeName
            add
            change
            delete
            view
        }
    }
`;

export const ALL_GROUPS = gql `
    query allGroups {
        allGroups {
            id
            name
            permissions {
                id
                codename
            }
        }
    }
`;

export const GROUP_PERMISSION = gql `
    query groupPermissions ($userId: Int, $groupId: Int) {
        groupPermissions (userId: $userId, groupId: $groupId) {
            id
            name
            codename
        }
    }
`; 

export const UPDATE_TEACHER_PERMISSION = gql`
    mutation updateTeacherPermission ($action: Boolean, $codename: String, $teacherCode: String) {
        updateTeacherPermission (action: $action, codename: $codename, teacherCode: $teacherCode) {
            permission {
                codename
            }
        }
    }
`;

export const UPDATE_GROUP_PERMISSION = gql `
    mutation updateGroupPermission ($action: Boolean, $codename: String, $id: ID) {
        updateGroupPermission (action: $action, codename: $codename, id: $id) {
            group {
                name
            }
        }
    }
`;