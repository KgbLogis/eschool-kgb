import React, { useState, useEffect } from 'react'
import { Card, Table, Input, Modal, message, Button } from 'antd';
import { DeleteTwoTone, SearchOutlined, EditTwoTone, PlusCircleOutlined } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex'
import utils from 'utils'
import TeacherForm from './form'
import { useMutation, useLazyQuery } from '@apollo/client';
import { DELETE_TEACHER } from 'graphql/delete';
import { ALL_TEACHERS } from 'graphql/all';
import IntlMessage from 'components/util-components/IntlMessage';
import ChangePassword from 'components/shared-components/ChangePassword';

const { confirm } = Modal;

function  TeacherTable (props) {

	const [list, setList] = useState([])

    const modelName = 'Teacher';
    const appName = 'teacher';

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editData, setEditData] = useState({});
	const [formType, setFormType] = useState("");

	const [fetchData, { loading, refetch }] = useLazyQuery(ALL_TEACHERS, {
        fetchPolicy: 'network-only',
        onCompleted: data => {
			setList(data.allTeachers);
        }
	});

	const [deleteProgram] = useMutation(DELETE_TEACHER, {
		onCompleted: data => {
            refetch();
            message.success('Амжилттай устлаа');
		}
	});
	
    useEffect(() => {
        fetchData({ variables: { offset: 0, limit: 9, filter: '', modelName: modelName, appName: appName } })
    }, [fetchData])

    const showModal = () => {
		setFormType("create");
      	setIsModalVisible(true);
    };

	const editRow = row => {
		setFormType("edit");
		setEditData(row);
		setIsModalVisible(true);
	};

	function deleteRow(row) {
		confirm({
            title: 'Устгах уу?',
            okText: 'Устгах',
            okType: 'danger',
            cancelText: 'Болих',
            onOk() {
                deleteProgram({ variables: { id: row.id } }); 
            },
		});
	}

    const handleCancel = () => {
      setIsModalVisible(false);
    };

	const onSearch = e => {
		const value = e.currentTarget.value
        fetchData({ variables: { offset: 0, limit: 9, filter: value, modelName: modelName, appName: appName } })
	}

	const tableColumns = [
		{
			key: 'teacherCode',
			title: <IntlMessage id="teacherCode" />,
			dataIndex: 'teacherCode',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'teacherCode')
		},
		{
			key: 'familyName',
			title: <IntlMessage id="familyName" />,
			dataIndex: 'familyName',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'code')
		},
		{
			key: 'name',
			title: <IntlMessage id="name" />,
			dataIndex: 'name',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'name')
		},
		{
			key: 'school',
			title: <IntlMessage id="main-school" />,
			dataIndex: ['school', 'name'],
			sorter: (a, b) => utils.antdTableSorter(a, b, 'school')
		},
		{
			key: 'subSchool',
			title: <IntlMessage id="sub-school" />,
			dataIndex: ['subSchool', 'name'],
			sorter: (a, b) => utils.antdTableSorter(a, b, 'subSchool')
		},
		// {
		// 	key: 'degree',
		// 	title: <IntlMessage id="degree" />,
		// 	dataIndex: ['degree', 'name'],
		// 	sorter: (a, b) => utils.antdTableSorter(a, b, 'degree')
		// },
		{
			key: 'joinDate',
			title: <IntlMessage id="joinDate" />,
			dataIndex: 'joinDate',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'joinDate')
		},
		{
			key: 'phone',
			title: <IntlMessage id="phone1" />,
			dataIndex: 'phone',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'phone'),
			render: text => <span>{text.substr(0, 4) + `-` + text.substr(4, 9)}</span>,
		}
	];

	if (props.permissions.edit === true || props.permissions.destroy === true) {
		tableColumns.push(
			{
				key: 'actions',
				title: <IntlMessage id="main.action" />,
				width: '15vw',
				dataIndex: 'actions',
				render: (_, elm) => (
					<div className="text-center">
						{ props.permissions.password &&
							<ChangePassword user={elm.user.id} />
						}
                        {/* { props.permissions.permission &&
                            <Button 
                                size="small" 
                                onClick={() => history.push({
                                    pathname: `${APP_PREFIX_PATH}/teacher/permissions`,
                                    state: { user: elm.user.id, teacherCode: elm.teacherCode }
                                })} 
                                type="text" 
                                icon={<LockTwoTone />} 
                            > Хандах эрх
                            </Button>
                        } */}
						{ props.permissions.edit === true &&
							<Button size="small" onClick={() => editRow(elm)} type="text" icon={<EditTwoTone twoToneColor="#ffdb00"/>} > <IntlMessage id="edit" />
							</Button>
						}
						{ props.permissions.destroy === true &&
							<Button size="small" onClick={() => deleteRow(elm)} type="text" icon={<DeleteTwoTone twoToneColor="#f42f2f"/>} > <IntlMessage id="delete" />
							</Button>
						}
					</div>
				)
			}
		)
	}

	return (
		<>
			{ props.permissions.create || props.permissions.edit === true ?
				<Modal
					title={ formType === `create` ? <IntlMessage id="add_new" /> : <IntlMessage id="edit" /> } 
					visible={isModalVisible} 
					width={'80vw'}
					okText={<IntlMessage id="main.okText" />}
					cancelText={<IntlMessage id="main.cancelText" />}
					onCancel={handleCancel}
					okButtonProps={{form:'TeacherForm', key: 'submit', htmlType: 'submit'}}
				>
					<TeacherForm
                        refetch={refetch}
						formType={formType} 
						editData={editData} 
						setIsModalVisible={setIsModalVisible} 
					/>
				</Modal>
				:
				null
			}
			<Card>
				<Flex alignItems="center" justifyContent="between" mobileFlex={false}>
					<Flex className="mb-1" mobileFlex={false}>
						<div className="mr-md-3 mb-3">
							<Input placeholder={'Хайх'} prefix={<SearchOutlined />} onChange={e => onSearch(e)}/>
						</div>
					</Flex>
						{ props.permissions.create === true ?
							<div className="mr-md-3 mb-3">
								<Button onClick={showModal} type="primary" icon={<PlusCircleOutlined />} block> <IntlMessage id="add_new" /></Button>
							</div>
							:
							null
						}
				</Flex>
				<div className="table-responsive">
					<Table 
						size="small"
						columns={tableColumns} 
						dataSource={list}
						rowKey='id'
						bordered
                        loading={loading}
                        pagination={true}
					/>
                    {/* <Pagination 
                        className='text-right mt-4' 
                        total={count}
                        onChange={onPageChange}
                    /> */}
				</div>
			</Card>
		</>
		
	)
}

export default TeacherTable
