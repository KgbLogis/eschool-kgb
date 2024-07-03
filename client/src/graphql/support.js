import { gql } from '@apollo/client'; 

export const ALL_SUPPORTS = gql`
    query allSupports {
        allSupports {
            id
            title
            description
            supportfileSet {
                id
                file
            }
            supportgroupSet {
                group {
                    id
                }
            }
        }
    }
`

export const CREATE_SUPPORT = gql`
    mutation createSupport ($description: String, $title: String){
        createSupport (description: $description, title: $title) {
            support {
                id
            }
        }
    }
`;

export const UPDATE_SUPPORT = gql`
    mutation updateSupport ($description: String, $id: Int, $title: String){
        updateSupport (description: $description, id: $id, title: $title) {
            support {
                id
            }
        }
    }
`

export const DELETE_SUPPORT = gql`
    mutation deleteSupport ($id: Int){
        deleteSupport (id: $id) {
            support {
                title
            }
        }
    }
`

export const CREATE_SUPPORT_FILE = gql`
    mutation createSupportFile ($support: Int, $file: Upload) {
        createSupportFile (support: $support, file: $file) {
            supportFile {
                id
            }
        }
    }
`

export const DELETE_SUPPORT_FILE = gql`
    mutation deleteSupportFile ($id: Int) {
        deleteSupportFile (id: $id) {
            supportFile {
                file
            }
        }
    }
`

export const ATTACH_OR_DETACH_SUPPORT_GROUP = gql`
    mutation attachOrDetachSupportGroup($group: Int, $support: Int){
        attachOrDetachSupportGroup (group: $group, support: $support){
            supportGroup {
                __typename
            }
        }
    }
`