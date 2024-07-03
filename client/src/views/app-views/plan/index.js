import React from 'react'
import { CheckPer } from 'hooks/checkPermission';
import PlanTable from './table'
import Loading from 'components/shared-components/Loading';

const Index = () => {

    const create = CheckPer('add_plan');
    const edit = CheckPer('change_plan');
    const destroy = CheckPer('delete_plan');

    const permissions = {
        create: create,
        edit: edit,
        destroy: destroy
    }

    if (Object.values(permissions).indexOf('loading') > -1) {
        return <Loading cover="content" />
    }

    return (
        <PlanTable permissions={permissions} />
    )
}

export default Index