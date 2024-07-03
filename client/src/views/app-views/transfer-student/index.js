import React from "react";
import AllSchoolTable from './table';
import Loading from "components/shared-components/Loading";
import { useQuery } from "@apollo/client";
import { TRANSFER_BY_STUDENT } from "graphql/all";

const Index = (props) => {

    const { data, error, loading } = useQuery(TRANSFER_BY_STUDENT, {
        variables: { student: props.location.state?.student.id },
    })

    if (error) {
        return null
    }

    if (loading) {
        return (<Loading cover="content" />)
    }

    return (
        <AllSchoolTable title={props.title} student={props.location.state.student} data={data.transfersByStudent} />
    )
}

export default Index;
