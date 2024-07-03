import React, { useState } from 'react';
import { Button, Card, Input, Pagination, Table } from 'antd'
import { PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import IntlMessage from 'components/util-components/IntlMessage';
import Flex from '../Flex';

const AsyncTable = ({ fetchData, loading, columns, data, permissions, showModal }) => {

    const [filter, setFilter] = useState('');

    const triggerFetch = (page, pageSize) => {
        var start = 0;
        var end = pageSize;
        if (page !== 1) {
            start = (page * pageSize) - pageSize
            end = pageSize * page
        }
        fetchData({ variables: { offset: start, limit: end, filter: filter, program: 0 } })
    }

    const onPageChange = (page, pageSize) => {
        triggerFetch(page, pageSize);
    }

    const onSearch = e => {
        const value = e.currentTarget.value
        fetchData({ variables: { offset: 0, limit: 10, filter: value, program: 0 } })
        setFilter(value)
    }

    return (
		<Card>
            <Flex alignItems="center" justifyContent="between" mobileFlex={false}>
                <Flex className="mb-1" mobileFlex={false}>
                    <div className="mr-md-3 mb-3">
                        <Input placeholder={'Хайх'} prefix={<SearchOutlined />} onChange={e => onSearch(e)}/>
                    </div>
                </Flex>
                { permissions.create === true &&
                    <div className="mr-md-3 mb-3">
                        <Button onClick={showModal} type="primary" icon={<PlusCircleOutlined />} block> <IntlMessage id="add_new" /></Button>
                    </div>
                }
            </Flex>
            <div className="table-responsive">
                <Table 
                    // pagination={false}
                    size="small"
                    columns={columns} 
                    dataSource={data}
                    rowKey='id' 
                    bordered
                    loading={loading}
                />
                {/* <Pagination 
                    className='text-right mt-4' 
                    total={count} 
                    onChange={onPageChange}
                /> */}
            </div>
        </Card>    
    )
}

export default AsyncTable