import React from "react";
import ClassesTable from './table';
import { CheckPer } from 'hooks/checkPermission';
import Loading from "components/shared-components/Loading";

const Index = (props) => {

    const create = CheckPer('add_classes');
    const edit = CheckPer('change_classes');
    const destroy = CheckPer('delete_classes');
    const view_section = CheckPer('view_section');

    const permissions = {
        create: create,
        edit: edit,
        destroy: destroy,
        view_section: view_section
    }

    if (Object.values(permissions).indexOf('loading') > -1) {
        return <Loading cover="content" />
    }

    return (
        <ClassesTable title={props.title} permissions={permissions} />
    )
}

export default Index;