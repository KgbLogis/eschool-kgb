import React from "react";
import SubjectTable from './table';
import { CheckPer } from 'hooks/checkPermission';
import Loading from "components/shared-components/Loading";

const Index = () => {

    const create = CheckPer('add_subject');
    const edit = CheckPer('change_subject');
    const destroy = CheckPer('delete_subject');

    const permissions = {
        create: create,
        edit: edit,
        destroy: destroy
    }

    if (Object.values(permissions).indexOf('loading') > -1) {
        return <Loading cover="content" />
    }

    return (
        <SubjectTable permissions={permissions} />
    )
}

export default Index;
