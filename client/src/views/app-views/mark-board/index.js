import React from "react";
import MarkBoardTable from './table';
import { CheckPer } from 'hooks/checkPermission';
import Loading from "components/shared-components/Loading";

const Index = (props) => {

    const create = CheckPer('add_mark_board');
    const edit = CheckPer('change_mark_board');
    const destroy = CheckPer('delete_mark_board');

    const permissions = {
        create: create,
        edit: edit,
        destroy: destroy
    }

    if (Object.values(permissions).indexOf('loading') > -1) {
        return <Loading cover="content" />
    }

    return (
        <MarkBoardTable title={props.title} permissions={permissions} />
    )
}

export default Index;
