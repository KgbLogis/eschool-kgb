import React, { useState, useEffect } from 'react'
import { Card, Table, Input, Spin, Empty, Modal, message, Button } from 'antd';
import { DeleteTwoTone, SearchOutlined, EditTwoTone, PlusCircleOutlined, EyeTwoTone } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex'
import utils from 'utils'
import SchoolForm from './form'
import { useQuery, useMutation } from '@apollo/client';
import IntlMessage from "components/util-components/IntlMessage";
import { ALL_CONTACT_BOOKS, DELETE_CONTACT_BOOK } from 'graphql/contact-book';
import moment from 'moment';
import { BASE_SERVER_URL } from 'configs/AppConfig';

function ContactBookModal({ data }) {

	if (!data) {
		return <Empty />
	}

	return (
		<div>
			<div className="px-4 sm:px-0">
				<h3 className="text-base font-semibold leading-7 text-gray-900">{moment(data.createdAt).format('YYYY-MM-DD')} өдрийн тэмдэглэл</h3>
				<p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Бөгөлсөн багш: {data.createUserid.lastName} {data.createUserid.firstName}</p>
			</div>
			<div className="mt-6 border-t border-gray-100">
				<dl className="divide-y divide-gray-100">
					<div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
						<dt className="text-sm font-medium leading-6 text-gray-900"><IntlMessage id="isMorningFoodEat" /></dt>
						<dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
							{data.isMorningFoodEat ? "Тийм" : "Үгүй"}
						</dd>
					</div>
					<div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
						<dt className="text-sm font-medium leading-6 text-gray-900"><IntlMessage id="isSleep" /></dt>
						<dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
							{data.isSleep ? "Тийм" : "Үгүй"}
						</dd>
					</div>
					<div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
						<dt className="text-sm font-medium leading-6 text-gray-900"><IntlMessage id="defecateCount" /></dt>
						<dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{data.defecateCount}</dd>
					</div>
					<div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
						<dt className="text-sm font-medium leading-6 text-gray-900"><IntlMessage id="physicalCondition" /></dt>
						<dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{data.physicalCondition}</dd>
					</div>
					<div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
						<dt className="text-sm font-medium leading-6 text-gray-900"><IntlMessage id="wordToSay" /></dt>
						<dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
							{data.wordToSay}
						</dd>
					</div>
					<div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
						<dt className="text-sm font-medium leading-6 text-gray-900"><IntlMessage id="main.image" /></dt>
						<dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
							<img src={BASE_SERVER_URL + data.file} alt="file" className="rounded-2 max-h-40" />
						</dd>
					</div>
				</dl>
			</div>
		</div>
	)
}

function ContactBookTable(props) {

	const { loading, data: contactData } = useQuery(ALL_CONTACT_BOOKS);

	const [list, setList] = useState(undefined)

	useEffect(() => {
		if (loading === false && contactData) {
			setList(contactData.allContactBooks);
		}
	}, [loading, contactData])

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isRowShow, setIsRowShow] = useState(false)
	const [selectedData, setSelectedData] = useState();
	const [formType, setFormType] = useState("");

	const showModal = () => {
		setFormType("create")
		setIsModalVisible(true);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
		setIsRowShow(false)
	};

	const editRow = row => {
		setSelectedData(row);
		setFormType("edit")
		setIsModalVisible(true);
	};

	function showRow(row) {
		setSelectedData(row);
		setIsRowShow(true);
	}

	const { confirm } = Modal;

	const [deleteContactBook, { loading: loadingDelete }] = useMutation(DELETE_CONTACT_BOOK, {
		refetchQueries: [ALL_CONTACT_BOOKS],
		onCompleted: data => {
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
				deleteContactBook({ variables: { id: row.id } });
			},
		});
	}

	const tableColumns = [
		{
			key: 'student',
			title: <IntlMessage id="student" />,
			dataIndex: 'student',
			width: '43%',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'name'),
			render: (student) => (
				<span>{student.familyName} {student.name}</span>
			)
		},
		{
			key: 'createdAt',
			title: <IntlMessage id="date" />,
			dataIndex: 'createdAt',
			width: '43%',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'createdAt'),
			render: (date) => (
				<span>{moment(date).format('YYYY-MM-DD')}</span>
			)
		},
		{
			key: 'actions',
			title: <IntlMessage id="main.action" />,
			width: '15vw',
			dataIndex: 'actions',
			render: (_, elm) => (
				<div className="text-center">
					<Button
						size="small"
						onClick={() => showRow(elm)}
						type="text"
						icon={<EyeTwoTone />}
					>
						{` `}<IntlMessage id="show" />
					</Button>

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

	const onSearch = e => {
		const value = e.currentTarget.value
		const searchArray = e.currentTarget.value ? list : contactData?.allSchools
		const data = utils.wildCardSearch(searchArray, value)
		setList(data)
	}

	return (
		<>
			<Modal
				forceRender
				title={formType === 'edit' ? <IntlMessage id='edit' /> : <IntlMessage id="add_new" />}
				visible={isModalVisible}
				okText={<IntlMessage id="main.okText" />}
				cancelText={<IntlMessage id="main.cancelText" />}
				onCancel={handleCancel}
				okButtonProps={{ form: 'ContactBookForm', key: 'submit', htmlType: 'submit' }}
				width={1000}
			>
				<SchoolForm formType={formType} setIsModalVisible={setIsModalVisible} editData={selectedData} />
			</Modal>
			<Modal
				forceRender
				onCancel={handleCancel}
				visible={isRowShow}
				width={1000}
				footer={<Button onClick={handleCancel} type="primary"><IntlMessage id="main.close" /></Button>}
			>
				<ContactBookModal data={selectedData} />
			</Modal>
			<Card>
				<Flex alignItems="center" justifyContent="between" mobileFlex={false}>
					<Flex className="mb-1" mobileFlex={false}>
						<div className="mr-md-3 mb-3">
							<Input placeholder={'Хайх'} prefix={<SearchOutlined />} onChange={e => onSearch(e)} />
						</div>
					</Flex>
					{props.permissions.create === true &&
						<div className="mr-md-3 mb-3">
							<Button onClick={showModal} type="primary" icon={<PlusCircleOutlined />} block> <IntlMessage id="add_new" /> </Button>
						</div>
					}
				</Flex>
				<div className="table-responsive">
					<Table
						columns={tableColumns}
						size="small"
						dataSource={list}
						rowKey='id'
						bordered
						locale={{
							emptyText: loading || loadingDelete ? <Spin /> : <Empty />
						}}
					/>
				</div>
			</Card>
		</>

	)
}

export default ContactBookTable
