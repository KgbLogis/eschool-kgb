import React, { useRef } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { Button, Card, message, Modal, Table } from 'antd'
import { DeleteTwoTone, EyeTwoTone } from '@ant-design/icons';
import { PlusCircleOutlined } from '@ant-design/icons';
import { ALL_DAILY_MENUS, DELETE_DAILY_MENU } from 'graphql/food'
import { Link } from 'react-router-dom'
import DailyMenuForm from './form'
import FormModal from 'components/shared-components/FormModal'
import IntlMessage from 'components/util-components/IntlMessage'
import moment from 'moment';
import { CheckPer } from 'hooks/checkPermission';


const Food = () => {

    const { confirm } = Modal;
    const { data, refetch, loading } = useQuery(ALL_DAILY_MENUS)

    const [deleteFood] = useMutation(DELETE_DAILY_MENU, {
        onCompleted: data => {
            refetch();
            message.success('Амжилттай устлаа');
        }
    });
    const modalRef = useRef()

    const permissions = {
        destroy: CheckPer('delete_dailymenu')
    }

    function handleCancel() {
        modalRef.current.handleCancel()
    }

    function handleOpen() {
        modalRef.current.handleOpen()
    }

    const deleteModal = value => {
        confirm({
            title: 'Устгах уу?',
            okText: 'Устгах',
            okType: 'danger',
            cancelText: 'Болих',
            onOk() {
                deleteFood({ variables: { id: value } });
            },
        });
    }

    const tableColumns = [
        {
            key: 'name',
            title: <IntlMessage id="name" />,
            dataIndex: 'name',
            render: (text) => <span><IntlMessage id={text} /></span>
        },
        {
            key: 'createdAt',
            title: <IntlMessage id="date" />,
            dataIndex: 'createdAt',
            render: (text) => <span>{moment(text).format("YYYY-MM-DD")}</span>
        },
        {
            key: 'actions',
            title: <IntlMessage id="main.action" />,
            width: '15vw',
            dataIndex: 'actions',
            render: (_, elm) => (
                <div className="text-center">
                    <Link to={`food/${elm.id}`}>
                        <Button
                            size="small"
                            type="text" 
                            icon={<EyeTwoTone />}
                        > <IntlMessage id="show" />
                        </Button>
                    </Link>
                    {permissions.destroy === true &&
                        <Button size="small" onClick={() => deleteModal(elm)} type="text" icon={<DeleteTwoTone twoToneColor="#f42f2f" />} > <IntlMessage id="delete" />
                        </Button>
                    }
                </div>
            )
        }
    ];

    return (
        <>
            <FormModal ref={modalRef}>
                <DailyMenuForm
                    closeModal={handleCancel}
                />
            </FormModal>
            <div className='flex justify-end'>
                <Button onClick={handleOpen} type="primary" icon={<PlusCircleOutlined />} > <IntlMessage id="add_new" /> </Button>
            </div>
            <Card>
                <Table
                    columns={tableColumns}
                    rowKey={record => record.id}
                    size='small'
                    bordered
                    dataSource={data?.allDailyMenus}
                    loading={loading}
                />
            </Card>
        </>
    )
}

export default Food