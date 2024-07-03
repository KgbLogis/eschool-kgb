import React, { useState } from 'react'
import { Card, Table, Input, Spin, Empty, Modal, message, Button } from 'antd';
import { DeleteTwoTone, SearchOutlined, EditTwoTone, PlusCircleOutlined, FileImageTwoTone } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex'
import utils from 'utils'
import DegreeForm from './form'
import { useQuery, useMutation } from '@apollo/client';
import IntlMessage from 'components/util-components/IntlMessage';
import { ALL_FOODS, DELETE_FOOD } from 'graphql/food';
import { useParams } from 'react-router-dom';
import ImageForm from './image-form';

function FoodTable (props) {

	const { foodMenu } = useParams()

	const { loading, data: foodData } = useQuery(ALL_FOODS, {
		variables: { foodMenu: foodMenu },
		onCompleted: data => {
            setList(data.allFoods);
		}
	});
    
	const [list, setList] = useState(undefined)

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isImageModalVisible, seImagetIsModalVisible] = useState(false);
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

	const onImageRowClick = (row) => {
		setEditData(row);
		seImagetIsModalVisible(true)
	}

	const handleImageCancel = () => {
		seImagetIsModalVisible(false)
	}

	const { confirm } = Modal;

	const [deleteDegree, { loading: loadingDelete }] = useMutation(DELETE_FOOD, {
		refetchQueries: [{
            query: ALL_FOODS,
            variables: { foodMenu: foodMenu }
        }],
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
			deleteDegree({ variables: { id: row.id } }); 
		  },
		});
	}

	const tableColumns = [
		{
			key: 'name',
			title: <IntlMessage id="name" />,
			dataIndex: 'name',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'name')
		},
		{
			key: 'actions',
			title: <IntlMessage id="main.action" />,
			width: `20vw`,
			dataIndex: 'actions',
			render: (_, elm) => (
				<div className="text-center">
					{
						props.permissions.edit === true &&
						<Button size='small' type='text' key="1" onClick={() => onImageRowClick(elm)}>
							<FileImageTwoTone />
							<span className="ml-2"> <IntlMessage id="main.image" /></span>
						</Button>
						
					}
					{ props.permissions.edit === true &&
						<Button size='small' type='text' key="2" onClick={() => editRow(elm)}>
							<EditTwoTone twoToneColor="#ffdb00"/>
							<span className="ml-2"> <IntlMessage id="edit" /></span>
						</Button>
					}
					{ props.permissions.destroy === true &&
						<Button size='small' type='text' key="3" onClick={() => deleteRow(elm)}>
							<DeleteTwoTone twoToneColor="#f42f2f"/>
							<span className="ml-2"> <IntlMessage id="delete" /></span>
						</Button>
					}
				</div>
			)
		}
	];

	const onSearch = e => {
		const value = e.currentTarget.value
		const searchArray = e.currentTarget.value? list : foodData?.allFoods
		const data = utils.wildCardSearch(searchArray, value)
		setList(data)
	}

	return (
		<>
			<Modal
				width={'80vw'}
                visible={isModalVisible} 
				okText={<IntlMessage id="main.okText" />}
				cancelText={<IntlMessage id="main.cancelText" />}
				onCancel={handleCancel}
				okButtonProps={{form:'DegreeForm', key: 'submit', htmlType: 'submit'}}
            >
                <DegreeForm editData={editData} formType={formType} setIsModalVisible={setIsModalVisible} />
            </Modal>
			<Modal
				width={'80vw'}
                visible={isImageModalVisible} 
				okText={<IntlMessage id="main.okText" />}
				cancelText={<IntlMessage id="main.cancelText" />}
				onCancel={handleImageCancel}
				okButtonProps={{form:'DegreeForm', key: 'submit', htmlType: 'submit'}}
            >
				<ImageForm editData={editData} />
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
						dataSource={foodData?.allFoods}
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

export default FoodTable
