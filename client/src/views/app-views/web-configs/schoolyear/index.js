import React from "react";
import SchoolYearTable from './table';
import { CheckPer } from 'hooks/checkPermission';
import Loading from "components/shared-components/Loading";

const Index = () => {

    const create = CheckPer('add_schoolyear');
    const edit = CheckPer('change_schoolyear');
    const destroy = CheckPer('delete_schoolyear');

    const permissions = {
        create: create,
        edit: edit,
        destroy: destroy
    }

    if (Object.values(permissions).indexOf('loading') > -1) {
        return <Loading cover="content" />
    }

    return (
        <SchoolYearTable permissions={permissions} />
    )
}

export default Index;
