import React from "react";
import MarkSettingTable from './table';
import { CheckPer } from 'hooks/checkPermission';
import Loading from "components/shared-components/Loading";

const Index = () => {

    const create = CheckPer('add_mark_setting');
    const edit = CheckPer('change_mark_setting');
    const destroy = CheckPer('delete_mark_setting');

    const permissions = {
        create: create,
        edit: edit,
        destroy: destroy
    }

    if (Object.values(permissions).indexOf('loading') > -1) {
        return <Loading cover="content" />
    }

    return (
        <MarkSettingTable permissions={permissions} />
    )
}

export default Index;