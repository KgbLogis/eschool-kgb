import { gql } from "@apollo/client";

export const ALL_FLEX_TIMES = gql`
  query allFlexTimes {
        allFlexTimes {
            id
            program {
                id
                program
            }
            isCurrent
        }
    }
`

export const CREATE_FLEX_TIME = gql`
    mutation createFlexTime($isCurrent: Boolean, $program: ID) {
        createFlexTime (isCurrent: $isCurrent, program: $program) {
            flexTime {
                isCurrent
            }
        }
    }
`

export const UPDATE_FLEX_TIME = gql`
    mutation updateFlexTime($id: ID, $isCurrent: Boolean, $program: ID) {
        updateFlexTime (id: $id, isCurrent: $isCurrent, program: $program) {
            flexTime {
                isCurrent
            }
        }
    }
`

export const DELETE_FLEX_TIME = gql`
    mutation deleteFlexTime ($id: ID) {
        deleteFlexTime (id: $id) {
            flexTime {
                isCurrent
            }
        }
    }
`

export const ALL_FLEX_TIME_SUBS = gql`
    query allFlexTimeSubs ($flexTime: ID!) {
        allFlexTimeSubs (flexTime: $flexTime) {
            id
            flexTime {
                id
            }
            action
            content
            startAt
            endAt
        }
    }
`

export const CREATE_FLEX_TIME_SUB = gql`
    mutation createFlexTimeSub(
        $action: String
        $content: String
        $endAt: Time
        $flexTime: ID
        $startAt: Time
    ) {
        createFlexTimeSub  (
            action: $action
            content: $content
            endAt: $endAt
            flexTime: $flexTime
            startAt: $startAt
        ) {
            flexTimeSub {
                startAt
            }
        }
    }
`

export const UPDATE_FLEX_TIME_SUB = gql`
    mutation updateFlexTimeSub(
        $id: ID
        $action: String
        $content: String
        $endAt: Time
        $flexTime: ID
        $startAt: Time
    ) {
        updateFlexTimeSub (
            action: $action
            content: $content
            endAt: $endAt
            flexTime: $flexTime
            id: $id
            startAt: $startAt
        ) {
            flexTimeSub {
                startAt
            }
        }
    }
`

export const DELETE_FLEX_TIME_SUB = gql`
    mutation deleteFlexTimeSub ($id: ID) {
        deleteFlexTimeSub (id: $id) {
            flexTimeSub {
                startAt
            }
        }
    }
`