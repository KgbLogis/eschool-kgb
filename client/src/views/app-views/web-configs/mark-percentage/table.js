import React, { useState, useEffect } from 'react'
import { Card, Table, Input, Spin, Empty, Modal, message, Button } from 'antd';
import { DeleteTwoTone, SearchOutlined, EditTwoTone, PlusCircleOutlined } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex'
import utils from 'utils'
import MarkPercentageForm from './form'
import { useQuery, useMutation } from '@apollo/client';
import { ALL_MARK_PERCENTAGE, DELETE_MARK_PERCENTAGE } from 'graphql/mark'
import IntlMessage from 'components/util-components/IntlMessage';

function  MarkPercentageTable (props) {

	const { loading, data: markPercentageData } = useQuery(ALL_MARK_PERCENTAGE, {
	});
    
	const [list, setList] = useState(undefined)

    useEffect(() => {
        if(loading === false && markPercentageData){
            setList(markPercentageData.allMarkPercentages);
        }
    }, [loading, markPercentageData])

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editData, setEditData] = useState([]);
	const [formType, setFormType] = useState("");

    const showModal = () => {
		setFormType("create");
      	setIsModalVisible(true);
    };

    const handleCancel = () => {
      	setIsModalVisible(false);
    };

	const editRow = row => {
		setFormType("edit");
		setEditData(row);
		setIsModalVisible(true);
	};

	const { confirm } = Modal;

	const [deleteMarkPercentage, { loading: loadingDelete }] = useMutation(DELETE_MARK_PERCENTAGE, {
		refetchQueries: [ALL_MARK_PERCENTAGE],
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
			deleteMarkPercentage({ variables: { id: row.id } }); 
		  },
		});
	}

	const tableColumns = [
		{
			key: 'type',
			title: <IntlMessage id="mark.type" />,
			dataIndex: 'type',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'type')
		},
		{
			key: 'percentage',
			title: <IntlMessage id="mark.percentage" />,
			dataIndex: 'percentage',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'percentage')
		},
		{
			key: 'diam',
			title: <IntlMessage id="mark.diam" />,
			dataIndex: 'diam',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'diam')
		},
		{
			key: 'actions',
			title: <IntlMessage id="main.action" />,
			width: `20vw`,
			dataIndex: 'actions',
			render: (_, elm) => (
				<div className="text-center">
					{ props.permissions.edit === true &&
						<Button size='small' type='text' key="2" onClick={() => editRow(elm)}>
							<Flex alignItems="center">
								<EditTwoTone twoToneColor="#ffdb00"/>
								<span className="ml-2"> <IntlMessage id="edit" /></span>
							</Flex>
						</Button>
					}
					{ props.permissions.destroy === true &&
						<Button size='small' type='text' key="3" onClick={() => deleteRow(elm)}>
							<Flex alignItems="center">
								<DeleteTwoTone twoToneColor="#f42f2f"/>
								<span className="ml-2"> <IntlMessage id="delete" /></span>
							</Flex>
						</Button>
					}
				</div>
			)
		}
	];

    

	const onSearch = e => {
		const value = e.currentTarget.value
		const searchArray = e.currentTarget.value? list : markPercentageData.allMarkPercentages
		const data = utils.wildCardSearch(searchArray, value)
		setList(data)
	}

	return (
		<>
			<Modal
                visible={isModalVisible} 
				okText={<IntlMessage id="main.okText" />}
				cancelText={<IntlMessage id="main.cancelText" />}
				width={'80vw'}
				onCancel={handleCancel}
				okButtonProps={{form:'MarkPercentageForm', key: 'submit', htmlType: 'submit'}}
            >
                <MarkPercentageForm editData={editData} formType={formType} setIsModalVisible={setIsModalVisible} />
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
				<div className="table-responsive">
					<Table 
						columns={tableColumns} 
						dataSource={list}
						size='small'
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

export default MarkPercentageTable
