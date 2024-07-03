import React from "react";
import { useParams, useHistory } from 'react-router-dom';
import { useQuery } from "@apollo/client";
import Loading from 'components/shared-components/Loading';
import Table from './table';
import { CheckPer } from 'hooks/checkPermission';
import { PROGRAM_BY_ID } from "graphql/custom";
import { APP_PREFIX_PATH } from "configs/AppConfig";

const Index = (props) => {

    const history = useHistory();
    const slug = useParams();
    
    const { data, loading } = useQuery(PROGRAM_BY_ID, {
        variables: { id: slug.program }
    })

    const create = CheckPer('add_program_subject');
    const edit = CheckPer('change_program_subject');
    const destroy = CheckPer('delete_program_subject');

    const permissions = {
        create: create,
        edit: edit,
        destroy: destroy
    }

    if (loading === false && data.programById === null) {
        history.push(`${APP_PREFIX_PATH}/programs`)
    }

    if (loading || Object.values(permissions).indexOf('loading') > -1) {
        return (
          <Loading cover="content"/>
        )
    }

    return (
        <Table title={props.title} permissions={permissions} program={data.programById.id} />
    )
}

export default Index;
