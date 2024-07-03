import React, { useState } from "react";
import SectionTable from './table';
import { CheckPer } from 'hooks/checkPermission';
import Loading from "components/shared-components/Loading";
import { useHistory } from "react-router-dom";

const Index = (props) => {

    const history = useHistory();

    const create = CheckPer('add_section');
    const edit = CheckPer('change_section');
    const destroy = CheckPer('delete_section');
    
    const [classes] = useState(props.location.state?.message);

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
        <SectionTable title={props.title} permissions={permissions} classes={classes} />
    )
}

export default Index;