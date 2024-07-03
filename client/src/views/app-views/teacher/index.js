import React from "react";
import TeacherTable from './table';
import { CheckPer } from 'hooks/checkPermission';
import Loading from "components/shared-components/Loading";

const Index = (props) => {

    const create = CheckPer('add_teacher');
    const edit = CheckPer('change_teacher');
    const destroy = CheckPer('delete_teacher');
    const permission = CheckPer('change_permission');
    const password = CheckPer('change_user_password');

    const permissions = {
        create: create,
        edit: edit,
        destroy: destroy,
        permission: permission,
        password: password
    }

    if (Object.values(permissions).indexOf('loading') > -1) {
        return <Loading cover="content" />
    }

    return (
        <TeacherTable title={props.title} permissions={permissions} />
    )
}

export default Index;