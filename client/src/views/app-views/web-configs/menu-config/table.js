import React, { useState, useEffect } from 'react'
import { Card, Table, Input, Menu, Spin, Empty, Modal, Button } from 'antd';
import Icon, { SearchOutlined, EditTwoTone, PlusCircleOutlined } from '@ant-design/icons';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex'
import utils from 'utils'
import ActivityForm from './form'
import { useQuery } from '@apollo/client';
import { ALL_MENUS } from 'graphql/core';
import { svg } from 'configs/MenuIcon';
import IntlMessage from 'components/util-components/IntlMessage';

function  MenuTable (props) {

	const { loading, data } = useQuery(ALL_MENUS);
    
	const [list, setList] = useState(undefined);

    const getIcon = (icon) => {
        const currentIcon = svg.find(({name}) => name === icon);
        return currentIcon.svg
    };

    useEffect(() => {
        if(loading === false && data){
            setList(data?.allMenus);
        }
    }, [loading, data])

	const dropdownMenu = row => (
		<Menu>
			{ props.permissions.edit === true &&
				<Menu.Item key="2" onClick={() => editRow(row)}>
					<Flex alignItems="center">
						<EditTwoTone twoToneColor="#ffdb00"/>
						<span className="ml-2"> <IntlMessage id="edit" /></span>
					</Flex>
				</Menu.Item>
			}
		</Menu>
	);

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

	const tableColumns = [
		{
			key: 'title',
			title: <IntlMessage id="name" />,
			dataIndex: 'title',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'title')
		},
		{
			key: 'icon',
			title: 'Айкон',
			dataIndex: 'icon',
            render: (icon) => (
				<div className="text-center">
                    <Icon component={getIcon(icon)} />
				</div>
			)
		},
		{
			key: 'priority',
			title: 'Дараалал',
            width: '10%',
			dataIndex: 'priority',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'priority')
		},
		{
			key: 'status',
			title: 'Төлөв',
			dataIndex: 'status',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'status')
		},
		{
			key: 'actions',
			title: 'Үйлдэл',
			width: 100,
			dataIndex: 'actions',
			render: (_, elm) => (
				<div className="text-right">
					<EllipsisDropdown menu={dropdownMenu(elm)}/>
				</div>
			)
		}
	];

    

	const onSearch = e => {
		const value = e.currentTarget.value
		const searchArray = e.currentTarget.value? list : data?.allDegrees
		const datas = utils.wildCardSearch(searchArray, value)
		setList(datas)
	}

	return (
		<>
			<Modal
                visible={isModalVisible} 
				okText={<IntlMessage id="main.okText" />}
				cancelText={<IntlMessage id="main.cancelText" />}
                width={'80vw'}
				onCancel={handleCancel}
				okButtonProps={{form:'ActivityForm', key: 'submit', htmlType: 'submit'}}
            >
                <ActivityForm editData={editData} formType={formType} setIsModalVisible={setIsModalVisible} />
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
							emptyText: loading ? <Spin /> : <Empty />
						}}
					/>
				</div>
			</Card>
		</>
		
	)
}

export default MenuTable
