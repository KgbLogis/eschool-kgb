import React, { useState, useEffect } from 'react'
import { Modal, message, Button } from 'antd';
import { DeleteTwoTone, EditTwoTone } from '@ant-design/icons';
import utils from 'utils'
import ParentForm from './form'
import { useLazyQuery, useMutation } from '@apollo/client';
import { DELETE_PARENT } from 'graphql/delete';
import { ALL_PARENTS } from 'graphql/all';
import IntlMessage from 'components/util-components/IntlMessage';
import AsyncTable from 'components/shared-components/AsyncTable';

function  StudentsTable (props) {

    const [count, setCount] = useState(1);
    
	const [list, setList] = useState([])

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editData, setEditData] = useState([]);
	const [formType, setFormType] = useState("");

	const [fetchData, { loading, refetch }] = useLazyQuery(ALL_PARENTS, {
        fetchPolicy: 'network-only',
        onCompleted: data => {
            setCount(data.count.count);
            setList(data.allParents);
        }
	});

    useEffect(() => {
        fetchData({ variables: { offset: 0, limit: 9, filter: ''} })
    }, [fetchData])

    const showModal = () => {
		setFormType("create");
      	setIsModalVisible(true);
    };

    const handleCancel = () => {
      setIsModalVisible(false);
    };

	const editRow = row => {
		setEditData(row);
		setFormType("edit");
		setIsModalVisible(true);
	};

	const { confirm } = Modal;

	const [deleteStudent] = useMutation(DELETE_PARENT, {
		refetchQueries: [ALL_PARENTS],
		onCompleted: data => {
            message.success('Амжилттай устлаа');
		}
	});

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

	const tableColumns = [
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
			key: 'profession',
			title: <IntlMessage id="profession" />,
			dataIndex: 'profession',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'profession')
		},
		{
			key: 'phone',
			title: <IntlMessage id="phone1" />,
			dataIndex: 'phone',
			width: '10vw',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'phone'),
			render: text => <span>{text.substr(0, 4) + `-` + text.substr(4, 9)}</span>,
		},
		{
            title: <IntlMessage id="student" />,
            children: [
                {
                    key: 'student',
                    title: <IntlMessage id="student" />,
                    dataIndex: 'student',
                    width: '10vw',
                    sorter: (a, b) => utils.antdTableSorter(a, b, 'student'),
                    render: text => <span>{text.familyName} {text.name}</span>,
                },
                {
                    key: 'studentCode',
                    title: <IntlMessage id="studentCode" />,
                    dataIndex: ['student', 'studentCode'],
                    width: '10vw',
                    sorter: (a, b) => utils.antdTableSorter(a, b, 'studentCode'),
                }
            ]
		},
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

	return (
		<>
			<Modal 
                title={ formType === `create` ? <IntlMessage id="add_new" /> : <IntlMessage id="edit" />}
                visible={isModalVisible} 
				width={'80vw'}
				okText={<IntlMessage id="main.okText" />}
				cancelText={<IntlMessage id="main.cancelText" />}
				onCancel={handleCancel}
				okButtonProps={{form:'StudentForm', key: 'submit', htmlType: 'submit'}}
            >
                <ParentForm 
					refetch={refetch}
					formType={formType} 
					editData={editData} 
					setIsModalVisible={setIsModalVisible}
				/>
            </Modal>
			<AsyncTable 
                fetchData={fetchData}
                loading={loading}
                columns={tableColumns}
                data={list}
                count={count}
                permissions={props.permissions}
                showModal={showModal}
           />
		</>
	)
}

export default StudentsTable
