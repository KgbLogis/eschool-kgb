import React from "react";
import MarkPercentageTable from './table';
import { CheckPer } from 'hooks/checkPermission';
import Loading from "components/shared-components/Loading";

const Index = () => {

    const create = CheckPer('add_mark_percentage');
    const edit = CheckPer('change_mark_percentage');
    const destroy = CheckPer('delete_mark_percentage');

    const permissions = {
        create: create,
        edit: edit,
        destroy: destroy
    }

    if (Object.values(permissions).indexOf('loading') > -1) {
        return <Loading cover="content" />
    }

    return (
        <MarkPercentageTable permissions={permissions} />
    )
}

export default Index;