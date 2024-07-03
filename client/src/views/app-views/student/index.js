import React from "react";
import StudentsTable from './table';
import { CheckPer } from 'hooks/checkPermission';
import Loading from "components/shared-components/Loading";

const Index = (props) => {

    const create = CheckPer('add_student');
    const edit = CheckPer('change_student');
    const destroy = CheckPer('delete_student');
    const password = CheckPer('change_user_password');

    const permissions = {
        create: create,
        edit: edit,
        destroy: destroy,
        password: password
    }

    if (Object.values(permissions).indexOf('loading') > -1) {
        return <Loading cover="content" />
    }

    return (
        <StudentsTable title={props.title} permissions={permissions} />
    )
}

export default Index;
