import React, { useState, useEffect } from 'react'
import { Card, Table, Input, Spin, Empty, Modal, message, Button } from 'antd';
import { DeleteTwoTone, SearchOutlined, EditTwoTone, PlusCircleOutlined } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex'
import utils from 'utils'
import SchoolForm from './form'
import { useQuery, useMutation } from '@apollo/client';
import IntlMessage from "components/util-components/IntlMessage";
import { ALL_SCHOOLS } from 'graphql/all';
import { DELETE_SCHOOL } from 'graphql/delete'

function  AllSchoolTable (props) {

	const { loading, data: schoolData } = useQuery(ALL_SCHOOLS, {
	});
    
	const [list, setList] = useState(undefined)

    useEffect(() => {
        if(loading === false && schoolData){
            setList(schoolData.allSchools);
        }
    }, [loading, schoolData])

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

	const editRow = row => {
		setEditData(row);
		setFormType("edit")
		setIsModalVisible(true);
	};

	const { confirm } = Modal;

	const [deleteSchool, { loading: loadingDelete }] = useMutation(DELETE_SCHOOL, {
		refetchQueries: [ALL_SCHOOLS,
			'allSchools'
		],
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
			deleteSchool({ variables: { id: row.id, name: row.name, nameMgl: row.nameMgl } }); 
		  },
		});
	}

	const tableColumns = [
		{
			key: 'name',
			title: <IntlMessage id="name" />,
			dataIndex: 'name',
			width: '43%',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'name')
		},
		{
			key: 'nameMgl',
            title: <IntlMessage id="nameMgl" />,
            dataIndex: 'nameMgl', 
			width: '43%',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'nameMgl')
		}
	];

	if (props.permissions.edit === true ||
		props.permissions.destroy === true ) {
			tableColumns.push(
				{
					key: 'actions',
					title: <IntlMessage id="main.action" />,
					width: '15vw',
					dataIndex: 'actions',
					render: (_, elm) => (
						<div className="text-center">
							{ props.permissions.edit === true &&
								<Button size="small" onClick={() => editRow(elm)} type="text" icon={<EditTwoTone twoToneColor="#ffdb00"/>} > <IntlMessage id="edit" /> </Button>
							}
							{ props.permissions.destroy === true &&
								<Button size="small" onClick={() => deleteRow(elm)} type="text" icon={<DeleteTwoTone twoToneColor="#f42f2f"/>} > <IntlMessage id="delete" /></Button>
							}
						</div>
					)
				}
			)
	}

	const onSearch = e => {
		const value = e.currentTarget.value
		const searchArray = e.currentTarget.value? list : schoolData?.allSchools
		const data = utils.wildCardSearch(searchArray, value)
		setList(data)
	}

	return (
		<>
			<Modal 
				forceRender
                title={formType === 'edit' ? <IntlMessage id='edit' /> : <IntlMessage id="add_new" /> }
                visible={isModalVisible} 
				okText={<IntlMessage id="main.okText" />}
				cancelText={<IntlMessage id="main.cancelText" />}
				onCancel={handleCancel}
				okButtonProps={{form:'SchoolForm', key: 'submit', htmlType: 'submit'}}
            >
                <SchoolForm formType={formType} setIsModalVisible={setIsModalVisible} editData={editData}/>
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

export default AllSchoolTable
