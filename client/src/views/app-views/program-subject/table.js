import React, { useState, useEffect } from 'react'
import { Card, Table, Input, Modal, message, Spin, Button } from 'antd';
import { DeleteTwoTone, SearchOutlined, PlusCircleOutlined, RollbackOutlined } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex'
import utils from 'utils'
import SchoolForm from './form'
import { useQuery, useMutation } from '@apollo/client';
import { ALL_PROGRAM_SUBJECT_BY_PROGRAM, DELETE_PROGRAM_SUBJECT } from 'graphql/custom';
import { useHistory } from 'react-router-dom';
import IntlMessage from 'components/util-components/IntlMessage';

function  AllSubSchoolTable (props) {
    
	const [list, setList] = useState([]);
	const [formType, setFormType] = useState("");

	const history = useHistory();

	const { loading, refetch, data } = useQuery(ALL_PROGRAM_SUBJECT_BY_PROGRAM, {
        variables: {id: props.program}
    });

	useEffect(() => {
		if (loading === false && data) {
			setList(data.allProgramSubjectByProgram);
		}
	}, [data, loading])

	const { confirm } = Modal;

	const [destroy] = useMutation(DELETE_PROGRAM_SUBJECT, {
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
            title: <IntlMessage id="subject" />,
            dataIndex: ['subject', 'subject'], 
			key: 'subject',
            width: '40vw',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'subject'),
		},
        {
            title: <IntlMessage id="content" />,
            dataIndex: ['subject', 'content'], 
			key: 'content',
            width: '40vw',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'subject'),
		},
		{
			title: <IntlMessage id="teacher"/>,
			dataIndex: ['subject', 'createUserid', 'firstName'],
			key: 'teacher',
			width: '10vw',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'firstName'),
		}
	];

	if (props.permissions.destroy) {
		tableColumns.push(
			{
				title: <IntlMessage id="main.action" />,
				key: 'actions',
				dataIndex: 'actions',
				width: '20vw',
				render: (_, elm) => (
					<div className="text-center">
						{ props.permissions.destroy === true &&
							<Button size="small" onClick={() => deleteRow(elm)} type="text" icon={<DeleteTwoTone twoToneColor="#f42f2f"/>} > <IntlMessage id="delete" /></Button>
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
		const searchArray = e.currentTarget.value? list : data.allProgramSubjectByProgram
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
				okButtonProps={{form:'SchoolForm', key: 'submit', htmlType: 'submit'}}
				>
					<SchoolForm
						program={props.program}
						formType={formType} 
						setIsModalVisible={setIsModalVisible}
					/>
			</Modal>
			<Flex alignItems="center" justifyContent="between" mobileFlex={false}>
                <Flex mobileFlex={false}>
                    <div className='text-right' >
                        <Button onClick={() => history.goBack()} type="default" icon={<RollbackOutlined />} block> <IntlMessage id="back" /></Button>
                    </div>
                </Flex>
            </Flex>
			<Card className='mt-3'>
				<Flex alignItems="center" justifyContent="between" mobileFlex={false}>
					<Flex className="mb-1" mobileFlex={false}>
						<div className="mr-md-3 mb-3">
							<Input placeholder={'Хайх'} prefix={<SearchOutlined />} onChange={e => onSearch(e)}/>
						</div>
					</Flex>
					{ props.permissions.create === true && 
						<div className='mr-md-3 mb-3'>
							<Button onClick={showModal} type="primary" icon={<PlusCircleOutlined />} block> <IntlMessage id="add_new" /></Button>
						</div>
					}
				</Flex>
				<Spin spinning={loading}>
					<div className="table-responsive">
						<Table 
							columns={tableColumns} 
							dataSource={list} 
							size='small'
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
