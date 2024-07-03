import { Empty, Select } from 'antd'
import React from 'react'
import Loading from '../Loading';

const { Option } = Select;

const AsyncSelect = ({ fetchData, loading, data, type, setData }) => {
    
    const onSearch = value => {
        if (value === '') {
            setData([]);
        } else {
            fetchData({ variables: { offset: 0, limit: 99999999, filter: value } });
        }
    }

    return (
        <Select
            showSearch
            filterOption={false}
            notFoundContent={
                loading ? <Loading cover='content' /> 
                : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            }
            onSearch={onSearch}
        >
            { data.map((item, index) => (
                <Option value={item.id} key={index} >{item.subject} </Option>
            ))}
        </Select>
    )
}

export default AsyncSelect