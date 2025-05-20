import React, { Fragment, useRef, useState } from 'react'
import { Button, Checkbox, Input, message, Modal, Space, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { DeleteTwoTone, EditTwoTone } from '@ant-design/icons';
import { Excel } from 'antd-table-saveas-excel';
import { useMutation, useQuery } from '@apollo/client';
import { ALL_STUDENTS_REPORT } from 'graphql/report';
import IntlMessage from 'components/util-components/IntlMessage';
import { classNames } from 'utils';
import { Menu, Transition } from '@headlessui/react';
import { DownloadIcon, FilterIcon } from '@heroicons/react/outline';
import { CheckPer } from 'hooks/checkPermission';
import ChangePassword from 'components/shared-components/ChangePassword';
import StudentForm from 'views/app-views/student/form';
import FormModal from 'components/shared-components/FormModal';
import { DELETE_STUDENT } from 'graphql/delete';

const { confirm } = Modal

const Index = () => {

    const [excelData, setExelData] = useState([])
    const [searchedColumn, setSearchedColumn] = useState({});
    const [editData, setEditData] = useState({});
    const modalRef = useRef();

    const { data, loading, refetch } = useQuery(ALL_STUDENTS_REPORT, {
        onCompleted: res => {
            setExelData(res.allStudentsReport)
        }
    })

    console.log(searchedColumn);
    
	const [deleteStudent] = useMutation(DELETE_STUDENT, {
		onCompleted: data => {
            refetch();
            message.success('Амжилттай устлаа');
		}
	});

    function handleSearch(selectedKeys, confirm, dataIndex, dataIndex2) {
        confirm();
        setSearchedColumn(prevData => ({
            ...prevData,
            [dataIndex+dataIndex2]: selectedKeys[0]
        }))
    }
    
    function handleReset(clearFilters, dataIndex, dataIndex2) {
        clearFilters();
        setSearchedColumn(current => {
            const copy = {...current};
            delete copy[dataIndex+dataIndex2];
            return copy;
        });
    }

    function getColumnSearchProps(dataIndex, dataIndex2) {

        return ({
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div className='p-2'>
                    <Input
                        placeholder={'Хайх'}
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex, dataIndex2)}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => handleSearch(selectedKeys, confirm, dataIndex, dataIndex2)}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        > Хайх </Button>
                        <Button onClick={() => handleReset(clearFilters, dataIndex, dataIndex2)} size="small" style={{ width: 90 }}> Арилгах </Button>
                    </Space>
                </div>
            ),
            filterIcon: filtered => (
                <SearchOutlined 
                    className={classNames(
                        filtered ? `text-[#F8B6A8]` : ''
                    )}
                />
            ),
            onFilter: (value, record) => (
                dataIndex2 ? record[dataIndex][dataIndex2].toString().toLowerCase().includes(value.toLowerCase())
                : record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
            ),
            render: text => (
                text
                // searchedColumn[dataIndex+dataIndex2] ? (
                //     <Highlighter
                //         highlightStyle={{ backgroundColor: '#69ffc0', padding: 0 }}
                //         searchWords={[searchedColumn[dataIndex+dataIndex2]]}
                //         autoEscape
                //         textToHighlight={text ? text.toString() : ''}
                //     />
                // ) : (
                //     text
                // )
            ),
        })
    };

    const [columns, setColumns] = useState([
        {
            title: "Эцэг /эх/-ийн нэр ",
            dataIndex: 'familyName',
            key: 'familyName',
            width: 150,
            visible: true,
            ...getColumnSearchProps('familyName'),
        },
        {
            title: "Нэр",
            dataIndex: 'name',
            key: 'name',
            width: 150,
            visible: true,
            ...getColumnSearchProps('name'),
        },
        {
            title: "Иргэншил",
            dataIndex: 'nationality',
            key: 'nationality',
            width: 150,
            visible: true,
            ...getColumnSearchProps('nationality'),
        },
        {
            title: "Үндэс угсаа",
            dataIndex: 'religion',
            key: 'religion',
            width: 150,
            visible: true,
            ...getColumnSearchProps('religion'),
        },
        {
            title: "Суралцагчийн код",
            dataIndex: 'studentCode',
            key: 'studentCode',
            width: 150,
            visible: true,
            ...getColumnSearchProps('studentCode'),
        },
        {
            title: "Салбар сургууль",
            dataIndex: ['school', 'name'],
            key: 'school',
            width: 200,
            visible: true,
            ...getColumnSearchProps('school', 'name'),
        },
        {
            title: "Хөтөлбөр",
            dataIndex: ['program', 'program'],
            key: 'program',
            width: 100,
            visible: true,
            ...getColumnSearchProps('program', 'program'),
        },
        {
            title: "Анги дамжаа",
            dataIndex: ['classes', 'classes'],
            key: 'classes',
            width: 100,
            visible: true,
            ...getColumnSearchProps('classes', 'classes'),
        },
        {
            title: "Бүлэг",
            dataIndex: ['section', 'section'],
            key: 'section',
            width: 100,
            visible: true,
            ...getColumnSearchProps('section', 'section'),
        },
        {
            title: "Төрсөн огноо",
            dataIndex: 'birthdate',
            key: 'birthdate',
            width: 150,
            visible: true,
            ...getColumnSearchProps('birthdate'),
        },
        {
            title: "Төрсөн аймаг /хот/",
            dataIndex: ['birthCity', 'name'],
            key: 'birthCity',
            width: 150,
            visible: true,
            ...getColumnSearchProps('birthCity', 'name'),
        },
        {
            title: "Төрсөн сум /дүүрэг/",
            dataIndex: ['birthDistrict', 'name'],
            key: 'birthDistrict',
            width: 150,
            visible: true,
            ...getColumnSearchProps('birthDistrict', 'name'),
        },
        {
            title: "И-мэйл",
            dataIndex: ['user', 'email'],
            key: 'email',
            width: 100,
            visible: true,
            ...getColumnSearchProps('user', 'email'),
        },
        {
            title: "Утас",
            dataIndex: 'phone',
            key: 'phone',
            width: 100,
            visible: true,
            ...getColumnSearchProps('phone'),
        },
        {
            title: "Сургуульд элссэн огноо",
            dataIndex: ['joinSchoolyear', 'schoolyear'],
            key: 'email',
            width: 150,
            visible: true,
            ...getColumnSearchProps('joinSchoolyear', 'joinSchoolyear'),
        },
        {
            title: "Суралцагчийн төлөв",
            dataIndex: ['status', 'name'],
            key: 'status',
            width: 150,
            visible: true,
            ...getColumnSearchProps('status', 'name'),
        },
        {
            title: "Суралцагчийн нэмэлт төлөв",
            dataIndex: ['statusExtra', 'name'],
            key: 'status',
            width: 150,
            visible: true,
            ...getColumnSearchProps('statusExtra', 'name'),
        },
    ])

	function deleteRow(row) {
		confirm({
            title: "Устгах уу?",
            okText: "Устгах",
            okType: 'danger',
            cancelText: "Болих",
            onOk() {
                deleteStudent({ variables: { id: row.id } }); 
            },
		});
	}

    function onCheckBoxClick(e, dataIndex) {
        const temporaryarray = columns.slice();
        temporaryarray[dataIndex]['visible'] = e.target.checked
        setColumns(temporaryarray)
    }

    function handleOpen(params) {
        setEditData(params);
        modalRef.current.handleOpen()
    }
    
    function handleCancel() {
        modalRef.current.handleCancel()
    }

    const permissions = {
        edit: CheckPer('change_student'),
        destroy: CheckPer('delete_student'),
        password: CheckPer('change_user_password')
    }

    return (
        <div className='bg-white p-2'>
            <FormModal ref={modalRef} formName="StudentForm">
                <StudentForm
                    refetch={refetch}
                    formType={'edit'} 
                    editData={editData} 
                    setIsModalVisible={handleCancel}
                />
            </FormModal>
            <div className='flex justify-end'>
                <button
                    className='px-4 py-2 hover:bg-gray-50'
                    onClick={() => {
                        const excel = new Excel();
                        excel
                        .addSheet('Суралцагч')
                        .addColumns(columns.filter(col => col.visible))
                        .addDataSource(excelData)
                        .saveAs('Суралцагч.xlsx');
                    }}
                >
                    <DownloadIcon className="h-5 w-5 text-mkp" aria-hidden="true" />
                </button>
                <Menu as="div" className="relative inline-block text-left">
                    <div>
                        <Menu.Button className="inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                            <FilterIcon className="h-5 w-5 text-mkp" aria-hidden="true" />
                        </Menu.Button>
                    </div>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="flex flex-col p-1">
                            { columns.map((item, index) => (
                                <Checkbox 
                                    key={index}
                                    onChange={e => onCheckBoxClick(e, index)}
                                    checked={item.visible} 
                                    className='ml-1' 
                                    value={item.dataIndex} 
                                >
                                    {item.title}
                                </Checkbox>
                            ))}
                        </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
            <Table
                className='mt-4'
                loading={loading}
                columns={[...columns.filter(col => col.visible), ...[
                    {
                        key: 'actions',
                        title: <IntlMessage id="main.action" />,
                        width: '15vw',
                        dataIndex: 'actions',
                        render: (_, elm) => (
                            <div className="text-center">
                                { permissions.password &&
                                    <ChangePassword user={elm.user.id} />
                                }
                                {/* <Button size="small" onClick={() => history.push({pathname: '/app/student/transfer-student', state: {student: elm}})} type="text" icon={<SwapOutlined />} > <IntlMessage id="transfer-student" /></Button> */}
                                { permissions.edit === true &&
                                    <Button size="small" onClick={() => handleOpen(elm)} type="text" icon={<EditTwoTone twoToneColor="#ffdb00"/>} > <IntlMessage id="edit" /></Button>
                                }
                                { permissions.destroy === true &&
                                    <Button size="small" onClick={() => deleteRow(elm)} type="text" icon={<DeleteTwoTone twoToneColor="#f42f2f"/>} > <IntlMessage id="delete" /></Button>
                                }
                            </div>
                        )
                    }
                ]]}
                dataSource={data?.allStudentsReport}
                rowKey="id"
                bordered
                size="small"
                onChange={
                    (pagination, filters, sorter, extra) => {
                        setExelData(extra.currentDataSource)
                    } 
               } 
                pagination={{
                    defaultPageSize: 20
                }}
                scroll={{ x: 2000, y: 500 }}
            />
            
        </div>
    )
}
export default Index;