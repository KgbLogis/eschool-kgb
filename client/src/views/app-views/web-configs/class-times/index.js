import React from "react";
import ClassTimeTable from './table';
import { CheckPer } from 'hooks/checkPermission';
import Loading from "components/shared-components/Loading";

const Index = () => {

    const create = CheckPer('add_classtime');
    const edit = CheckPer('change_classtime');
    const destroy = CheckPer('delete_classtime');

    const permissions = {
        create: create,
        edit: edit,
        destroy: destroy
    }

    if (Object.values(permissions).indexOf('loading') > -1) {
        return <Loading cover="content" />
    }

    return (
        <ClassTimeTable permissions={permissions} />
    )
}

export default Index;
