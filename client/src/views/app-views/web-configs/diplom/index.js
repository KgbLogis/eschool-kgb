import React from "react";
import DegreeTable from './table';
import { CheckPer } from 'hooks/checkPermission';
import Loading from "components/shared-components/Loading";

const Index = () => {

    const create = CheckPer('add_degree');
    const edit = CheckPer('change_degree');
    const destroy = CheckPer('delete_degree');

    const permissions = {
        create: create,
        edit: edit,
        destroy: destroy
    }

    if (Object.values(permissions).indexOf('loading') > -1) {
        return <Loading cover="content" />
    }

    return (
        <DegreeTable permissions={permissions} />
    )
}

export default Index;
