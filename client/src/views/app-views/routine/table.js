import React, { useState } from 'react'
import { Card, Table, Input, Modal, message, Button } from 'antd';
import { DeleteTwoTone, SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex';
import utils from 'utils';
import RoutineForm from './form';
import { useMutation } from '@apollo/client';
import { DELETE_ROUTINE } from 'graphql/delete';
import IntlMessage from 'components/util-components/IntlMessage';

const RoutineTable = ({ permissions, data, loading, fetchRoutines, fetchTimes, refetch, refetchTimes }) => {

    const [filter, setFilter] = useState('');

	const [isModalVisible, setIsModalVisible] = useState(false);
	
	const [formType, setFormType] = useState("");

    const showModal = () => {
		setFormType("create");
      	setIsModalVisible(true);
    };

    const handleCancel = () => {
      	setIsModalVisible(false);
	};

	const { confirm } = Modal;

	const [deleteRoutine, { loading: loadingDelete }] = useMutation(DELETE_ROUTINE, {
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
			deleteRoutine({ variables: { id: row.id } }); 
		  },
		});
	}

	const tableColumns = [
		{
			key: 'schoolyear',
			title: <IntlMessage id="schoolyear" />,
			dataIndex: ['schoolyear', 'schoolyear'],
			sorter: (a, b) => utils.antdTableSorter(a, b, 'schoolyear')
		},
		{
			key: 'classes',
			title: <IntlMessage id="classes" />,
			dataIndex: ['classes', 'program', 'program'],
			sorter: (a, b) => utils.antdTableSorter(a, b, 'classes')
		},
		{
			key: 'section',
			title: <IntlMessage id="section" />,
			dataIndex: ['section', 'section'],
			sorter: (a, b) => utils.antdTableSorter(a, b, 'section')
		},
		{
			key: 'subject',
			title: <IntlMessage id="subject" />,
			dataIndex: ['subject', 'subject'],
			sorter: (a, b) => utils.antdTableSorter(a, b, 'subject')
		},
		{
			key: 'teacher',
			title: <IntlMessage id="teacher" />,
            children: [
                {
                    key: 'familyName',
                    title: <IntlMessage id="familyName" />,
                    dataIndex: ['teacher', 'familyName']
                },
                {
                    key: 'teacher',
                    title: <IntlMessage id="name" />,
                    dataIndex: ['teacher', 'name']
                }
            ],
			sorter: (a, b) => utils.antdTableSorter(a, b, 'teacher')
		},
	];
	if (permissions.destroy === true) {
		tableColumns.push(
			{
				key: 'actions',
				title: <IntlMessage id="main.action" />,
				width: '10wd',
				dataIndex: 'actions',
				render: (_, elm) => (
					<div className="text-center">
						{ permissions.destroy === true &&
							<Button
								type='text'
								onClick={() => deleteRow(elm)}
							>
								<DeleteTwoTone twoToneColor="#f42f2f"/>
								<span className="ml-2"><IntlMessage id="delete" /></span>
							</Button>
						}
					</div>
				)
			}
		)
	}

	const onSearch = e => {
		const value = e.currentTarget.value;
        fetchRoutines({ variables: { offset: 0, limit: 10, filter: filter } })
        fetchTimes({ variables: { offset: 0, limit: 10, filter: filter } })
        setFilter(value)
	}

	return (
		<>
			<Modal 
                title={<IntlMessage id="add_new" />}
                visible={isModalVisible} 
				okText={<IntlMessage id="main.okText" />}
				cancelText={<IntlMessage id="main.cancelText" />}
				onCancel={handleCancel}
				width={'80vw'}
				okButtonProps={{form:'RoutineForm', key: 'submit', htmlType: 'submit'}}
            >
                <RoutineForm 
					formType={formType} 
					setIsModalVisible={setIsModalVisible}
                    refetch={refetch}
                    refetchTimes={refetchTimes}
				/>
            </Modal>
			<Card>
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
                        loading={loading || loadingDelete}
						columns={tableColumns} 
						dataSource={data}
						rowKey='id' 
						bordered
					/>
				</div>
			</Card>
		</>
		
	)
}

export default RoutineTable
