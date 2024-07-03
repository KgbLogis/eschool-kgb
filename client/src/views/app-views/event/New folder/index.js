import React from "react";
import Events from './events';
import { CheckPer } from 'hooks/checkPermission';
import Loading from "components/shared-components/Loading";

const Index = (props) => {

    const create = CheckPer('add_event');
    const edit = CheckPer('change_event');
    const destroy = CheckPer('delete_event');

    const permissions = {
        create: create,
        edit: edit,
        destroy: destroy
    }

    if (Object.values(permissions).indexOf('loading') > -1) {
        return <Loading cover="content" />
    }

    return (
        <Events permissions={permissions} />
    )
}

export default Index;
