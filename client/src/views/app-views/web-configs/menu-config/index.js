import React from "react";
import Table from './table';
import { CheckPer } from 'hooks/checkPermission';
import Loading from "components/shared-components/Loading";

const Index = () => {

    const edit = CheckPer('change_menu');

    const permissions = {
        edit: edit
    }

    if (Object.values(permissions).indexOf('loading') > -1) {
        return <Loading cover="content" />
    }

    return (
        <Table permissions={permissions} />
    )
}

export default Index;
