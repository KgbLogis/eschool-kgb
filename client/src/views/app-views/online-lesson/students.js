import React from 'react';
import { Card, Table, Button, message, Modal } from 'antd';
import { DeleteTwoTone, RollbackOutlined } from '@ant-design/icons'
import { useQuery, useMutation } from '@apollo/client';
import Loading from 'components/shared-components/Loading';
import { CREATE_ONLINE_STUDENT, ALL_ONLINE_STUDENT_BY_LESSON, DELETE_ONLINE_STUDENT } from 'graphql/lesson';
import Flex from 'components/shared-components/Flex';
import { useHistory, useParams } from 'react-router-dom';
import IntlMessage from 'components/util-components/IntlMessage';
import StudentSelect from 'components/shared-components/StudentSelect';

const { confirm } = Modal;

const Students = (props) => {

    const history = useHistory();
    const { lesson } = useParams();

    const { data, loading, refetch } = useQuery(ALL_ONLINE_STUDENT_BY_LESSON, {
        variables: { onlineLesson: lesson }
    });

    const [create, { loading: createLoading }] = useMutation(CREATE_ONLINE_STUDENT, {
        onCompleted: data => {
            refetch();
            message.success('Амжилттай хадгаллаа!');
        }
    });
    const [destroy, { loading: destroyLoading }] = useMutation(DELETE_ONLINE_STUDENT, {
        onCompleted: data => {
            refetch();
            message.success('Амжилттай устлаа!');
        }
    });

    const handleDestroy = (value) => {
        confirm({
            title: 'Устгах уу?',
            okText: 'Устгах',
            okType: 'danger',
            cancelText: 'Болих',
            onOk() {
                destroy({ variables: { id: value } }); 
            },
          });
    }

    const participant_colums = [
        {
            title: <IntlMessage id="studentCode" />,
            dataIndex: ['student', 'studentCode'],
            key: 'studentCode',
        },
        {
            title: <IntlMessage id="familyName" />,
            dataIndex: ['student', 'familyName'],
            key: 'familyName',
        },
        {
            title: <IntlMessage id="name" />,
            dataIndex: ['student', 'name'],
            key: 'name',
        },
        {
            title: <IntlMessage id="main.action" />,
            dataIndex: 'id',
            key: 'id',
            width: '30px',
            render: (_, elm) => (
                <div className="text-center">
                    <Button loading={destroyLoading} size="small" onClick={() => handleDestroy(elm.id)} type="text" icon={<DeleteTwoTone twoToneColor="#f42f2f"/>} > <IntlMessage id="delete" /></Button>
                </div>
            )
        },
    ]

    if (loading) {
        return (
            <Loading cover="content" />
        )
    }

    return (
        <div>
            <Flex alignItems="center" justifyContent="between" mobileFlex={false}>
                <Flex mobileFlex={false}>
                    <div className='text-right' >
                        <Button onClick={() => history.goBack()} type="default" icon={<RollbackOutlined />} block> {<IntlMessage id="back" />}</Button>
                    </div>
                </Flex>
            </Flex>
            <StudentSelect 
                submitData={create}
                loading={createLoading}
                mutationData={{ onlineLesson: lesson }}
            />
            <Card 
                className='mt-4'
                title={<IntlMessage id="student" />}
            >
                <Table
                    className='mt-2'
                    columns={participant_colums} 
                    rowKey='id'
                    bordered
                    pagination={false}
                    dataSource={data.allOnlineStudentByLesson} 
                />
            </Card>
        </div>
    )
}

export default Students