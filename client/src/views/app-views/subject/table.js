import React, { useState } from 'react'
import { Modal, message, Button, Table, Card, Input } from 'antd';
import { DeleteTwoTone, EditTwoTone, SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import utils from 'utils'
import SubjectForm from './form'
import { useMutation, useQuery } from '@apollo/client';
import { ALL_SUBJECTS_PAGINATION } from 'graphql/all';
import { DELETE_SUBJECT } from 'graphql/delete';
import IntlMessage from 'components/util-components/IntlMessage';
import Flex from 'components/shared-components/Flex';
import Loading from 'components/shared-components/Loading';

function SubjectTable({ permissions }) {

	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(10)
	const [filter, setFilter] = useState("");
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editData, setEditData] = useState([]);
	const [formType, setFormType] = useState("");

	const { loading, refetch, data } = useQuery(ALL_SUBJECTS_PAGINATION, {
		variables: { page: page, perPage: perPage, filter: filter }
	});

	const editRow = row => {
		setEditData(row);
		setFormType("edit")
		setIsModalVisible(true);
	};

	const { confirm } = Modal;

	const [deleteSubSchool] = useMutation(DELETE_SUBJECT, {
		onCompleted: data => {
			refetch();
			message.success('Амжилттай устлаа');
		}
	});

	function deleteRow(row) {
		confirm({
			title: 'Устгах уу?',
			okText: 'Устгах',
			okType: 'danger',
			cancelText: 'Болих',
			onOk() {
				deleteSubSchool({ variables: { id: row.id } });
			},
		});
	}

	const tableColumns = [
		{
			title: <IntlMessage id="subject" />,
			key: 'subject',
			dataIndex: 'subject',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'subject')
		},
		{
			title: <IntlMessage id="teacher" />,
			key: 'teacher',
			dataIndex: ['createUserid', 'teacher', 'name'],
			sorter: (a, b) => utils.antdTableSorter(a, b, 'teacher')
		},
		{
			title: <IntlMessage id="content" />,
			key: 'content',
			dataIndex: 'content',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'content')
		},
		{
			title: <IntlMessage id="school" />,
			dataIndex: ['school', 'name'],
			key: 'school',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'school')
		},
		{
			title: <IntlMessage id="sub-school" />,
			dataIndex: ['subSchool', 'name'],
			key: 'subSchool',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'subSchool')
		},
		{
			title: <IntlMessage id="credit" />,
			dataIndex: 'credit',
			key: 'credit',
			// render(elm) {
			//     return (
			//          <span>{Math.floor(elm)}</span>
			//     );
			// },
			sorter: (a, b) => utils.antdTableSorter(a, b, 'credit')
		},
	];
	if (permissions.edit === true || permissions.destroy === true) {
		tableColumns.push(
			{
				title: <IntlMessage id="main.action" />,
				key: 'actions',
				dataIndex: 'actions',
				width: '15vw',
				render: (_, elm) => (
					<div className="text-center">
						{permissions.edit === true &&
							<Button size="small" onClick={() => editRow(elm)} type="text" icon={<EditTwoTone twoToneColor="#ffdb00" />} > <IntlMessage id="edit" /></Button>
						}
						{permissions.destroy === true &&
							<Button size="small" onClick={() => deleteRow(elm)} type="text" icon={<DeleteTwoTone twoToneColor="#f42f2f" />} > <IntlMessage id="delete" /></Button>
						}
					</div>
				)
			}
		)
	}

	const showModal = () => {
		setFormType("create")
		setIsModalVisible(true);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const onSearch = e => {
		const value = e.currentTarget.value
		setFilter(value)
		setPage(1)
	}

	function handleTableChange (pagination, filters, sorter) {
		setPage(pagination.current);
		setPerPage(pagination.pageSize)
	}

	if (loading) {
		return <Loading cover='content' />
	}

	return (
		<>
			<Modal
				forceRender
				title={editData ? <IntlMessage id="edit" /> : <IntlMessage id="add_new" />}
				visible={isModalVisible}
				okText={<IntlMessage id="main.okText" />}
				cancelText={<IntlMessage id="main.cancelText" />}
				onCancel={handleCancel}
				okButtonProps={{ form: 'SubjectForm', key: 'submit', htmlType: 'submit' }}
			>
				<SubjectForm
					refetch={refetch}
					editData={editData}
					formType={formType}
					setIsModalVisible={setIsModalVisible}
				/>
			</Modal>
			<Card>
				<Flex alignItems="center" justifyContent="between" mobileFlex={false}>
					<Flex className="mb-1" mobileFlex={false}>
						<div className="mr-md-3 mb-3">
							<Input placeholder={'Хайх'} prefix={<SearchOutlined />} onChange={e => onSearch(e)} />
						</div>
					</Flex>
					{permissions.create === true &&
						<div className="mr-md-3 mb-3">
							<Button onClick={showModal} type="primary" icon={<PlusCircleOutlined />} block> <IntlMessage id="add_new" /></Button>
						</div>
					}
				</Flex>
				<div className="table-responsive">
					<Table
						size="small"
						columns={tableColumns}
						dataSource={data.allSubjectsPagination.records}
						rowKey='id'
						bordered
						loading={loading}
						pagination={{
							current: page,
							pageSize: perPage,
							total: data.allSubjectsPagination.totalCount
						}}
						onChange={handleTableChange}
					/>
				</div>
			</Card>
		</>

	)
}

export default SubjectTable
