import React, { useState, useEffect } from 'react'
import { Card, Table, Input, Spin, Modal, message, Button } from 'antd';
import { DeleteTwoTone, SearchOutlined, EditTwoTone, PlusCircleOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import Flex from 'components/shared-components/Flex'
import utils from 'utils';
import ProgramForm from './form';
import { useQuery, useMutation } from '@apollo/client';
import { ALL_PROGRAMS } from 'graphql/all';
import IntlMessage from 'components/util-components/IntlMessage';
import { DELETE_PROGRAM } from 'graphql/delete';
import { APP_PREFIX_PATH } from 'configs/AppConfig';

function  ProgramsTable (props) {

	const { loading, data: dataPrograms } = useQuery(ALL_PROGRAMS, {
	});
	const history = useHistory();
    
	const [list, setList] = useState(undefined)
    const [reFill, setReFill] = useState(true)
	const [tableLoading, setTableLoading] = useState(true);

    useEffect(() => {
		function fillList () {
            setList(dataPrograms.allPrograms);
			setReFill(false);
			setTableLoading(false);
		}
        if(loading === false && dataPrograms){
			fillList()
        }
    }, [loading, dataPrograms, reFill])

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

	var nf = Intl.NumberFormat();

	const [deleteProgram] = useMutation(DELETE_PROGRAM, {
		refetchQueries: [ALL_PROGRAMS,
			'allPrograms'
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
			deleteProgram({ variables: { id: row.id } }); 
		  },
		});
	}

	const showRow = (row) => {
		history.push(`${APP_PREFIX_PATH}/programs/${row.id}`);
	}

	const tableColumns = [
		{
			key: 'program',
			title: <IntlMessage id="name" />,
			dataIndex: 'program',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'program')
		},
		{
			key: 'programMgl',
            title: <IntlMessage id="nameMgl" />,
            dataIndex: 'programMgl', 
			sorter: (a, b) => utils.antdTableSorter(a, b, 'programMgl')
		},
		{
			key: 'school',
			title: <IntlMessage id="school" />,
			dataIndex: ['school', 'name'],
			sorter: (a, b) => utils.antdTableSorter(a, b, 'school')
		},
		{
			key: 'subSchool',
			title: <IntlMessage id="sub-school" />,
			dataIndex: ['subSchool', 'name'],
			sorter: (a, b) => utils.antdTableSorter(a, b, 'subSchool')
		},
		{
			key: 'maxStudentNum',
			title: <IntlMessage id="maxStudentNum" />,
			dataIndex: 'maxStudentNum',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'maxStudentNum'),
			render: text => <span>{nf.format(text)}</span>
		}
	];

	if (props.permissions.edit || props.permissions.destroy) {
		tableColumns.push(
			{
				key: 'actions',
				title: <IntlMessage id="main.action" />,
				dataIndex: 'actions',
				width: '20vw',
				render: (_, elm) => (
					<div className="text-center">
						{ props.permissions.edit === true &&
							<Button size="small" onClick={() => editRow(elm)} type="text" icon={<EditTwoTone twoToneColor="#ffdb00"/>} > <IntlMessage id="edit" /></Button>
						}
						{ props.permissions.destroy === true &&
							<Button size="small" onClick={() => deleteRow(elm)} type="text" icon={<DeleteTwoTone twoToneColor="#f42f2f"/>} > <IntlMessage id="delete" /> </Button>
						}
					</div>
				)
			}
		)
	}

	const onSearch = e => {
		const value = e.currentTarget.value
		if (!value) {
			setReFill(true)
		}
		const searchArray = list
		const data = utils.wildCardSearch(searchArray, value)
		setList(data)
	}

	return (
		<>
			<Modal 
                title={formType === 'edit' ? <IntlMessage id="edit" /> : <IntlMessage id="add_new3" /> } 
                visible={isModalVisible} 
				okText={<IntlMessage id="main.okText" />}
				cancelText={<IntlMessage id="main.cancelText" />}
				onCancel={handleCancel}
				okButtonProps={{form:'ProgramForm', key: 'submit', htmlType: 'submit'}}
            >
                <ProgramForm 
					setTableLoading={setTableLoading} 
					setReFill={setReFill} 
					formType={formType} 
					editData={editData} 
					setIsModalVisible={setIsModalVisible} 
				/>
            </Modal>
			<Card>
				<Flex alignItems="center" justifyContent="between" mobileFlex={false}>
					<Flex className="mb-1" mobileFlex={false}>
						<div className="mr-md-3 mb-3">
							<Input placeholder={"Хайх"} prefix={<SearchOutlined />} onChange={e => onSearch(e)}/>
						</div>
					</Flex>
					{ props.permissions.create === true &&
						<div className="mr-md-3 mb-3">
							<Button onClick={showModal} type="primary" icon={<PlusCircleOutlined />} block> <IntlMessage id="add_new" /></Button>
						</div>
					}
				</Flex>
				<div className="table-responsive">
					<Spin spinning={tableLoading}>
						<Table 
							columns={tableColumns} 
							size="small"
							dataSource={list}
							rowKey='id' 
							bordered
						/>
					</Spin>
				</div>
			</Card>
		</>
		
	)
}

export default ProgramsTable
