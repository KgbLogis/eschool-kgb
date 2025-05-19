import React from "react";
import { CheckPer } from 'hooks/checkPermission';
import { useQuery } from "@apollo/client";
import { useParams, useHistory } from 'react-router-dom';
import { LESSON_BY_ID } from "graphql/lesson";
import { APP_PREFIX_PATH } from 'configs/AppConfig';
import Loading from 'components/shared-components/Loading';
import AllSub from './all-sub';

const Index = (props) => {

	const history = useHistory();

    const slug = useParams();

    const { loading, data } = useQuery(LESSON_BY_ID, {
        variables: { id: slug.lesson }
    });

    const checkData = () => {
        if (data === undefined) {
        return false
        } else if (data.onlineLessonById === null) {
        return false
        }

        return true;
    }

    const create = CheckPer('add_online_sub');
    const edit = CheckPer('change_online_sub');
    const destroy = CheckPer('delete_online_sub');

    const permissions = {
        create: create,
        edit: edit,
        destroy: destroy,
    }

    if (loading) {
        return (
        <Loading cover="content"/>
        )
    }

    // if (loading === false && checkData() === false) {
    //     return (history.push(`${APP_PREFIX_PATH}/online-lesson`));
    // }

    return (
        <AllSub title={props.title} permissions={permissions} lesson={data?.onlineLessonById.id} />
    )
}

export default Index;