import React from "react";
import Lessons from './lessons';
import { CheckPer } from 'hooks/checkPermission';
import Loading from "components/shared-components/Loading";

const Index = (props) => {

    const create = CheckPer('add_online_lesson');
    const edit = CheckPer('change_online_lesson');
    const destroy = CheckPer('delete_online_lesson');
    const create_sub = CheckPer('add_online_sub');
    const view_student = CheckPer('view_online_student');

    const permissions = {
        create: create,
        create_sub: create_sub,
        edit: edit,
        destroy: destroy,
        view_student: view_student
    }

    if (Object.values(permissions).indexOf('loading') > -1) {
        return <Loading cover="content" />
    }

    return (
        <Lessons title={props.title} permissions={permissions} />
    )
}

export default Index;