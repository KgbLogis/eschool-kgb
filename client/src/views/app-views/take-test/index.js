import React from "react";
import TestLibTable from './table';
import { CheckPer } from 'hooks/checkPermission';
import Loading from "components/shared-components/Loading";

const Index = (props) => {

    const create = CheckPer('add_take_test');
    const edit = CheckPer('change_take_test');
    const destroy = CheckPer('delete_take_test');
    const add_question = CheckPer('add_question');
    const view_online_test = CheckPer('view_online_test');

    const permissions = {
        create: create,
        edit: edit,
        destroy: destroy,
        add_question: add_question,
        view_online_test: view_online_test
    }

    if (Object.values(permissions).indexOf('loading') > -1) {
        return <Loading cover="content" />
    }

    return (
        <TestLibTable title={props.title} permissions={permissions} />
    )
}

export default Index;
