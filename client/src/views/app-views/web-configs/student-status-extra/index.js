import React from "react";
import StatusTable from './table';
import { CheckPer } from 'hooks/checkPermission';
import Loading from "components/shared-components/Loading";

const Index = () => {

    const create = CheckPer('add_student_status_extra');
    const edit = CheckPer('change_student_status_extra');
    const destroy = CheckPer('delete_student_status_extra');

    const permissions = {
        create: create,
        edit: edit,
        destroy: destroy
    }

    if (Object.values(permissions).indexOf('loading') > -1) {
        return <Loading cover="content" />
    }

    return (
        <StatusTable permissions={permissions} />
    )
}

export default Index;
