import React, { useState } from 'react'
import { Card, Table, Input, Spin, Empty, Modal, message, Button } from 'antd';
import { DeleteTwoTone, SearchOutlined, EditTwoTone, PlusCircleOutlined, EyeOutlined } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex'
import utils from 'utils'
import PlanForm from './plan-from'
import { useQuery, useMutation } from '@apollo/client';
import IntlMessage from "components/util-components/IntlMessage";
import { ALL_PLANS, DELETE_PLAN } from 'graphql/plan';
import { Link } from 'react-router-dom';

function  PlanTable ({ permissions }) {
    
	const [list, setList] = useState([])

	const { loading } = useQuery(ALL_PLANS, {
		onCompleted: data => {
			setList(data.allPlans);
		}
	});

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editData, setEditData] = useState({});
	const [formType, setFormType] = useState("");

    const showModal = () => {
		setFormType("create")
		setEditData({});
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

	const [deletePlan, { loading: loadingDelete }] = useMutation(DELETE_PLAN, {
		refetchQueries: [ALL_PLANS],
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
			deletePlan({ variables: { id: row.id, name: row.name, nameMgl: row.nameMgl } }); 
		  },
		});
	}

	const tableColumns = [
		{
			key: 'teacher',
            title: <IntlMessage id="teacher" />,
            dataIndex: 'teacher', 
			render: data => (
				<span>{data.familyName} {data.name}</span>
			),
			sorter: (a, b) => utils.antdTableSorter(a, b, 'teacher')
		},
		{
			key: 'approvedBy',
            title: <IntlMessage id="approvedBy" />,
            dataIndex: 'approvedBy',
			render: (_, { approvedBy }) => (
				approvedBy ? (
					<span>{approvedBy.familyName} {approvedBy.name}</span>
				) : <span>Батлагдаагүй</span>
			),
			sorter: (a, b) => utils.antdTableSorter(a, b, 'approvedBy')
		},
		{
			key: 'start_end_date',
			title: <IntlMessage id="start_end_date" />,
			dataIndex: 'start_end_date',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'start_end_date'),
			render: (_, { startDate, endDate }) => (
				<span>{startDate} - {endDate}</span>
			),
		},
		{
			key: 'actions',
			title: <IntlMessage id="main.action" />,
			width: '15vw',
			dataIndex: 'actions',
			render: (_, elm) => (
				<div className="text-center">
					<Link to={`plan/${elm.id}`}><Button size="small" type="text" icon={<EyeOutlined />}> <IntlMessage id="show" /></Button></Link>
					{ permissions.edit === true &&
						<Button size="small" onClick={() => editRow(elm)} type="text" icon={<EditTwoTone twoToneColor="#ffdb00"/>} > <IntlMessage id="edit" /> </Button>
					}
					{ permissions.destroy === true &&
						<Button size="small" onClick={() => deleteRow(elm)} type="text" icon={<DeleteTwoTone twoToneColor="#f42f2f"/>} > <IntlMessage id="delete" /></Button>
					}
				</div>
			)
		}
	];

	return (
		<>
			<Modal 
				forceRender
                title={formType === 'edit' ? <IntlMessage id='edit' /> : <IntlMessage id="add_new" /> }
                visible={isModalVisible} 
				okText={<IntlMessage id="main.okText" />}
				cancelText={<IntlMessage id="main.cancelText" />}
				onCancel={handleCancel}
				okButtonProps={{form:'PlanForm', key: 'submit', htmlType: 'submit'}}
            >
                <PlanForm formType={formType} setIsModalVisible={setIsModalVisible} editData={editData}/>
            </Modal>
			<Card>
				<Flex alignItems="center" justifyContent="between" mobileFlex={false}>
					<Flex className="mb-1" mobileFlex={false}>
						<div className="mr-md-3 mb-3">
							<Input placeholder={'Хайх'} prefix={<SearchOutlined />} />
						</div>
					</Flex>
					{ permissions.create === true &&
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

export default PlanTable
