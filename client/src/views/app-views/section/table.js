import React, { useEffect, useState } from 'react'
import { Card, Table, Input, Modal, message, Button } from 'antd';
import { DeleteTwoTone, SearchOutlined, EditTwoTone, PlusCircleOutlined, RollbackOutlined } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex'
import utils from 'utils'
import SectionForm from './form'
import { useMutation, useQuery } from '@apollo/client';
import { DELETE_SECTION } from 'graphql/delete';
import { SECTION_BY_CLASSES } from 'graphql/all';
import IntlMessage from 'components/util-components/IntlMessage';
import { useHistory } from 'react-router-dom';

function  SectionTable (props) {

    const history = useHistory();

	const [list, setList] = useState([])

    const { loading, data } = useQuery(SECTION_BY_CLASSES, {
        variables: { classes: props.classes.id },
    })

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editData, setEditData] = useState([]);
	const [formType, setFormType] = useState([]);

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

    useEffect(() => {
        if (loading === false && data) {
            setList(data.sectionsByClasses)
        }
    }, [data, loading])
    

	const { confirm } = Modal;

	const [deleteSection] = useMutation(DELETE_SECTION, {
		refetchQueries: [
            {
                query: SECTION_BY_CLASSES,
                variables: { classes:  props.classes.id}
            }
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
			deleteSection({ variables: { id: row.id } }); 
		  },
		});
	}

	const tableColumns = [
		{
			key: 'section',
			title: <IntlMessage id="section" />,
			dataIndex: 'section',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'section')
		},
		{
			key: 'school',
			title: <IntlMessage id="school" />,
			dataIndex: ['school', 'name'],
			sorter: (a, b) => utils.antdTableSorter(a, b, 'school')
		},
		{
			key: 'program',
			title: <IntlMessage id='program' />,
			dataIndex: ['program', 'program'],
			sorter: (a, b) => utils.antdTableSorter(a, b, 'program')
		},
		{
			key: 'classes',
			title: <IntlMessage id='classes' />,
			dataIndex: ['classes', 'classes'],
			sorter: (a, b) => utils.antdTableSorter(a, b, 'classes')
		},
		{
			key: 'maxStudentNum',
            title: <IntlMessage id="maxStudentNum" />,
            dataIndex: 'maxStudentNum', 
            responsive: ['lg'],
			sorter: (a, b) => utils.antdTableSorter(a, b, 'maxStudentNum'),
			// render: text => <span>{nf.format(text)}</span>
		},
		{
			key: 'teacher',
			title: <IntlMessage id="teacher" />,
			dataIndex: ['teacher', 'name'], 
			sorter: (a, b) => utils.antdTableSorter(a, b, 'teacher')
		},
		// {
		// 	key: 'sectionTeacher',
		// 	title: <IntlMessage id="sectionTeacher" />,
		// 	dataIndex: ['sectionTeacher', 'name'], 
		// 	sorter: (a, b) => utils.antdTableSorter(a, b, 'sectionTeacher')
		// },
	];

	if (props.permissions.edit === true || props.permissions.destroy === true) {
		tableColumns.push(
			{
				key: 'actions',
				title: <IntlMessage id='main.action' />,
				width: '15vw',
				dataIndex: 'actions',
				render: (_, elm) => (
					<div className="text-center">
						{ props.permissions.edit === true &&
							<Button size="small" onClick={() => editRow(elm)} type="text" icon={<EditTwoTone twoToneColor="#ffdb00"/>} > <IntlMessage id='edit' /></Button>
						}
						{ props.permissions.destroy === true &&
							<Button size="small" onClick={() => deleteRow(elm)} type="text" icon={<DeleteTwoTone twoToneColor="#f42f2f"/>} > <IntlMessage id='delete' /></Button>
						}
					</div>
				)
			}
		)
	}

	const onSearch = e => {
		const value = e.currentTarget.value
		const searchArray = list
		const datas = utils.wildCardSearch(searchArray, value)
		setList(datas)
	}

	return (
		<>
			<Modal 
                title= {formType === 'create' ? <IntlMessage id="add_new" />  : <IntlMessage id="edit" />}
                visible={isModalVisible}
				okText={<IntlMessage id="main.okText" />}
				cancelText={<IntlMessage id="main.cancelText" />}
				onCancel={handleCancel}
				okButtonProps={{form:'SectionForm', key: 'submit', htmlType: 'submit'}}
            >
                <SectionForm
					formType={formType} 
					editData={editData} 
					setIsModalVisible={setIsModalVisible} 
                    classData={{ 
                        school: props.classes.school.id,
                        program: props.classes.program.id,
                        classes: props.classes.id
                    }}
                    classes={props.classes}
				/>
            </Modal>
            <Flex alignItems="center" justifyContent="between" mobileFlex={false}>
                <Flex mobileFlex={false}>
                    <div className='text-right' >
                        <Button onClick={() => history.goBack()} type="default" icon={<RollbackOutlined />} block> <IntlMessage id="back" /></Button>
                    </div>
                </Flex>
            </Flex>
			<Card className='mt-4'>
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
                        loading={loading}
						bordered
					/>
				</div>
			</Card>
		</>
		
	)
}

export default SectionTable
