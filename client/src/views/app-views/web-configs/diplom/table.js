import React, { useState } from 'react'
import { Table, Modal, message, Button } from 'antd';
import { DeleteTwoTone, EditTwoTone, PlusCircleOutlined } from '@ant-design/icons';
import utils from 'utils'
import { useQuery, useMutation } from '@apollo/client';
import { ALL_DIPLOM, DELETE_DIPLOM } from 'graphql/diplom';
import IntlMessage from 'components/util-components/IntlMessage';
import { useHistory } from 'react-router-dom';

function  DegreeTable (props) {

    const history = useHistory();
    
	const [list, setList] = useState([])

	const { confirm } = Modal;

	const [destroy, { loading: loadingDelete }] = useMutation(DELETE_DIPLOM, {
		onCompleted: data => {
            message.success('Амжилттай устлаа');
            refetch();
		}
	});

	const { loading, refetch } = useQuery(ALL_DIPLOM, {
        onCompleted: data => {
            setList(data.allDiploms);
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

    const onEditClick = (values) => {
        history.push({
            pathname: '/app/configs/diplom/edit',
            state: { 
                type: 'update',
                data: values,
            }
        })
    }

	const tableColumns = [
		{
			key: 'name',
			title: <IntlMessage id="name" />,
			dataIndex: 'name',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'name')
		},
		{
			key: 'actions',
			title: <IntlMessage id="main.action" />,
			width: `20vw`,
			dataIndex: 'actions',
			render: (_, elm) => (
				<div className="text-center">
					{ props.permissions.edit === true &&
						<Button size='small' type='text' key="2" onClick={() => onEditClick(elm)}>
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

	return (
		<>
            <div className="text-right">
				<Button 
                    onClick={() => history.push({
                        pathname: '/app/configs/diplom/create',
                        state: { 
                            type: 'create' 
                        }
                    })} 
                    type="primary" 
                    icon={<PlusCircleOutlined />} 
                > <IntlMessage id="add_new" />
                </Button>
			</div>
			<div className="table-responsive mt-4">
				<Table 
					columns={tableColumns} 
					dataSource={list}
					size='small'
					rowKey='id'  
					bordered
                    loading={loading || loadingDelete}
				/>
			</div>
		</>
		
	)
}

export default DegreeTable
