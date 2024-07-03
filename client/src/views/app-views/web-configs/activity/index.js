import React from "react";
import ActivityTable from './table';
import { CheckPer } from 'hooks/checkPermission';
import Loading from "components/shared-components/Loading";

const Index = () => {

    const create = CheckPer('add_activity');
    const edit = CheckPer('change_activity');
    const destroy = CheckPer('delete_activity');

    const permissions = {
        create: create,
        edit: edit,
        destroy: destroy
    }

    if (Object.values(permissions).indexOf('loading') > -1) {
        return <Loading cover="content" />
    }

    return (
        <ActivityTable permissions={permissions} />
    )
}

export default Index;
