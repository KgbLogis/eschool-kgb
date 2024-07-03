import React, { useState, useEffect } from 'react'
import { Modal, message, Button } from 'antd';
import { DeleteTwoTone, EditTwoTone, EyeTwoTone } from '@ant-design/icons';
import utils from 'utils';
import MarkBoardForm from './form';
import { useLazyQuery, useMutation } from '@apollo/client';
import { ALL_MARK_BOARD, DELETE_MARK_BOARD } from 'graphql/mark'
import moment from 'moment';
import IntlMessage from 'components/util-components/IntlMessage';
import { useHistory } from 'react-router-dom';
import { APP_PREFIX_PATH } from 'configs/AppConfig';
import AsyncTable from 'components/shared-components/AsyncTable';

function  MarkBoardTable (props) {

	const [list, setList] = useState([]);
    const [count, setCount] = useState(1);

	const [fetchData, { loading, refetch }] = useLazyQuery(ALL_MARK_BOARD, {
        fetchPolicy: 'network-only',
        onCompleted: data => {
            setCount(data.count.count);
            setList(data.allMarkBoards);
        }
    });

    const history = useHistory();

    useEffect(() => {
		// function fillList(){
		// 	const newData = markBoardData.allMarkBoards.map((data) => ({
		// 		id: data.id,
		// 		schoolyear: data.schoolyear.schoolyear,
		// 		schoolyearID: data.schoolyear.id,
		// 		subject: data.subject.subject,
		// 		subjectID: data.subject.id,
		// 		teacher: data.teacher.name,
		// 		teacherID: data.teacher.id,
		// 		startAt: moment(data.startAt).format("YYYY-MM-DD HH:mm:ss"),
		// 		endAt: moment(data.endAt).format("YYYY-MM-DD HH:mm:ss"),
		// 		status: data.status,
		// 		createdAt: data.createdAt,
		// 		updatedAt: data.updatedAt
		// 	}))
        //     setList(newData);
		// 	setReFill(false);
		// 	setTableLoading(false);
		// }
        fetchData({ variables: { offset: 0, limit: 10, filter: "" } })
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

	const [deleteBoard] = useMutation(DELETE_MARK_BOARD, {
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
			deleteBoard({ variables: { id: row.id} }); 
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
			key: 'subject',
			title: <IntlMessage id="subject" />,
			dataIndex: ['subject', 'subject'],
			sorter: (a, b) => utils.antdTableSorter(a, b, 'subject')
		},
		{
			key: 'teacher',
			title: <IntlMessage id="teacher" />,
			dataIndex: ['teacher', 'name'],
			sorter: (a, b) => utils.antdTableSorter(a, b, 'teacher')
		},
		{
			title: <IntlMessage id="start_end_date" />,
            children: [
                {
                    key: 'startAt',
                    title: <IntlMessage id="startAt" />,
                    dataIndex: 'startAt',
                    render: (text) => (
                        moment(text).format("YYYY-MM-DD")
                    ),
                    sorter: (a, b) => utils.antdTableSorter(a, b, 'startAt')
                },
                {
                    key: 'endAt',
                    title: <IntlMessage id="endAt" />,
                    dataIndex: 'endAt',
                    render: (text) => (
                        moment(text).format("YYYY-MM-DD")
                    ),
                    sorter: (a, b) => utils.antdTableSorter(a, b, 'endAt')
                },
            ]
		},
		{
			key: 'actions',
			title: <IntlMessage id="main.action" />,
			width: `20vw`,
			dataIndex: 'actions',
			render: (_, elm) => (
				<div className="text-center">
                    <Button size="small" type='text' key="0" onClick={() => history.push({pathname: APP_PREFIX_PATH+'/mark', state: {markBoard: elm}})}>
                        <EyeTwoTone />
                        <span className="ml-2"> <IntlMessage id="show" /></span>
                    </Button>
					{ props.permissions.edit === true &&
						<Button size="small" type='text' key="2" onClick={() => editRow(elm)}>
							<EditTwoTone twoToneColor="#ffdb00"/>
							<span className="ml-2"> <IntlMessage id="edit" /></span>
						</Button>
					}
					{ props.permissions.destroy === true &&
						<Button size="small" type='text' key="3" onClick={() => deleteRow(elm)}>
							<DeleteTwoTone twoToneColor="#f42f2f"/>
							<span className="ml-2"> <IntlMessage id="delete" /></span>
						</Button>
					}
				</div>
			)
		}
	];

	return (
		<>
			<Modal 
                title={formType === 'create'  ? <IntlMessage id="add_new" /> : <IntlMessage id="edit" /> }
                visible={isModalVisible} 
				okText={<IntlMessage id="main.okText" />}
				cancelText={<IntlMessage id="main.cancelText" />}
				width={'80vw'}
				onCancel={handleCancel}
				okButtonProps={{form:'MarkBoardForm', key: 'submit', htmlType: 'submit'}}
            >
                <MarkBoardForm 
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

export default MarkBoardTable
