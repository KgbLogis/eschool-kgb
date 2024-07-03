import React, { useState, useEffect, useContext } from 'react'
import { Modal, message, Button, Table, Card, Input, Select } from 'antd';
import { DeleteTwoTone, EditTwoTone, PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import utils from 'utils'
import StudentForm from './form'
import { useMutation, useLazyQuery } from '@apollo/client';
import { DELETE_STUDENT } from 'graphql/delete';
import { ALL_STUDENTS } from 'graphql/all';
import IntlMessage from 'components/util-components/IntlMessage';
import ChangePassword from 'components/shared-components/ChangePassword';
import Flex from 'components/shared-components/Flex';
import { UserContext } from 'hooks/UserContextProvider';
import { SELECT_CLASSES, SELECT_PROGRAM, SELECT_SECTION } from 'graphql/select';

const { confirm } = Modal;
const { Option } = Select

function  StudentsTable (props) {
    
	const [list, setList] = useState([])

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editData, setEditData] = useState([]);
	const [formType, setFormType] = useState("");

    const [filter, setFilter] = useState('');
	const [program, setProgram] = useState(0)
	const [classes, setClasses] = useState(0)
	const [section, setSection] = useState(0)

	const [programList, setProgramList] = useState([])
	const [classesList, setListClasses] = useState([])
	const [sectionList, setListSection] = useState([])

	const { user } = useContext(UserContext)

	const [fetchStudent, { loading, refetch }] = useLazyQuery(ALL_STUDENTS, {
		variables: { variables: { filter: filter, classes: classes, section: section } },
        onCompleted: data => {
            setList(data.allStudents);
        }
	});

	// program: program,

	const [fetchProgram] = useLazyQuery(SELECT_PROGRAM, {
		onCompleted: data => {
			setProgramList(data.allPrograms);
		}
	})

	const [fetchClasses] = useLazyQuery(SELECT_CLASSES, {
		variables: { variables: { filter: '', program: program } },
		onCompleted: data => {
			setListClasses(data.allClassess);
		}
	})

	const [fetchSection] = useLazyQuery(SELECT_SECTION, {
		onCompleted: data => {
			setListSection(data.sectionsByClasses);
		}
	})

	// const [fetchSection] = useLazyQuery(SECTION_BY_CLASSES, {
	// 	variables: { variables: { classes: classes } },
	// 	onCompleted: data => {
	// 		console.log(data);
	// 	}
	// })

	const [deleteStudent] = useMutation(DELETE_STUDENT, {
		onCompleted: data => {
            refetch();
            message.success('Амжилттай устлаа');
		}
	});

    useEffect(() => {
		if (program !== 0 || user.isStudent === true || user.isTeacher === true || filter !== '') {
			fetchStudent({ variables: { filter: filter, program: program, classes: classes, section: section } })
		}

		if (user.isStudent !== true && user.isTeacher !== true) {
			fetchProgram();
		}
    }, [user, filter, program, classes, section, fetchProgram, fetchStudent])

	useEffect(() => {
		if (program !== 0) {
			fetchClasses()
		}
	}, [program, fetchClasses])
	

    const showModal = () => {
		setFormType("create");
      	setIsModalVisible(true);
    };

	const editRow = row => {
		setEditData(row);
		setFormType("edit");
		setIsModalVisible(true);
	};

	function deleteRow(row) {
		confirm({
		  title: "Устгах уу?",
		  okText: "Устгах",
		  okType: 'danger',
		  cancelText: "Болих",
		  onOk() {
			deleteStudent({ variables: { id: row.id } }); 
		  },
		});
	}

    const handleCancel = () => {
      setIsModalVisible(false);
    };

	const onSearch = e => {
        const value = e.currentTarget.value
        setFilter(value)
    }

	const tableColumns = [
		{
			key: 'studentCode',
			title: <IntlMessage id="studentCode" />,
			dataIndex: 'studentCode',
			width: '8vw',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'studentCode')
		},
		{
			key: 'classes',
			title: <IntlMessage id="classes" />,
			dataIndex: ['classes', 'classes'],
			width: '10vw',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'classes'),
			render: (_, elm) => (
				<span>{elm.classes.classes} - {elm.section.section} <br/></span>
            )
		},
		{
			key: 'familyName',
			title: <IntlMessage id="familyName" />,
			dataIndex: 'familyName',
			width: '10vw',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'familyName')
		},
		{
			key: 'name',
			title: <IntlMessage id="name" />,
			dataIndex: 'name',
			width: '10vw',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'name')
		},
		{
			key: 'registerNo',
			title: <IntlMessage id="registerNo" />,
			dataIndex: 'registerNo',
			width: '10vw',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'registerNo')
		},
		{
			key: 'phone',
			title: <IntlMessage id="phone" />,
			dataIndex: 'phone',
			width: '10vw',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'phone'),
			render: text => <span>{text.substr(0, 4) + `-` + text.substr(4, 9)}</span>,
		},
		{
			key: 'address',
			title: <IntlMessage id="address" />,
			dataIndex: 'address',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'address')
		}
	];

	if (props.permissions.edit === true || props.permissions.destroy === true) {
		tableColumns.push(
			{
				key: 'actions',
				title: <IntlMessage id="main.action" />,
				width: '15vw',
				dataIndex: 'actions',
				render: (_, elm) => (
					<div className="text-center">
						{ props.permissions.password &&
							<ChangePassword user={elm.user.id} />
						}
                        {/* <Button size="small" onClick={() => history.push({pathname: '/app/student/transfer-student', state: {student: elm}})} type="text" icon={<SwapOutlined />} > <IntlMessage id="transfer-student" /></Button> */}
						{ props.permissions.edit === true &&
							<Button size="small" onClick={() => editRow(elm)} type="text" icon={<EditTwoTone twoToneColor="#ffdb00"/>} > <IntlMessage id="edit" /></Button>
						}
						{ props.permissions.destroy === true &&
							<Button size="small" onClick={() => deleteRow(elm)} type="text" icon={<DeleteTwoTone twoToneColor="#f42f2f"/>} > <IntlMessage id="delete" /></Button>
						}
					</div>
				)
			}
		)
	}

	function onProgramChange(value) {
		setProgram(value);
	}

	function onClassesChange(value) {
		setClasses(value)
		fetchSection({ variables: { classes: value } })
	}

	function onSectionChange(value) {
		setSection(value)
	}

	return (
		<>
			<Modal 
                title={ formType === `create` ? <IntlMessage id="add_kid" /> : <IntlMessage id="edit" />}
                visible={isModalVisible} 
				width={'80vw'}
				okText={<IntlMessage id="main.okText" />}
				cancelText={<IntlMessage id="main.cancelText" />}
				onCancel={handleCancel}
				okButtonProps={{form:'StudentForm', key: 'submit', htmlType: 'submit'}}
            >
                <StudentForm
                    refetch={refetch}
					formType={formType} 
					editData={editData} 
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
						<div className="mr-md-3 mb-3 ">
							<Button onClick={showModal} type="primary" icon={<PlusCircleOutlined />} block> <IntlMessage id="add_kid" /></Button>
						</div>
					}
				</Flex>
				
					{user.isTeacher === false && 
					<div className='grid gap-2 mb-4 md:grid-cols-3' >
					<div>
						<span className='p-1'><IntlMessage id="program" /></span>
						<Select className='w-full' onChange={onProgramChange} >
							{ programList.map((item, index) => (
								<Option key={index} value={item.id} >{item.program}</Option>
							))}
						</Select>
					</div>
					<div>
						<span className='p-1'><IntlMessage id="classes" /></span>
						<Select className='w-full' onChange={onClassesChange}>
							{ classesList.map((item, index) => (
								<Option key={index} value={item.id} >{item.classes}</Option>
							))}
						</Select>
					</div>
					<div>
						<span className='p-1'><IntlMessage id="section" /></span>
						<Select className='w-full' onChange={onSectionChange}>
							{ sectionList.map((item, index) => (
								<Option key={index} value={item.id} >{item.section}</Option>
							))}
						</Select>
					</div>
				</div>
					}
				<div className="table-responsive">
					<Table
						size="small"
						columns={tableColumns} 
						dataSource={list}
						rowKey='id' 
						bordered
						loading={loading}
					/>
				</div>
			</Card>
		</>
	)
}

export default StudentsTable
