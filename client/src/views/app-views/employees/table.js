import React, { useState } from 'react'
import { Card, Table, Input, Modal, message, Button } from 'antd';
import { DeleteTwoTone, SearchOutlined, EditTwoTone, PlusCircleOutlined } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex'
import utils from 'utils'
import TeacherForm from './form'
import { useMutation, useQuery } from '@apollo/client';
import { DELETE_EMPLOYEES } from 'graphql/delete';
import { ALL_EMPLOYEES } from 'graphql/all';
import IntlMessage from 'components/util-components/IntlMessage';
import ChangePassword from 'components/shared-components/ChangePassword';

const { confirm } = Modal;

function  TeacherTable (props) {

	const [list, setList] = useState([])
	const [filter, setFilter] = useState('')

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editData, setEditData] = useState({});
	const [formType, setFormType] = useState("");

	const { loading, refetch } = useQuery(ALL_EMPLOYEES, {
		variables: { filter: filter },
        onCompleted: data => {
			setList(data.allEmployees);
        }
	});

	const [deleteProgram] = useMutation(DELETE_EMPLOYEES, {
		onCompleted: data => {
            refetch();
            message.success('Амжилттай устлаа');
		}
	});

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
		setFilter(value)
	}

	const tableColumns = [
		{
			key: 'employeeCode',
			title: <IntlMessage id="employeeCode" />,
			dataIndex: 'employeeCode',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'employeeCode')
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
			key: 'name',
			title:"Албан тушаал",
			dataIndex: 'name',
            render: (_, elm) => (
                elm.user.groups?.map((item, index) => (
                    <span key={index} >{item.name} <br/></span>
                ))
            )
		},
		{
			key: 'compartment',
			title: <IntlMessage id="compartment" />,
			dataIndex: ['compartment', 'name'],
			sorter: (a, b) => utils.antdTableSorter(a, b, 'compartment')
		},
		{
			key: 'phone',
			title: <IntlMessage id="phone" />,
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
					title={ formType === `create` ? <IntlMessage id="add_new1" /> : <IntlMessage id="edit" /> } 
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
					/>
				</div>
			</Card>
		</>
		
	)
}

export default TeacherTable
