import React, { useEffect, useState } from "react";
import { Col, Row } from "antd";
import RoutineTable from './table';
import Times from './times';
import { CheckPer } from 'hooks/checkPermission';
import Loading from "components/shared-components/Loading";
import { useLazyQuery } from "@apollo/client";
import { ALL_ROUTINE_TIMES, ALL_ROUTINES } from "graphql/routine";

const Index = () => {

    const create = CheckPer('add_routine');
    const edit = CheckPer('change_routine');
    const destroy = CheckPer('delete_routine');
    const add_mark_board = CheckPer('add_mark_board');
    const add_routine_student = CheckPer('add_routine_student');

    const [routines, setRoutines] = useState([]);
    const [times, setTimes] = useState([]);

    const permissions = {
        create: create,
        edit: edit,
        destroy: destroy,
        add_mark_board: add_mark_board,
        view_routine_student: add_routine_student
    }

    const [fetchRoutines, { loading: routinesLoading, refetch }] = useLazyQuery(ALL_ROUTINES, {
        onCompleted: data => {
            if (data) {
                setRoutines(data.routines);
            }
        }
	});

    const [fetchTimes, { loading: loadingTimes, refetch: refetchTimes }] = useLazyQuery(ALL_ROUTINE_TIMES, {
        onCompleted: data => {
            if (data) {
                setTimes(data.allRoutineTimes);
            }
        }
	});

    useEffect(() => {
        fetchRoutines();
    }, [fetchRoutines])
    

    if (Object.values(permissions).indexOf('loading') > -1) {
        return <Loading cover="content" />
    }

    return (
        <Row gutter={[8, 16]}>
            <Col xs={24} xl={24}>
                <Times
                    fetchTimes={fetchTimes}
                    data={times}
                    loading={loadingTimes}
                />
            </Col>
            <Col xs={24} xl={24}>
                <RoutineTable 
                    permissions={permissions} 
                    data={routines}
                    loading={routinesLoading}
                    fetchRoutines={fetchRoutines}
                    fetchTimes={fetchTimes}
                    refetch={refetch}
                    refetchTimes={refetchTimes}
                />
            </Col>
        </Row>
    )
}

export default Index;