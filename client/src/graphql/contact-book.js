import { gql } from "@apollo/client"

export const ALL_CONTACT_BOOKS = gql`
    query allContactBooks ($filter: String = ""){
        allContactBooks (filter: $filter) {
            id
            file
            physicalCondition
            isSleep
            isMorningFoodEat
            defecateCount
            wordToSay
            date
            student {
                id
                familyName
                name
            }
            createUserid {
                firstName
                lastName
            }
            createdAt
        }
    }
`

export const CREATE_CONTACT_BOOK = gql`
    mutation createContactBook (
        $defecateCount: Int!
        $file: Upload
        $isMorningFoodEat: Boolean!
        $isSleep: Boolean!
        $physicalCondition: String!
        $student: ID!
        $wordToSay: String!
    ) {
        createContactBook (
            defecateCount: $defecateCount
            file: $file
            isMorningFoodEat: $isMorningFoodEat
            isSleep: $isSleep
            physicalCondition: $physicalCondition
            student: $student
            wordToSay: $wordToSay
        ) {
            contactBook {
                id
            }
        }
    }
`

export const UPDATE_CONTACT_BOOK = gql`
    mutation updateContactBook (
        $id: ID!
        $defecateCount: Int!
        $file: Upload
        $isMorningFoodEat: Boolean!
        $isSleep: Boolean!
        $physicalCondition: String!
        $student: ID!
        $wordToSay: String!
    ) {
        updateContactBook (
            id: $id
            defecateCount: $defecateCount
            file: $file
            isMorningFoodEat: $isMorningFoodEat
            isSleep: $isSleep
            physicalCondition: $physicalCondition
            student: $student
            wordToSay: $wordToSay
        ) {
            contactBook {
                id
            }
        }
    }
`

export const DELETE_CONTACT_BOOK = gql`
    mutation deleteContactBook ($id: ID!) {
        deleteContactBook (id: $id) {
            contactBook{
                sleepMorning
            }
        }
    }
`