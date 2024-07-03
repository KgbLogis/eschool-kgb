import React from "react";
import ParentsTable from './table';
import { CheckPer } from 'hooks/checkPermission';
import Loading from "components/shared-components/Loading";

const Index = (props) => {

    const create = CheckPer('add_parent');
    const edit = CheckPer('change_parent');
    const destroy = CheckPer('delete_parent');

    const permissions = {
        create: create,
        edit: edit,
        destroy: destroy
    }

    if (Object.values(permissions).indexOf('loading') > -1) {
        return <Loading cover="content" />
    }

    return (
        <ParentsTable title={props.title} permissions={permissions} />
    )
}

export default Index;
