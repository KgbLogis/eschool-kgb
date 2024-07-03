import React, { useState } from 'react'
import { Card, Table, Input, Descriptions, Row, Col, Image, Space, Button } from 'antd';
import { SearchOutlined, RollbackOutlined } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex'
import utils from 'utils'
import TransferForm from './form';
import IntlMessage from "components/util-components/IntlMessage";
import { BASE_SERVER_URL } from 'configs/AppConfig';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

function  AllSchoolTable ({ data, student }) {
    
	const [list, setList] = useState(data)
    
    const history = useHistory();

	const tableColumns = [
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
			key: 'description',
            title: <IntlMessage id="description" />,
            dataIndex: 'description', 
			sorter: (a, b) => utils.antdTableSorter(a, b, 'description')
		},
        {
			key: 'docDate',
            title: <IntlMessage id="docDate" />,
            dataIndex: 'docDate', 
			sorter: (a, b) => utils.antdTableSorter(a, b, 'docDate'),
            render: text => <span>{moment(text).format('YYYY-MM-DD')}</span>
        },
		{
			key: 'status',
			title: <IntlMessage id="status" />,
			dataIndex: ['status', 'name'],
			sorter: (a, b) => utils.antdTableSorter(a, b, 'status')
		},
	];

	const onSearch = e => {
		const value = e.currentTarget.value
		const searchArray = e.currentTarget.value? list : data
		const datas = utils.wildCardSearch(searchArray, value)
		setList(datas)
	}

	return (
		<>
            <Flex alignItems="center" justifyContent="between" mobileFlex={false}>
                <Flex mobileFlex={false}>
                    <div className='text-right' >
                        <Button onClick={() => history.goBack()} type="default" icon={<RollbackOutlined />} block> <IntlMessage id="back" /></Button>
                    </div>
                </Flex>
            </Flex>
            <Row gutter={[16, 16]} className='mt-4'>
                <Col xs={24} sm={24} md={24} lg={12} xl={12} >
                    <Card
                        title={<IntlMessage id="transfer-student" />}
                    >
                        <TransferForm student={student} />
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12} >
                    <Card
                        title={<IntlMessage id="student-information" />}
                    >
                        <Row>
                            <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                                <Space direction="horizontal" style={{width: '100%', justifyContent: 'center'}}>
                                    <Image preview={false} alt={student.photo} src={BASE_SERVER_URL+student.photo} />
                                </Space>
                            </Col>
                            <Col xs={24} sm={18} md={18} lg={18} xl={18}>
                                <Descriptions layout="vertical" bordered >
                                    <Descriptions.Item label={<IntlMessage id="familyName" />}>
                                        {student.familyName}
                                    </Descriptions.Item>
                                    <Descriptions.Item label={<IntlMessage id="name" />}>
                                        {student.name}
                                    </Descriptions.Item>
                                    <Descriptions.Item label={<IntlMessage id="studentCode" />}>
                                        {student.studentCode}
                                    </Descriptions.Item>
                                </Descriptions>
                            </Col>
                        </Row>
                    </Card>
                    <Card    
                        title={<IntlMessage id="transfer-history" />}
                    >
                        <Flex alignItems="center" justifyContent="between" mobileFlex={false}>
                            <Flex className="mb-1" mobileFlex={false}>
                                <div className="mr-md-3 mb-3">
                                    <Input placeholder={'Хайх'} prefix={<SearchOutlined />} onChange={e => onSearch(e)}/>
                                </div>
                            </Flex>
                        </Flex>
                        <div className="table-responsive">
                            <Table 
                                columns={tableColumns} 
                                pagination={false}
                                size="small"
                                dataSource={list}
                                rowKey='id'  
                                bordered
                            />
                        </div>
                    </Card>
                </Col>
            </Row>
		</>
		
	)
}

export default AllSchoolTable
