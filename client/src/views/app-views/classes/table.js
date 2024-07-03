import React, { useEffect, useState } from 'react'
import { Modal, message, Button } from 'antd';
import { DeleteTwoTone, EditTwoTone, EyeTwoTone } from '@ant-design/icons';
import utils from 'utils'
import SchoolForm from './form'
import { useMutation, useLazyQuery } from '@apollo/client';
import { ALL_CLASSESS } from 'graphql/all'
import { DELETE_CLASS } from 'graphql/delete'
import IntlMessage from "components/util-components/IntlMessage";
import { useHistory } from 'react-router-dom';
import { APP_PREFIX_PATH } from 'configs/AppConfig';
import AsyncTable from 'components/shared-components/AsyncTable';

function  ClassesTable (props) {

    const history = useHistory();
    
	const [list, setList] = useState([])
    const [count, setCount] = useState(1);

	const [fetchData, { loading, refetch }] = useLazyQuery(ALL_CLASSESS, {
		onCompleted: data => {
			setList(data.allClassess);
            setCount(data.count.count);
		}
	});

    useEffect(() => {
        fetchData({ variables: { offset: 0, limit: 9, filter: '', program: 0} })
    }, [fetchData])
    

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

	const [deleteClasses] = useMutation(DELETE_CLASS, {
		refetchQueries: [ALL_CLASSESS],
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
				deleteClasses({ variables: { id: row.id} }); 
			},
		});
	}

	const tableColumns = [
		{
			key: 'classes',
			title: <IntlMessage id="classes" />,
			dataIndex: 'classes',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'classes')
		},
		{
			key: 'school',
            title: <IntlMessage id="school" />,
            dataIndex: ['school', 'name'], 
			sorter: (a, b) => utils.antdTableSorter(a, b, 'school')
		},
		{
			key: 'program',
            title: <IntlMessage id="program" />,
            dataIndex: ['program', 'program'], 
			sorter: (a, b) => utils.antdTableSorter(a, b, 'program')
		},
		{
			key: 'activity',
            title: <IntlMessage id="activity" />,
            dataIndex: ['activity', 'name'], 
            responsive: ['lg'],
			sorter: (a, b) => utils.antdTableSorter(a, b, 'activity')
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
                        { props.permissions.view_section === true &&
                            <Button size="small" onClick={() =>  history.push({pathname: APP_PREFIX_PATH+'/section', state: {message: elm}})} type="text" icon={<EyeTwoTone />} > <IntlMessage id="show2" /></Button>
                        }{ props.permissions.edit === true &&
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
                title={formType === "create" ? <IntlMessage id="add_new" /> : <IntlMessage id="edit" />} 
                visible={isModalVisible} 
				width={'80vw'}
				okText={<IntlMessage id='main.okText' />}
				cancelText={<IntlMessage id='main.cancelText' />}
				onCancel={handleCancel}
				okButtonProps={{form:'SchoolForm', key: 'submit', htmlType: 'submit'}}
            >
                <SchoolForm
                    refetch={refetch}
					editData={editData} 
					formType={formType} 
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

export default ClassesTable
