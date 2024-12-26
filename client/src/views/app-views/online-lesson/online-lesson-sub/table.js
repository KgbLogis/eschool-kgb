import React, { useState, useEffect } from 'react'
import { Card, Table, Input, Menu, Modal, message, Spin, Button } from 'antd';
import { DeleteTwoTone, SearchOutlined, EditTwoTone, PlusCircleOutlined } from '@ant-design/icons';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex'
import utils from 'utils'
import Form from './form'
import { useQuery, useMutation } from '@apollo/client';
import { ALL_SUB_LESSON_BY_LESSON, DELETE_SUB_LESSON } from 'graphql/lesson'
import IntlMessage from 'components/util-components/IntlMessage';

function  AllSubSchoolTable (props) {

    const { loading, data, refetch } = useQuery(ALL_SUB_LESSON_BY_LESSON, {    
        variables: { onlineLesson: props.lesson }
    });
    
	const [list, setList] = useState(undefined);
	const [reFill, setReFill] = useState(true);
	const [tableLoading, setTableLoading] = useState(true);
	const [selectedRows] = useState([]);

    useEffect(() => {
		function fillList () {
			setList(data.allOnlineSubByLesson);
			setReFill(false);
			setTableLoading(false)
		}
        if(loading === false && data){
			fillList()
        }
    }, [loading, data, reFill])

	const dropdownMenu = row => (
		<Menu>
			{ props.permissions.edit === true &&
				<Menu.Item key="2" onClick={() => editRow(row)}>
					<Flex alignItems="center">
						<EditTwoTone twoToneColor="#ffdb00"/>
						<span className="ml-2">Засах</span>
					</Flex>
				</Menu.Item>
			}
			{ props.permissions.destroy === true &&
				<Menu.Item key="3" onClick={() => deleteRow(row)}>
					<Flex alignItems="center">
						<DeleteTwoTone twoToneColor="#f42f2f"/>
						<span className="ml-2">{selectedRows.length > 0 ? `Delete (${selectedRows.length})` : 'Устгах'}</span>
					</Flex>
				</Menu.Item>
			}
		</Menu>
	);

	const [editData, setEditData] = useState([]);
	const [formType, setFormType] = useState("");

	const editRow = row => {
		setEditData(row);
		setFormType("edit")
		setIsModalVisible(true);
	};

	const { confirm } = Modal;

	const [deleteSub] = useMutation(DELETE_SUB_LESSON, {
		onCompleted: data => {
            refetch();
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
			deleteSub({ variables: { id: row.id } }); 
		  },
		});
	}

	const tableColumns = [
		{
			title: <IntlMessage id="title" />,
			key: 'title',
			dataIndex: 'title',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'title')
		},
		{
            title: <IntlMessage id="onlineType" />,
            dataIndex: ['onlineType', 'name'], 
			key: 'onlineType',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'onlineType'),
		},
		{
            title: <IntlMessage id="description" />,
            dataIndex: 'description', 
			key: 'description',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'description'),
		},
		{
			title: <IntlMessage id="main.action" />,
			key: 'actions',
			dataIndex: 'actions',
			width: '10px',
			render: (_, elm) => (
				<div className="text-center">
					<EllipsisDropdown menu={dropdownMenu(elm)}/>
				</div>
			)
		}
	];
	
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
		const datas = utils.wildCardSearch(searchArray, value)
		setList(datas)
	}

	return (
		<>
			<Modal 
				forceRender 
                title={formType === 'edit' ? <IntlMessage id="edit" /> : <IntlMessage id="add_new" /> }
				visible={isModalVisible} 
				okText={<IntlMessage id="main.okText" />}
				cancelText={<IntlMessage id="main.cancelText" />}
                width={'80vw'}
				onCancel={handleCancel}
				okButtonProps={{form:'SubLessonForm', key: 'submit', htmlType: 'submit'}}
				>
					<Form 
						setTableLoading={setTableLoading} 
                        lesson={props.lesson}
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
							dataSource={list} 
							rowKey='id'  
							bordered
						/>
					</div>
				</Spin>
			</Card>
		</>
		
	)
}

export default AllSubSchoolTable
