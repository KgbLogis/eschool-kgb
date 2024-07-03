import React, { useState, useEffect, useContext } from 'react'
import { Card, Table, Input, Spin, Empty, Modal, message, Button } from 'antd';
import { DeleteTwoTone, SearchOutlined, EditTwoTone, PlusCircleOutlined, EyeTwoTone, HighlightTwoTone, ArrowRightOutlined } from '@ant-design/icons';
import { useQuery, useMutation } from '@apollo/client';
import { Link, useHistory } from 'react-router-dom';
import Flex from 'components/shared-components/Flex'
import utils from 'utils'
import TestForm from './form'
import { APP_PREFIX_PATH } from 'configs/AppConfig';
import { ALL_TAKE_TEST, DELETE_TAKE_TEST } from 'graphql/test';
import IntlMessage from 'components/util-components/IntlMessage';
import { UserContext } from 'hooks/UserContextProvider';

function  TestLibTable ({ permissions }) {
    
    const contextData = useContext(UserContext)
    const [user] = useState(contextData.user);

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editData, setEditData] = useState([]);
	const [formType, setFormType] = useState("");
	const [list, setList] = useState([]);
    const history = useHistory();

	const { loading, data, refetch } = useQuery(ALL_TAKE_TEST, {
        pollInterval: 5000,
	});

    useEffect(() => {
        if(loading === false && data){
            setList(data.allTakeTests);
        }
    }, [loading, data])

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

	const addQuestion = value => {
		history.push(`${APP_PREFIX_PATH}/take-test/${value}`);
	}

	const startTest = value => {
		history.push(`${APP_PREFIX_PATH}/exam/${value}`);
	}

	const { confirm } = Modal;

	const [destroy, { loading: loadingDelete }] = useMutation(DELETE_TAKE_TEST, {
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
			destroy({ variables: { id: row.id } }); 
		  },
		});
	}

	const tableColumns = [
		{
			key: 'title',
			title: <IntlMessage id="name" />,
			dataIndex: 'title',
			width: '20vw',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'title')
		},
		{
			key: 'description',
            title: <IntlMessage id="description" />,
            dataIndex: 'description',
			width: '35vw',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'description')
		},
		{
			key: 'status',
			title: <IntlMessage id="status" />,
			dataIndex: 'status',
			width: '10vw',
			render: text => {
				return (text === 'CLOSED' ? <IntlMessage id ="status.closed" /> : <IntlMessage id="status.open" />)
			},
			sorter: (a, b) => utils.antdTableSorter(a, b, 'status')
		},
		{
			key: 'actions',
			title: <IntlMessage id="main.action" />,
			width: '20vw',
			dataIndex: 'actions',
			render: (_, elm) => (
				<div className="text-center">
					{ elm.status === 'OPEN' && user.isStudent && 
						<Button size="small" onClick={() => startTest(elm.id)} type="text" icon={<HighlightTwoTone />} > <IntlMessage id="take-exam" /></Button>
					}
					{ permissions.add_question === true &&
						<Button size="small" onClick={() => addQuestion(elm.id)} type="text" icon={<EyeTwoTone />} > <IntlMessage id="main.read-more" /></Button>
					}
					{ permissions.edit === true &&
						<Button size="small" onClick={() => editRow(elm)} type="text" icon={<EditTwoTone twoToneColor="#ffdb00"/>} > <IntlMessage id="edit" /></Button>
					}
					{ permissions.destroy === true &&
						<Button size="small" onClick={() => deleteRow(elm)} type="text" icon={<DeleteTwoTone twoToneColor="#f42f2f"/>} > <IntlMessage id="delete" /></Button>
					}
				</div>
			)
		}
	];

	const onSearch = e => {
		const value = e.currentTarget.value
		const searchArray = e.currentTarget.value? list : data.allOnlineTests
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
				onCancel={handleCancel}
				okButtonProps={{form:'TestForm', key: 'submit', htmlType: 'submit'}}
            >
                <TestForm formType={formType} setIsModalVisible={setIsModalVisible} editData={editData}/>
            </Modal>
			{ permissions.view_online_test &&
				<Link
					to="online-test-library"
				>
					<Button icon={<ArrowRightOutlined />}> <IntlMessage id="online-test-library" /></Button>
				</Link>
			}
			<Card className='mt-4'>
				<Flex alignItems="center" justifyContent="between" mobileFlex={false}>
					<Flex className="mb-1" mobileFlex={false}>
						<div className="mr-md-3 mb-3">
							<Input placeholder={'Хайх'} prefix={<SearchOutlined />} onChange={e => onSearch(e)}/>
						</div>
					</Flex>
					{ permissions.create === true &&
						<div className="mr-md-3 mb-3">
							<Button onClick={showModal} type="primary" icon={<PlusCircleOutlined />} block> <IntlMessage id="add_new" /></Button>
						</div>
					}
				</Flex>
				<div className="table-responsive">
					<Table 
						columns={tableColumns} 
						dataSource={list}
						rowKey='id'  
						bordered
						size='small'
						locale={{
							emptyText: loading || loadingDelete ? <Spin /> : <Empty />
						}}
					/>
				</div>
			</Card>
		</>
		
	)
}

export default TestLibTable
