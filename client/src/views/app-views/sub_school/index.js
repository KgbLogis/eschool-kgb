import React from "react";
import AllSubSchoolTable from './table';
import { CheckPer } from 'hooks/checkPermission';
import Loading from "components/shared-components/Loading";

const Index = (props) => {

    const create = CheckPer('add_sub_school');
    const edit = CheckPer('change_sub_school');
    const destroy = CheckPer('delete_sub_school');

    const permissions = {
        create: create,
        edit: edit,
        destroy: destroy
    }

    if (Object.values(permissions).indexOf('loading') > -1) {
        return <Loading cover="content" />
    }

    return (
        <AllSubSchoolTable title={props.title} permissions={permissions} />
    )
}

export default Index;
