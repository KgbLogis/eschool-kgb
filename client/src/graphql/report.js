import { gql } from "@apollo/client";

export const STUDENT_REPORT = gql `
    query studentReport ($studentCode: String) {
        studentReport (studentCode: $studentCode) {
            school
            textTop
            textMid
            textBottom
            studentPhoto
            studentCode
        }
    }
`;

export const STUDENT_REPORT_SECTION = gql `
    query studentReportSection ($section: Int) {
        studentReportSection (section: $section) {
            school
            textTop
            textMid
            textBottom
            studentPhoto
            studentCode
        }
    }
`;

export const ALL_SECTIONS = gql `
    query allSections {
        allSections {
            id
            section
        }
    }
`;

export const STUDENT_MARK_REPORT = gql `
    query studentMarkReport ($studentCode: String) {
        studentMarkReport (studentCode: $studentCode) {
            school
            textTop
            textMid0
            textMid1
            textMid2
            textMid3
            textMid4
            textMid5
            textMid6
            textMid7
            textBottom
            studentPhoto
            studentCode
        }
    }
`;

export const STUDENT_MARK_REPORT_SECTION = gql `
    query studentMarkReportSection ($section: Int) {
        studentMarkReportSection (section: $section) {
            school
            textTop
            textMid0
            textMid1
            textMid2
            textMid3
            textMid4
            textMid5
            textMid6
            textMid7
            textBottom
            studentPhoto
            studentCode
        }
    }
`;

export const STUDENT_SCHOOL_YEAR = gql `
    query studentSchoolyear ($student: Int) {
        studentSchoolyear (student: $student) {
            id
            schoolyear
            season
            semesterCode
            startDate
            endDate
        }
    }
`;

export const STUDENT_MARK_REL = gql `
    query studentMarkRel ($student: Int, $schoolyear: Int) {
        studentMarkRel (student: $student, schoolyear: $schoolyear) {
            id
            mark {
                student {
                    studentCode 
                }
                markBoard {
                    subject {
                        id
                        subject
                        subjectCode
                        credit
                    }
                    schoolyear {
                        schoolyear 
                        season
                    }
                }
            }
            markSetting {
                name
                percentage
            }
            markVal
        }
    }
`;

export const MARK_PERCENTAGE = gql `
    query markPercentage ($percentage: Int) {
        markPercentage (percentage: $percentage) {
            type
            percentage
            diam
        }
    }
`;

export const MARK_CON = gql `
    query markCon ($subject: Int!, $schoolyear: Int!, $student: Int!) {
        markCon (subject: $subject, schoolyear: $schoolyear, student: $student) {
            percentage
            type
            diam
        }
    }
`;

export const MARK_CON_SUBJECT = gql `
    query markconSubject ($schoolyear: Int!, $section: Int!) {
        markconSubject (schoolyear: $schoolyear, section: $section) {
            subjectId
            subject
            subjectCode
            subjectCredit
        }
    }
`;

export const MARK_CON_STUDENT = gql `
    query markconStudent ($section: Int!) {
        markconStudent (section: $section) {
            studentId
            familyName
            name
            studentCode
            registerNo
        }
    }
`;

export const MARK_CON_QUERY = gql`
    query markConQuery ($section: Int!, $schoolyear: Int!) {
        markconSubject (schoolyear: $schoolyear, section: $section) {
            subjectId 
            subject
            subjectCode
            subjectCredit
        }
        markconStudent (section: $section) {
            studentId
            familyName
            name
            studentCode
            registerNo
        }
    },
`;

export const MARK_CON_TEST = gql `
    query markCon ($sdf: Array) {
        D1934081_3: markCon(subject: 3, schoolyear: 1, student: 98150) {    
            percentage    
            type    
            diam  
        }  
        D1934087_3: markCon(subject: 3, schoolyear: 1, student: 98489) { percentage    type    diam  }  
        D1934076_3: markCon(subject: 3, schoolyear: 1, student: 103324) {    percentage    type    diam  }  
        D1834046_3: markCon(subject: 3, schoolyear: 1, student: 98894) {    percentage    type    diam  }  
        D1934077_3: markCon(subject: 3, schoolyear: 1, student: 100276) {    percentage    type    diam  }  
        D1934073_3: markCon(subject: 3, schoolyear: 1, student: 104950) {    percentage    type    diam  }  
        D1934089_3: markCon(subject: 3, schoolyear: 1, student: 100633) {    percentage    type    diam  }  
        D1934086_3: markCon(subject: 3, schoolyear: 1, student: 100787) {    percentage    type    diam  }  
        D1934098_3: markCon(subject: 3, schoolyear: 1, student: 105890) {    percentage    type    diam  }  
        D1934075_3: markCon(subject: 3, schoolyear: 1, student: 101336) {    percentage    type    diam  }  
        D1934071_3: markCon(subject: 3, schoolyear: 1, student: 101355) {    percentage    type    diam  }  
        D1934084_3: markCon(subject: 3, schoolyear: 1, student: 101452) {    percentage    type    diam  }  
        D1934090_3: markCon(subject: 3, schoolyear: 1, student: 101491) {    percentage    type    diam  }  
        D1934088_3: markCon(subject: 3, schoolyear: 1, student: 102593) {    percentage    type    diam  }  
        D1724120_3: markCon(subject: 3, schoolyear: 1, student: 103392) {    percentage    type    diam  }  
        D1934080_3: markCon(subject: 3, schoolyear: 1, student: 104140) {    percentage    type    diam  }  
        D1934079_3: markCon(subject: 3, schoolyear: 1, student: 105052) {    percentage    type    diam  }  
        D1934097_3: markCon(subject: 3, schoolyear: 1, student: 105101) {    percentage    type    diam  }  
        D1934103_3: markCon(subject: 3, schoolyear: 1, student: 105110) {    percentage    type    diam  }  
        D1934096_3: markCon(subject: 3, schoolyear: 1, student: 105112) {    percentage    type    diam  }  
        D1934074_3: markCon(subject: 3, schoolyear: 1, student: 105596) {    percentage    type    diam  }  
        D1934078_3: markCon(subject: 3, schoolyear: 1, student: 105697) {    percentage    type    diam  }  
        D1934094_3: markCon(subject: 3, schoolyear: 1, student: 107882) {    percentage    type    diam  }  
        D1934104_3: markCon(subject: 3, schoolyear: 1, student: 107918) {    percentage    type    diam  }  
        D1934101_3: markCon(subject: 3, schoolyear: 1, student: 107971) {    percentage    type    diam  }  
        D1934100_3: markCon(subject: 3, schoolyear: 1, student: 108400) {    percentage    type    diam  }  
        D1934093_3: markCon(subject: 3, schoolyear: 1, student: 109395) {    percentage    type    diam  } 
        D1934085_3: markCon(subject: 3, schoolyear: 1, student: 109445) {    percentage    type    diam  }  
        D1744080_3: markCon(subject: 3, schoolyear: 1, student: 109448) {    percentage    type    diam  }  
        D1934095_3: markCon(subject: 3, schoolyear: 1, student: 109996) {    percentage    type    diam  }  
        D1934102_3: markCon(subject: 3, schoolyear: 1, student: 110102) {    percentage    type    diam  }  
        D1934072_3: markCon(subject: 3, schoolyear: 1, student: 111723) {    percentage    type    diam  }  
        D1834021_3: markCon(subject: 3, schoolyear: 1, student: 95960) {    percentage    type    diam  } 
        D1934091_3: markCon(subject: 3, schoolyear: 1, student: 105549) {    percentage    type    diam  }  
        D1934092_3: markCon(subject: 3, schoolyear: 1, student: 111134) {    percentage    type    diam  }  
        D1934083_3: markCon(subject: 3, schoolyear: 1, student: 111971) {    percentage    type    diam  }
    }
`;
export const ALL_STUDENTS_REPORT = gql`
    query allStudentsReport {
        allStudentsReport {
            id
            user {
                id
                username
                email
            }
            studentCode
            surname
            familyName
            name
            religion
            registerNo
            nationality
            state
            photo
            phone
            address
            activity {
                id
                name
            }
            joinDate
            sex
            birthdate
            classtime {
                id
                name
            }
            birthCity {
                id
                name
            }
            birthDistrict {
                id
                name
            }
            status {
                id
                name
            }
            statusExtra {
                id
                name
            }
            school {
                id
                name
            }
            classes {
                id
                classes
            }
            section {
                id
                section
            }
            program {
                id
                program
            }
            joinSchoolyear {
                id
                schoolyear
            }
        }
    }
`;