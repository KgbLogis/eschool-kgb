import React, { useState, useEffect } from 'react'
import { Card, Table, Input, Modal, message, Spin, Button } from 'antd';
import { DeleteTwoTone, SearchOutlined, EditTwoTone, PlusCircleOutlined } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex';
import utils from 'utils';
import SchoolForm from './form';
import { useQuery, useMutation } from '@apollo/client';
import IntlMessage from 'components/util-components/IntlMessage';
import { ALL_SUB_SCHOOLS } from 'graphql/all';
import { DELETE_SUB_SCHOOL } from 'graphql/delete';

function  AllSubSchoolTable (props) {

	const { loading, data: subSchoolData } = useQuery(ALL_SUB_SCHOOLS, {
	});
    
	const [list, setList] = useState(undefined);
	const [reFill, setReFill] = useState(true);
	const [tableLoading, setTableLoading] = useState(true);

    useEffect(() => {
		function fillList () {
			const newData = subSchoolData?.allSubSchools.map((data) => ({
				name: data.name,
				nameMgl: data.nameMgl,
				school: data.school,
				schoolId: data.school.id,
				key: data.id,
			}));
			setList(newData);
			setReFill(false);
			setTableLoading(false)
		}
        if(loading === false && subSchoolData){
			fillList()
        }
    }, [loading, subSchoolData, reFill])

	const [editData, setEditData] = useState([]);
	const [formType, setFormType] = useState("");

	const editRow = row => {
		setEditData(row);
		setFormType("edit")
		setIsModalVisible(true);
	};

	const { confirm } = Modal;

	const [deleteSubSchool] = useMutation(DELETE_SUB_SCHOOL, {
		refetchQueries: [ALL_SUB_SCHOOLS,
			'allSubSchool'
		],
		onCompleted: data => {
            setReFill(true);
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
			deleteSubSchool({ variables: { id: row.key } }); 
		  },
		});
	}

	const tableColumns = [
		{
			title: <IntlMessage id="name" />,
			key: 'name',
			width: '30%',
			dataIndex: 'name',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'name')
		},
		{
            title: <IntlMessage id="nameMgl" />,
			key: 'nameMgl',
			width: '30%',
            dataIndex: 'nameMgl', 
			sorter: (a, b) => utils.antdTableSorter(a, b, 'nameMgl')
		},
		{
            title: <IntlMessage id="school" />,
            dataIndex: ['school', 'name'], 
			key: 'school',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'school.name'),
		}
	];

	if (props.permissions.edit === true || props.permissions.destroy === true) {
		tableColumns.push(
			{
				title: <IntlMessage id="main.action" />,
				key: 'actions',
				dataIndex: 'actions',
				width: '15vw',
				render: (_, elm) => (
					<div className="text-center">
						{ props.permissions.edit === true &&
							<Button size="small" onClick={() => editRow(elm)} type="text" icon={<EditTwoTone twoToneColor="#ffdb00"/>} > <IntlMessage id='edit' /></Button>
						}
						{ props.permissions.destroy === true &&
							<Button size="small" onClick={() => deleteRow(elm)} type="text" icon={<DeleteTwoTone twoToneColor="#f42f2f"/>} > <IntlMessage id="delete"/></Button>
						}
					</div>
				)
			}
		)
	}
	
	const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
		setFormType("create")
      	setIsModalVisible(true);
    };

    const handleCancel = () => {
      	setIsModalVisible(false);
    };

	const onSearch = e => {
		const value = e.currentTarget.value
		if (!e.currentTarget.value) {
			setReFill(true)
		} 
		const searchArray = list;
		const data = utils.wildCardSearch(searchArray, value)
		setList(data)
	}

	return (
		<>
			<Modal 
				forceRender 
                title={formType === 'edit' ? <IntlMessage id="edit" /> : <IntlMessage id="add_new" /> }
				visible={isModalVisible} 
				okText={<IntlMessage id="main.okText" />}
				cancelText={<IntlMessage id="main.cancelText" />}
				onCancel={handleCancel}
				okButtonProps={{form:'SchoolForm', key: 'submit', htmlType: 'submit'}}
				>
					<SchoolForm 
						setTableLoading={setTableLoading} 
						setReFill={setReFill} 
						editData={editData} 
						formType={formType} 
						setIsModalVisible={setIsModalVisible}
					/>
			</Modal>
			<Card>
				<Flex alignItems="center" justifyContent="between" mobileFlex={false}>
					<Flex className="mb-1" mobileFlex={false}>
						<div className="mr-md-3 mb-3">
							<Input placeholder={'Хайх'} prefix={<SearchOutlined />} onChange={e => onSearch(e)}/>
						</div>
					</Flex>
					{ props.permissions.create === true && 
						<div className="mr-md-3 mb-3">
							<Button onClick={showModal} type="primary" icon={<PlusCircleOutlined />} block> <IntlMessage id="add_new" /></Button>
						</div>
					}
				</Flex>
				<Spin spinning={tableLoading}>
					<div className="table-responsive">
						<Table 
							columns={tableColumns} 
							size="small"
							dataSource={list} 
							rowKey='key'  
							bordered
						/>
					</div>
				</Spin>
			</Card>
		</>
		
	)
}

export default AllSubSchoolTable
