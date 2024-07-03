import React from 'react'
import { Button, Card, Table } from 'antd'
import { RollbackOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom'
import Flex from 'components/shared-components/Flex'
import IntlMessage from 'components/util-components/IntlMessage';

const PermissionTable = ({ loading, columns, list }) => {

    const history = useHistory();

    return (
        <Card>
            <Flex alignItems="center" justifyContent="between" mobileFlex={false}>
                <Flex mobileFlex={false}>
                    <div className='text-right' >
                        <Button onClick={() => history.goBack()} type="default" icon={<RollbackOutlined />} block> <IntlMessage id="back" /></Button>
                    </div>
                </Flex>
            </Flex>
            <Table
                pagination={false}
                className='mt-4'
                loading={loading}
				size="small"
				columns={columns} 
				dataSource={list}
				rowKey='name'
				bordered
            />
        </Card>
    )
}

export default PermissionTable