import { gql } from "@apollo/client";

export const ALL_PLANS = gql`
    query allPlans {
        allPlans {
            id
            section {
                id
                section
                program {
                    id
                }
                classes {
                    classes
                }
            }
            approvedBy {
                familyName
                name
            }
            teacher {
                familyName
                name
            }
            startDate
            endDate
        }
    }
`

export const CREATE_PLAN = gql`
    mutation createPlan ($endDate: Date, $section: ID, $startDate: Date) {
        createPlan (endDate: $endDate, section: $section, startDate: $startDate) {
            plan {
                id
            }
        }
    }
`

export const PLAN_BY_ID = gql`
    query planById ($id: ID!) {
        planById (id: $id) {
            id
            section {
                section
                school {
                    name
                }
                classes {
                    classes
                    program {
                        program
                    }
                }
            }
            approvedBy {
                familyName
                name
            }
            teacher {
                familyName
                name
            }
            startDate
            endDate
        }
    }
`

export const UPDATE_PLAN = gql`
    mutation updatePlan ($id: ID, $endDate: Date, $section: ID, $startDate: Date) {
        updatePlan (id: $id, endDate: $endDate, section: $section, startDate: $startDate) {
            plan {
                id
            }
        }
    }
`

export const DELETE_PLAN = gql`
    mutation deletePlan ($id: ID) {
        deletePlan (id: $id) {
            plan {
                startDate
            }
        }
    }
`

export const ALL_DAILY_PLANS = gql`
    query allDailyPlans ($plan: ID!) {
        allDailyPlans (plan: $plan) {
            id
            action
            monday
            tuesday
            wednesday
            thursday
            friday
            isAllDay
            allDay
            approvedBy {
                familyName
                name
            }
        }
    }
`

export const CREATE_DAILY_PLAN = gql`
    mutation createDailyPlan (
        $action: String
        $allDay: String = "."
        $friday: String = "."
        $isAllDay: Boolean
        $monday: String = "."
        $plan: ID
        $thursday: String = "."
        $tuesday: String = "."
        $wednesday: String = "."
    ) {
        createDailyPlan (
            action: $action
            allDay: $allDay
            friday: $friday
            isAllDay: $isAllDay
            monday: $monday
            plan: $plan
            thursday: $thursday
            tuesday: $tuesday
            wednesday: $wednesday
        ) {
            dailyPlan {
                id
            }
        }
    }
`

export const UPDATE_DAILY_PLAN = gql`
    mutation updateDailyPlan (
        $action: String
        $allDay: String = ""
        $friday: String = ""
        $isAllDay: Boolean
        $monday: String = ""
        $id: ID
        $thursday: String = ""
        $tuesday: String = ""
        $wednesday: String = ""
    ) {
        updateDailyPlan (
            action: $action
            allDay: $allDay
            friday: $friday
            isAllDay: $isAllDay
            monday: $monday
            id: $id
            thursday: $thursday
            tuesday: $tuesday
            wednesday: $wednesday
        ) {
            dailyPlan {
                id
            }
        }
    }
`

export const DELETE_DAILY_PLAN = gql`
    mutation deleteDailyPlan ($id: ID) {
        deleteDailyPlan (id: $id) {
            dailyPlan {
                monday
            }
        }
    }
`

export const ALL_SUB_PLANS = gql`
    query allSubPlans ($plan: ID!) {
        allSubPlans (plan: $plan) {
            id
            subjectName
            content
            goal
            teachingMethods
            consumables
            walk
            running
            jumping
            shoot
            game
            hand
            body
        }
    }
`

export const CREATE_SUB_PLAN = gql`
    mutation createSubPlan(
        $plan: ID
        $subjectName: String
        $consumables: String
        $content: String
        $goal: String
        $teachingMethods: String
        $hand: String = ""
        $jumping: String = ""
        $running: String = ""
        $shoot: String = ""
        $body: String = ""
        $walk: String = ""
        $game: String = ""
    ) {
        createSubPlan (
            body: $body
            consumables: $consumables
            content: $content
            goal: $goal
            hand: $hand
            jumping: $jumping
            plan: $plan
            running: $running
            shoot: $shoot
            subjectName: $subjectName
            teachingMethods: $teachingMethods
            walk: $walk
            game: $game
        ) {
            subPlan {
                id
            }
        }
    }
`

export const UPDATE_SUB_PLAN = gql`
    mutation updateSubPlan(
        $id: ID
        $subjectName: String
        $consumables: String
        $teachingMethods: String
        $content: String
        $goal: String = ""
        $hand: String = ""
        $jumping: String = ""
        $running: String = ""
        $shoot: String = ""
        $body: String = ""
        $walk: String = ""
        $game: String = ""
    ) {
        updateSubPlan (
            body: $body
            consumables: $consumables
            content: $content
            goal: $goal
            hand: $hand
            jumping: $jumping
            id: $id
            running: $running
            shoot: $shoot
            subjectName: $subjectName
            teachingMethods: $teachingMethods
            walk: $walk
            game: $game
        ) {
            subPlan {
                id
            }
        }
    }
`

export const DELETE_SUB_PLAN = gql`
    mutation deleteSubPlan ($id: ID) {
        deleteSubPlan (id: $id) {
            subPlan {
                walk
            }
        }
    }
`

export const ALL_SUB_PLAN_ACTIONS = gql`
    query allSubPlanActions ($subPlan: ID!) {
        allSubPlanActions (subPlan: $subPlan) {
            id
            action
            teacherActivity
            studentActivity
            subPlan {
                id
            }
            approvedBy {
                familyName
                name
            }
        }
    }
`

export const CREATE_SUB_PLAN_ACTION = gql`
    mutation createSubPlanAction (
        $action: String
        $studentActivity: String
        $subPlan: ID
        $teacherActivity: String
    ) {
        createSubPlanAction (
            action: $action
            studentActivity: $studentActivity
            subPlan: $subPlan
            teacherActivity: $teacherActivity
        ) {
            subPlanAction {
                id
            }
        }
    }
`

export const UPDATE_SUB_PLAN_ACTION = gql`
    mutation updateSubPlanAction (
        $action: String
        $studentActivity: String
        $id: ID
        $teacherActivity: String
    ) {
        updateSubPlanAction (
            action: $action
            studentActivity: $studentActivity
            id: $id
            teacherActivity: $teacherActivity
        ) {
            subPlanAction {
                id
            }
        }
    }
`

export const DELETE_SUB_PLAN_ACTION = gql`
    mutation deleteSubPlanAction ($id: ID) {
        deleteSubPlanAction (id: $id) {
            subPlanAction {
                action
            }
        }
    }
`

export const APPROVE_PLAN = gql`
    mutation approvePlan ($plan: ID) {
        approvePlan (plan: $plan) {
            plan {
                id
            }
        }
    }
`

export const APPROVE_DAILY_PLAN = gql`
    mutation approveDailyPlan ($dailyPlan: ID, $isApproved: Boolean) {
        approveDailyPlan (dailyPlan: $dailyPlan, isApproved: $isApproved) {
            dailyPlan {
                id
            }
        }
    }
`

export const APPROVE_SUB_PLAN_ACTION = gql`
    mutation approveSubPlanAction ($subPlanAction: ID, $isApproved: Boolean) {
        approveSubPlanAction (subPlanAction: $subPlanAction, isApproved: $isApproved) {
            subPlanAction {
                id
            }
        }
    }
`