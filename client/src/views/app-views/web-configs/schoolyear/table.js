import React, { useState, useEffect } from 'react'
import { Card, Table, Input, Spin, Empty, Modal, message, Button, Tag } from 'antd';
import { DeleteTwoTone, SearchOutlined, EditTwoTone, PlusCircleOutlined } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex'
import utils from 'utils'
import DegreeForm from './form'
import { useQuery, useMutation } from '@apollo/client';
import { ALL_SCHOOLYEAR, DELETE_SCHOOLYEAR } from 'graphql/core';
import IntlMessage from 'components/util-components/IntlMessage';

function  DegreeTable (props) {

	const { loading, data: schoolyearData, refetch } = useQuery(ALL_SCHOOLYEAR, {
	});
    
	const [list, setList] = useState(undefined)

    useEffect(() => {
        if(loading === false && schoolyearData){
            setList(schoolyearData.allSchoolyears);
        }
    }, [loading, schoolyearData]);

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

	const [deleteDegree, { loading: loadingDelete }] = useMutation(DELETE_SCHOOLYEAR, {
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
			deleteDegree({ variables: { id: row.id, name: row.name} }); 
		  },
		});
	}

	const tableColumns = [
		{
			key: 'schoolyear',
			title: <IntlMessage id="schoolyear" />,
			dataIndex: 'schoolyear',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'schoolyear')
		},
		{
			title: <IntlMessage id="start_end_date" />,
            children: [
                {
                    title: <IntlMessage id='startAt' />,
                    dataIndex: 'startDate',
                    key: 'startDate',
                    sorter: (a, b) => utils.antdTableSorter(a, b, 'startDate')
                },
                {
                    title: <IntlMessage id='endAt' />,
                    dataIndex: 'endDate',
                    key: 'endDate',
                    sorter: (a, b) => utils.antdTableSorter(a, b, 'endDate')
                },
            ]
		},
		{
			key: 'isCurrent',
			title: <IntlMessage id="isCurrent" />,
			dataIndex: 'isCurrent',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'isCurrent'),
            render: isCurrent => (
                <Tag color={isCurrent === false ? 'geekblue' : 'green'}>
                    {isCurrent === false ? <IntlMessage id="!current" /> : <IntlMessage id="current" />}
                </Tag>
            ),
		},
		{
			key: 'actions',
			title: <IntlMessage id="main.action" />,
			width: `15vw`,
			dataIndex: 'actions',
			render: (_, elm) => (
				<div className="text-center">
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
		const searchArray = e.currentTarget.value? list : schoolyearData?.allSchoolyears
		const data = utils.wildCardSearch(searchArray, value)
		setList(data)
	}

	return (
		<>
			<Modal
                visible={isModalVisible} 
				okText={<IntlMessage id="main.okText" />}
				cancelText={<IntlMessage id="main.cancelText" />}
				onCancel={handleCancel}
				okButtonProps={{form:'DegreeForm', key: 'submit', htmlType: 'submit'}}
            >
                <DegreeForm editData={editData} formType={formType} setIsModalVisible={setIsModalVisible} />
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

export default DegreeTable
