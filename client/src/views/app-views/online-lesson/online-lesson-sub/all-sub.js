import React, { useState } from 'react';
import { Tabs, Card, List, Button, Modal, message } from 'antd';
import { CalendarTwoTone, PlusCircleOutlined, EditTwoTone, DeleteTwoTone, RollbackOutlined } from '@ant-design/icons'
import { useQuery, useMutation } from '@apollo/client';
import { Link } from "react-router-dom";
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import Loading from 'components/shared-components/Loading';
import Flex from 'components/shared-components/Flex';
import { ALL_ONLINE_TYPE, ALL_SUB_LESSON_BY_LESSON, DELETE_SUB_LESSON } from 'graphql/lesson';
import { APP_PREFIX_PATH, BASE_SERVER_URL } from 'configs/AppConfig';
import Form from './form';
import IntlMessage from 'components/util-components/IntlMessage';
import { CalendarIcon } from '@heroicons/react/outline';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Scrollbars from 'react-custom-scrollbars';

const { TabPane } = Tabs;
const { Meta } = Card;
const { confirm } = Modal;

const AllSub = (props) => {

    const history = useHistory();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editData, setEditData] = useState([]);
    const [formType, setFormType] = useState("");

    const { loading, data, refetch } = useQuery(ALL_SUB_LESSON_BY_LESSON, {
        variables: { onlineLesson: props.lesson }
    });

    const { data: typeData, loading: typeLoading } = useQuery(ALL_ONLINE_TYPE, {
    });

    const subLessonDetail = values => {
        history.push(`${APP_PREFIX_PATH}/online-lesson/${values.lesson}/${values.sub}`);
    }

    const editRow = row => {
        setEditData(row);
        setFormType("edit")
        setIsModalVisible(true);
    };

    const [deleteSub] = useMutation(DELETE_SUB_LESSON, {
        onCompleted: data => {
            refetch();
            message.success('Амжилттай устлаа');
        }
    });

    function deleteModal(row) {
        console.log(row);
        confirm({
            title: 'Устгах уу?',
            okText: 'Устгах',
            okType: 'danger',
            cancelText: 'Болих',
            onOk() {
                deleteSub({ variables: { id: row } });
            },
        });
    }

    const showModal = () => {
        setFormType("create")
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const dropdownMenu = row => (
        <div className='w-full flex flex-col space-y-2 bg-white p-2 rounded-2' onClick={e => (e && e.stopPropagation) && e.stopPropagation()}>
            {props.permissions.edit === true &&
                <Button type='text' onClick={() => editRow(row)}>
                    <EditTwoTone twoToneColor={'#ffdb00'} />
                </Button>
            }
            {props.permissions.destroy === true &&
                <Button type='text' onClick={() => deleteModal(row.id)} >
                    <DeleteTwoTone twoToneColor={'#f42f2f'} />
                </Button>
            }
        </div>
    );

    if (typeLoading) {
        return <Loading cover="content" />
    }

    return (
        <>
            <div className='w-full'>
                <div className='flex justify-between'>
                    <Link to={`${APP_PREFIX_PATH}/online-lesson/lessons`}>
                        <Button
                            // onClick={() => history.goBack()}
                            size='small'
                            type="primary"
                            icon={<RollbackOutlined />}
                        >
                            {" "}<IntlMessage id="back" />
                        </Button>
                    </Link>
                    {props.permissions.create === true &&
                        <>
                            <Modal
                                forceRender
                                title={formType === 'edit' ? <IntlMessage id="edit" /> : <IntlMessage id="add_new" />}
                                visible={isModalVisible}
                                okText={<IntlMessage id="main.okText" />}
                                cancelText={<IntlMessage id="main.cancelText" />}
                                width={'80vw'}
                                onCancel={handleCancel}
                                okButtonProps={{ form: 'SubLessonForm', key: 'submit', htmlType: 'submit' }}
                            >
                                <Form
                                    lesson={props.lesson}
                                    editData={editData}
                                    formType={formType}
                                    setIsModalVisible={setIsModalVisible}
                                />
                            </Modal>
                            <div className='text-right'>
                                <Button onClick={showModal} type="primary" icon={<PlusCircleOutlined />} block> <IntlMessage id="add_new" /></Button>
                            </div>
                        </>
                    }
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-4">
                    {data?.allOnlineSubByLesson.map((sub, index) => (
                        <Link
                            to={`${APP_PREFIX_PATH}/online-lesson/lessons/${props.lesson}/${sub.id}`}
                            key={index}
                            className={`border-regular border-1 pt-[20px] px-[25px] pb-[25px] bg-emind rounded-10 bg-cover bg-center`}
                        >
                            {Object.values(props.permissions).some(val => val === true) &&
                                <div className="flex items-center justify-between text-center">
                                    <h3 className='text-white font-bold text-base my-auto'>{sub.title}</h3>
                                    <EllipsisDropdown menu={dropdownMenu(sub)} />
                                </div>
                            }
                            <div className="flex items-center gap-[5px] text-slate-100 text-center mt-2">
                                <CalendarIcon className='h-7 text-slate-100' />
                                <p className='text-slate-100 my-auto font-semibold'>{moment(sub.dueDate).format('YYYY-MM-DD')}</p>
                            </div>
                            <div className='mt-2'>
                                <Scrollbars className='h-48 border-l-2 border-emind-400'>
                                    <p className={`ml-2 mb-[20px] leading-[1.786] whitespace-pre-line text-slate-200`}>
                                        {sub.description}
                                    </p>
                                </Scrollbars>
                            </div>
                            <div className="flex flex-wrap items-center justify-between">
                                <div className="flex items-center gap-[15px]">
                                    <img
                                        className="w-[30px] h-[30px] rounded-full bg-emind-400"
                                        src={
                                            sub.createUserid.teacher ? BASE_SERVER_URL + sub.createUserid.teacher.photo
                                                : BASE_SERVER_URL + 'avatar01.png'
                                        }
                                        alt=""
                                    />
                                    <span className={`text-[15px] font-medium text-slate-100`}>{sub.createUserid.teacher?.name}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    )

}

export default AllSub;