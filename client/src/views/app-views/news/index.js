import React from 'react'
import { Button } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons';
import News from './news'
import Flex from 'components/shared-components/Flex'
import { CheckPer } from 'hooks/checkPermission'
import IntlMessage from 'components/util-components/IntlMessage';
import { Link } from 'react-router-dom';
import { APP_PREFIX_PATH } from 'configs/AppConfig';

export default function Index() {

    const permissions = {
        create: CheckPer('add_news')
    }

    return (
        <div>
            <Flex alignItems="center" justifyContent="end" mobileFlex={false}>
                {permissions.create === true &&
                    <div className="mr-md-3 mb-3">
                        <Link to={APP_PREFIX_PATH+'/news/create'}>
                            <Button type="primary" icon={<PlusCircleOutlined />} block> <IntlMessage id="add_new" /> </Button>
                        </Link>
                    </div>
                }
            </Flex>
            <News />
        </div>
    )
}
