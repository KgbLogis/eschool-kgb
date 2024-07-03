import { gql } from "@apollo/client";

export const ALL_ONLINE_TESTS = gql `
    query allOnlineTests {
        allOnlineTests {
            id
            title
            description
            subject {
                id
                subject
            }
        }
    }
`;

export const CREATE_ONLINE_TEST = gql `
    mutation createOnlineTest ($description: String, $subject: Int, $title: String) {
        createOnlineTest (description: $description, subject: $subject, title: $title) {
            onlineTest {
                id
            }
        }
    }
`;

export const UPDATE_ONLINE_TEST = gql `
    mutation updateOnlineTest ($description: String, $id: ID, $subject: Int, $title: String) {
        updateOnlineTest (description: $description, id: $id, subject: $subject, title: $title) {
            OnlineTest {
                id
            }
        }
    }
`;

export const DELETE_ONLINE_TEST = gql `
    mutation deleteOnlineTest ($id: ID) {
        deleteOnlineTest (id: $id) {
            onlineTest {
                id
            }
        }
    }
`;

export const ALL_QUESTION_LEVELS = gql `
    query allQuestionLevels {
        allQuestionLevels {
            level
            id
        }
    }
`;

export const CREATE_QUESTION_LEVEL = gql `
    mutation createQuestionLevel ($level: String) {
        createQuestionLevel (level: $level) {
            questionLevel {
                id
            }
        }
    }
`;

export const UPDATE_QUESTION_LEVEL = gql `
    mutation updateQuestionLevel ($level: String, $id: ID) {
        updateQuestionLevel (level: $level, id: $id) {
            questionLevel {
                id
            }
        }
    }
`;

export const DELETE_QUESTION_LEVEL = gql `
    mutation deleteQuestionLevel ($id: ID) {
        deleteQuestionLevel (id: $id) {
            questionLevel {
                level
            }
        }
    }
`;

export const ALL_QUESTIONS_BY_TEST = gql `
    query allQuestionsByTest ($id: Int!) {
        allQuestionsByTest (id: $id) {
            id
            question
            hint
            image
            answerType
            questionLevel {
                id
                level
            }
            questionChoiceSet {
                id
                answer
                score
            }
        }
    }
`; 

export const CREATE_QUESTION = gql `
    mutation createQuestion ($answerType: String, $hint: String, $image: Upload, $onlineTest: Int, $questionL: String, $questionLevel: Int) {
        createQuestion (answerType: $answerType, hint: $hint, image: $image, onlineTest: $onlineTest, questionL: $questionL, questionLevel: $questionLevel) {
            question {
                id
                answerType
            }
        }
    }
`;

export const UPDATE_QUESTION = gql `
    mutation updateQuestion ($answerType: String, $hint: String, $image: Upload, $onlineTest: Int, $questionL: String, $questionLevel: Int, $id: ID) {
        updateQuestion (answerType: $answerType, hint: $hint, image: $image, onlineTest: $onlineTest, questionL: $questionL, questionLevel: $questionLevel, id: $id) {
            question {
                id
                answerType
            }
        }
    }
`;

export const DELETE_QUESTION = gql `
    mutation deleteQuestion ($id: ID) {
        deleteQuestion (id: $id) {
            question {
                question
            }
        }
    }
`;

export const CREATE_QUESTION_CHOICE = gql `
    mutation createQuestionChoice ($answer: String, $question: Int, $score: Decimal) {
        createQuestionChoice (answer: $answer, question: $question, score: $score) {
            questionChoice {
                id
            }
        }
    }
`;

export const UPDATE_QUESTION_CHOICE = gql `
    mutation updateQuestionChoice ($answer: String, $question: Int, $score: Decimal, $id: ID) {
        updateQuestionChoice (answer: $answer, question: $question, score: $score, id: $id) {
            questionChoice {
                id
            }
        }
    }
`;

export const DELETE_QUESTION_CHOICE = gql `
    mutation deleteQuestionChoice ($id: ID) {
        deleteQuestionChoice (id: $id) {
            questionChoice {
                score
            }
        }
    }
`;

export const ALL_TAKE_TEST = gql `
    query allTakeTests {
        allTakeTests {
            id
            title
            description
            startAt
            endAt
            duration
            status
        }
    }
`;

export const CREATE_TAKE_TEST = gql `
    mutation createTakeTest ($duration: Int, $endAt: String, $startAt: String, $status: String, $description: String, $title: String) {
        createTakeTest (duration: $duration, endAt: $endAt, startAt: $startAt, status: $status, description: $description, title: $title) {
            takeTest {
                status
            }
        }
    }
`;

export const UPDATE_TAKE_TEST = gql `
    mutation updateTakeTest ($duration: Int, $endAt: String, $startAt: String, $status: String, $id: ID, $description: String, $title: String) {
        updateTakeTest (duration: $duration, endAt: $endAt, startAt: $startAt, status: $status, id: $id, description: $description, title: $title) {
            takeTest {
                status
            }
        }
    }
`;

export const DELETE_TAKE_TEST = gql `
    mutation deleteTakeTest ($id: ID) {
        deleteTakeTest (id: $id) {
            takeTest {
                status
            }
        }
    }
`;

export const ALL_PARTICIPANT_BY_TEST = gql `
    query allParticipantByTest ($takeTest: Int!) {
        allParticipantByTest (takeTest: $takeTest) {
            id
            student {
                studentCode
                familyName
                name
            }
            started
            completed
            answerSet {
                answerType
                questionText
                choices
                score
                givenAnswer
            }
        }
    }
`;

export const CREATE_PARTICIPANT = gql `
    mutation createParticipant ($section: Int, $studentCode: String, $takeTest: Int) {
        createParticipant (section: $section, studentCode: $studentCode, takeTest: $takeTest) {
            participant {
                id
            }
        }
    }
`;

export const DELETE_PARTICIPANT = gql `
    mutation deleteParticipant ($id: ID, $takeTest: Int) {
        deleteParticipant (id: $id, takeTest: $takeTest) {
            participant {
                started
            }
        }
    }
`;

export const ALL_TAKE_LEVEL = gql `
    query allTakeLevelByTest ($takeTest: Int!) {
        allTakeLevelByTest (takeTest: $takeTest) {
            id
            onlineTest {
                id
                title
            }
            questionLevel {
                id
                level
            }
            takeNumber
        }
    }
`;

export const CREATE_TAKE_LEVEL = gql `
    mutation createTakeLevel ($onlineTest: Int, $questionLevel: Int, $takeNumber: Int, $takeTest: Int) {
        createTakeLevel (onlineTest: $onlineTest, questionLevel: $questionLevel, takeNumber: $takeNumber, takeTest: $takeTest) {
            takeLevel {
                id
            }
        }
    }
`;

export const DELETE_TAKE_LEVEL = gql `
    mutation deleteTakeLevel ($id: ID) {
        deleteTakeLevel (id: $id) {
            takeLevel {
                takeNumber
            }
        }
    }
`;

export const ALL_SECTIONS = gql `
    query allSections {
        allSections {
            id
            section
            studentSet {
                id
                studentCode
            }
        }
    }
`;

export const START_TEST = gql `
    query startTest ($takeTest: Int!) {
        startTest (takeTest: $takeTest) {
            id
            questionText
            choices
            answerType
            givenAnswer
            question {
                hint
                image
            }
        }
    }
`;

export const UPDATE_ANSWER = gql `
    mutation updateAnswer ($givenAnswer: String, $id: ID) {
        updateAnswer (givenAnswer: $givenAnswer, id: $id) {
            answer {
                id
            }
        }
    }
`;

export const TEST_TIME = gql `
    query testTime ($takeTest: Int!) {
        testTime (takeTest: $takeTest) {
            duration
            started
            endAt
        }
    }
`;

export const FINISH_TEST = gql `
    query finishTest ($takeTest: Int!) {
        finishTest (takeTest: $takeTest) {
            score
        }
    }
`;