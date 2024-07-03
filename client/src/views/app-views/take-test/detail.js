import React from 'react';
import { Card, Col, Row, message } from 'antd';
import { useQuery, useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { ALL_PARTICIPANT_BY_TEST, CREATE_PARTICIPANT} from 'graphql/test';
import IntlMessage from 'components/util-components/IntlMessage';
import StudentSelect from 'components/shared-components/StudentSelect';
import TakeLevel from './detail-tables/take-level';
import Students from './detail-tables/students';

const Detail = () => {

    const slug = useParams();

    const { data: participantData, loading: participantLoading, refetch: participantRefetch } = useQuery(ALL_PARTICIPANT_BY_TEST, {
        pollInterval: 10000,
        variables: { takeTest: slug.test }
    });


    const [createParticipant, { loading: loadingCreateParticipant }] = useMutation(CREATE_PARTICIPANT, {
        onCompleted: data => {
            participantRefetch();
            message.success('Амжилттай хадгаллаа!');
        }
    });

    return (
        <div>
            <Row gutter={[8, 16]}>
                <Col xs={24} xl={16}>
                    <Card 
                        className='mt-4'
                        title={<IntlMessage id="add_student" />}
                    >
                        <StudentSelect 
                            submitData={createParticipant}
                            loading={loadingCreateParticipant}
                            mutationData={{ takeTest: slug.test }}
                        />
                    </Card>
                </Col>
                <Col xs={24} xl={8}>
                    <TakeLevel 
                        takeTest={slug.test} 
                    />
                </Col>
                <Col xs={24} xl={24}>
                    <Students 
                        loading={participantLoading} 
                        takeTest={slug.test} 
                        refetch={participantRefetch} 
                        data={participantData?.allParticipantByTest} 
                    />
                </Col>
            </Row>
        </div>
    )
}

export default Detail