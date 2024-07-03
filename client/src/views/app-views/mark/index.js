import React, { useState } from "react";
import MarkTable from './table';
import { CheckPer } from 'hooks/checkPermission';
import Loading from "components/shared-components/Loading";
import { useHistory } from "react-router-dom";

const Index = (props) => {

    const history = useHistory();

    const create = CheckPer('add_mark');
    const edit = CheckPer('change_mark');
    const destroy = CheckPer('delete_mark');
    
    const [markBoard] = useState(props.location.state?.markBoard);

    const permissions = {
        create: create,
        edit: edit,
        destroy: destroy
    }

    if (Object.values(permissions).indexOf('loading') > -1) {
        return <Loading cover="content" />
    }

    if (props.location.state === undefined) {
        history.push('/app/home');
        return null
    }

    return (
        <>
            <MarkTable title={props.title} permissions={permissions} markBoard={markBoard} />
        </>
    )
}

export default Index;
