import React from "react";
import ProgramsTable from './table';
import { CheckPer } from 'hooks/checkPermission';
import Loading from "components/shared-components/Loading";

const Index = (props) => {
    
    const create = CheckPer('add_program');
    const edit = CheckPer('change_program');
    const destroy = CheckPer('delete_program');
    const view_program_subject = CheckPer('view_program_subject');

    const permissions = {
        create: create,
        edit: edit,
        destroy: destroy,
        view_program_subject: view_program_subject
    }
    
    if (Object.values(permissions).indexOf('loading') > -1) {
        return <Loading cover="content" />
    }

    return (
        <ProgramsTable title={props.title} permissions={permissions} />
    )
}

export default Index;
