import { useQuery } from '@apollo/client';
import { STUDENT_SCHOOL_YEAR } from 'graphql/report';

export function GetStudentSchoolYear(variable) {
  
    const { data: schoolyearData } = useQuery(STUDENT_SCHOOL_YEAR, {
        variables: { student: variable }
    }) 

    return schoolyearData
}
