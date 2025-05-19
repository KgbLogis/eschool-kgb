import React, { useState, useEffect, lazy, Suspense } from 'react'
import { Modal, message, Button } from 'antd';
import { DeleteTwoTone, EditTwoTone, EyeTwoTone } from '@ant-design/icons';
import utils from 'utils';
import { useMutation, useLazyQuery } from '@apollo/client';
import IntlMessage from "components/util-components/IntlMessage";
import { ALL_LIVES, DELETE_LIVE, GET_LIVE_URL } from 'graphql/live';
import moment from 'moment';
import AsyncTable from 'components/shared-components/AsyncTable';
import Loading from 'components/shared-components/Loading';
import { Link } from 'react-router-dom';
import { APP_PREFIX_PATH } from 'configs/AppConfig';

const SchoolForm = lazy(() => import(`./form`));

const LiveTable = (props) => {

    const [list, setList] = useState([])
    const [count, setCount] = useState(0);
    const [fetchData, { loading, refetch }] = useLazyQuery(ALL_LIVES, {
        fetchPolicy: 'network-only',
        onCompleted: data => {
            setCount(data.count.count);
            setList(data.allLives);
        }
    });

    useEffect(() => {
        fetchData({ variables: { offset: 0, limit: 10, filter: "" } })
    }, [fetchData])

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editData, setEditData] = useState([]);
    const [formType, setFormType] = useState("");

    const showModal = () => {
        setFormType("create")
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const editRow = row => {
        setEditData(row);
        setFormType("edit")
        setIsModalVisible(true);
    };

    const { confirm } = Modal;

    const [destroy] = useMutation(DELETE_LIVE, {
        onCompleted: data => {
            message.success('Амжилттай устлаа');
            refetch();
        }
    });

    function deleteRow(row) {
        confirm({
            title: 'Устгах уу?',
            okText: 'Устгах',
            okType: 'danger',
            cancelText: 'Болих',
            onOk() {
                destroy({ variables: { id: row.id, name: row.name, nameMgl: row.nameMgl } });
            },
        });
    }

    const tableColumns = [
        {
            key: 'title',
            title: <IntlMessage id="title" />,
            dataIndex: 'title',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'title')
        },
        {
            key: 'type',
            title: <IntlMessage id="onlineType" />,
            dataIndex: 'type',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'type'),
            render: text => <IntlMessage id={text} />
        },
        {
            key: 'teacher',
            title: <IntlMessage id="teacher" />,
            dataIndex: ['teacher', 'name'],
            sorter: (a, b) => utils.antdTableSorter(a, b, 'teacher')
        },
        {
            key: 'date',
            title: <IntlMessage id="date" />,
            dataIndex: 'date',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'date'),
            render: text => <span>{moment(text).format('YYYY-MM-DD HH:mm')}</span>,
        },
        {
            key: 'duration',
            title: <IntlMessage id="duration" />,
            dataIndex: 'duration',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'duration')
        },
        {
            key: 'actions',
            title: <IntlMessage id="main.action" />,
            width: '20vw',
            dataIndex: 'actions',
            render: (_, elm) => (
                <div className="text-center">
                    <Link to={`${APP_PREFIX_PATH}/live/${elm.id}`}>
                        <Button size="small" type="text" icon={<EyeTwoTone />}>
                            <IntlMessage id="show" /> </Button>
                    </Link>
                    {props.permissions.edit === true &&
                        <Button size="small" onClick={() => editRow(elm)} type="text" icon={<EditTwoTone twoToneColor="#ffdb00" />} > <IntlMessage id="edit" /> </Button>
                    }
                    {props.permissions.destroy === true &&
                        <Button size="small" onClick={() => deleteRow(elm)} type="text" icon={<DeleteTwoTone twoToneColor="#f42f2f" />} > <IntlMessage id="delete" /></Button>
                    }
                </div>
            )
        }
    ];

    return (
        <>
            {props.permissions.edit || props.permissions.create ?
                <Modal
                    width={'80vw'}
                    forceRender
                    title={formType === 'edit' ? <IntlMessage id='edit' /> : <IntlMessage id="add_new" />}
                    visible={isModalVisible}
                    okText={<IntlMessage id="main.okText" />}
                    cancelText={<IntlMessage id="main.cancelText" />}
                    onCancel={handleCancel}
                    okButtonProps={{ form: 'SchoolForm', key: 'submit', htmlType: 'submit' }}
                >
                    <Suspense fallback={<Loading cover="content" />}>
                        <SchoolForm formType={formType} setIsModalVisible={setIsModalVisible} refetch={refetch} editData={editData} />
                    </Suspense>
                </Modal>
                : null
            }
            <AsyncTable
                fetchData={fetchData}
                loading={loading}
                columns={tableColumns}
                data={list}
                count={count}
                permissions={props.permissions}
                showModal={showModal}
            />
        </>

    )
}

export default LiveTable
