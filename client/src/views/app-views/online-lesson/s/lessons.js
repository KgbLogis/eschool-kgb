import React, { lazy, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client';
import { Button, Modal, message, Pagination } from 'antd';
import { DeleteTwoTone, PlusCircleOutlined, EditTwoTone } from '@ant-design/icons';
import { Scrollbars } from 'react-custom-scrollbars';
import { Link } from "react-router-dom";
import moment from 'moment';
import Flex from 'components/shared-components/Flex';
import { ALL_ONLINE_LESSON, DELETE_ONLINE_LESSON } from 'graphql/lesson';
import IntlMessage from 'components/util-components/IntlMessage';
import { CalendarIcon } from '@heroicons/react/outline';
import { APP_PREFIX_PATH, BASE_SERVER_URL } from 'configs/AppConfig';
import Loading from 'components/shared-components/Loading';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';

const LessonForm = lazy(() => import('./lesson-form'));

const Lessons = ({ permissions }) => {

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10)

    const { confirm } = Modal;

    const { loading, refetch, data, error } = useQuery(ALL_ONLINE_LESSON, {
        variables: { page: page, perPage: perPage }
    });

    const [deleteLesson] = useMutation(DELETE_ONLINE_LESSON, {
        onCompleted: data => {
            refetch();
            message.success('Амжилттай устлаа');
        }
    });

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

    const editRow = values => {
        setEditData(values);
        setFormType("edit")
        setIsModalVisible(true);
    };

    const deleteModal = value => {
        confirm({
            title: 'Устгах уу?',
            okText: 'Устгах',
            okType: 'danger',
            cancelText: 'Болих',
            onOk() {
                deleteLesson({ variables: { id: value } });
            },
        });
    }

    const onPageChange = (page, pageSize) => {
        setPage(page)
        setPerPage(pageSize)
    }

    const dropdownMenu = row => (
        <div className='w-full flex flex-col space-y-2 bg-background p-2 rounded-2' onClick={e => (e && e.stopPropagation) && e.stopPropagation()}>
            {permissions.edit === true &&
                <Button onClick={() => editRow(row)}>
                    <EditTwoTone twoToneColor={'#ffdb00'} />
                </Button>
            }
            {/* {permissions.view_student === true &&
                <Link
                    to={`/app/online-lesson-students/${row.id}`}
                >
                    <Button>
                        <UsergroupAddOutlined />
                    </Button>
                </Link>
            } */}
            {permissions.destroy === true &&
                <Button onClick={() => deleteModal(row.id)} >
                    <DeleteTwoTone twoToneColor={'#f42f2f'} />
                </Button>
            }
        </div>
    );

    if (loading) {
        return <Loading />
    }

    if (error) {
        return null
    }

    return (
        <div>
            {permissions.create === true &&
                <>
                    <Modal
                        forceRender
                        width={'80vw'}
                        visible={isModalVisible}
                        okText={<IntlMessage id="main.okText" />}
                        cancelText={<IntlMessage id="main.cancelText" />}
                        onCancel={handleCancel}
                        okButtonProps={{ form: 'LessonForm', key: 'submit', htmlType: 'submit' }}
                    >
                        <LessonForm formType={formType} setIsModalVisible={setIsModalVisible} editData={editData} refetch={refetch} />
                    </Modal>
                    <Flex justifyContent="end" alignItems="center" className="py-2">
                        <div>
                            <Button
                                style={{ float: 'right' }}
                                size='small'
                                type="primary"
                                onClick={() => showModal()}
                            >
                                <PlusCircleOutlined />  <IntlMessage id="add_new" />
                            </Button>
                        </div>
                    </Flex>
                </>
            }

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 w-full mt-4">
                {data.allOnlineLessonsPagination.records.map((lesson, index) => (
                    <Link
                        to={`${APP_PREFIX_PATH}/online-lesson/${lesson.id}`}
                        key={index}
                        className={`border-regular border-1 pt-[20px] px-[25px] pb-[25px] bg-emind/10 rounded-10 bg-cover bg-center`}
                    >
                        {Object.values(permissions).some(val => val === true) &&
                            <div className="flex items-center justify-end">
                                <EllipsisDropdown menu={dropdownMenu(lesson)} />
                            </div>
                        }
                        <div>
                            <Scrollbars className='h-48'>
                                <p className={`mb-[20px] leading-[1.786] whitespace-pre-line`}>
                                    {lesson.description}
                                </p>
                            </Scrollbars>
                        </div>
                        <div className="flex flex-wrap items-center justify-between">
                            <div className="flex items-center gap-[15px]">
                                <img
                                    className="w-[30px] h-[30px] rounded-full bg-emind"
                                    src={
                                        lesson.createUserid.teacher ? BASE_SERVER_URL+lesson.createUserid.teacher.photo
                                         : BASE_SERVER_URL + 'avatar01.png'
                                    }
                                    alt=""
                                />
                                <span className={`text-[15px] font-medium `}>{lesson.createUserid.teacher?.name}</span>
                            </div>
                            <div className="flex items-center gap-[15px]">
                                <CalendarIcon className='h-7 text-emind' />
                                <p>{moment(lesson.createdAt).format('YYYY-MM-DD')}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            {data.allOnlineLessonsPagination.pageCount > 0 && (
                <Pagination
                    className='text-right mt-4'
                    total={data.allOnlineLessonsPagination.totalCount}
                    onChange={onPageChange}
                />
            )}
        </div>
    )

}

export default Lessons
