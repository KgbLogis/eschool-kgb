import React from "react";
import AllSchoolTable from './table';
import { CheckPer } from 'hooks/checkPermission';
import Loading from "components/shared-components/Loading";

const Index = (props) => {

    const create = CheckPer('add_contactbook');
    const edit = CheckPer('change_contactbook');
    const destroy = CheckPer('delete_contactbook');

    const permissions = {
        create: create,
        edit: edit,
        destroy: destroy
    }

    if (Object.values(permissions).indexOf('loading') > -1) {
        return <Loading cover="content" />
    }

    return (
        <AllSchoolTable title={props.title} permissions={permissions} />
    )
}

export default Index;
