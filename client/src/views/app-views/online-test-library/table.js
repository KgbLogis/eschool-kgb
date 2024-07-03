import React, { useState, useEffect } from 'react'
import { Card, Table, Input, Spin, Empty, Modal, message, Button } from 'antd';
import { DeleteTwoTone, SearchOutlined, EditTwoTone, PlusCircleOutlined, SnippetsTwoTone, RollbackOutlined } from '@ant-design/icons';
import { useQuery, useMutation } from '@apollo/client';
import { Link, useHistory } from 'react-router-dom';
import Flex from 'components/shared-components/Flex'
import utils from 'utils'
import TestForm from './form'
import { APP_PREFIX_PATH } from 'configs/AppConfig';
import { ALL_ONLINE_TESTS, DELETE_ONLINE_TEST } from 'graphql/test';
import IntlMessage from 'components/util-components/IntlMessage';

function  TestLibTable (props) {

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editData, setEditData] = useState([]);
	const [formType, setFormType] = useState("");
	const [list, setList] = useState([]);
    const history = useHistory();

	const { loading, data, refetch } = useQuery(ALL_ONLINE_TESTS, {
	});

    useEffect(() => {
        if(loading === false && data){
            setList(data.allOnlineTests);
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
		history.push(`${APP_PREFIX_PATH}/online-test-library/${value}`);
	}

	const { confirm } = Modal;

	const [destroy, { loading: loadingDelete }] = useMutation(DELETE_ONLINE_TEST, {
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
			key: 'subject',
			title: <IntlMessage id="subject" />,
			dataIndex: ['subject', 'subject'],
			width: '10vw',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'subject')
		},
		{
			key: 'description',
            title: <IntlMessage id="description" />,
            dataIndex: 'description',
			width: '35vw',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'description')
		},
		{
			key: 'actions',
			title: <IntlMessage id="main.action" />,
			width: '20vw',
			dataIndex: 'actions',
			render: (_, elm) => (
				<div className="text-center">
					{ props.permissions.add_question === true &&
						<Button size="small" onClick={() => addQuestion(elm.id)} type="text" icon={<SnippetsTwoTone twoToneColor="#acdf87"/>} > <IntlMessage id="add-question" /></Button>
					}
					{ props.permissions.edit === true &&
						<Button size="small" onClick={() => editRow(elm)} type="text" icon={<EditTwoTone twoToneColor="#ffdb00"/>} > <IntlMessage id="edit" /></Button>
					}
					{ props.permissions.destroy === true &&
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
			<Link
				to="take-test"
			>
				<Button type="default" icon={<RollbackOutlined />}> {<IntlMessage id="back" />}</Button>
			</Link>
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
			<Card
				className='mt-4'
			>
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
