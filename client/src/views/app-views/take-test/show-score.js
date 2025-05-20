import React from 'react';
import { RollbackOutlined } from '@ant-design/icons';
import IntlMessage from 'components/util-components/IntlMessage';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { APP_PREFIX_PATH } from 'configs/AppConfig';
import Flex from 'components/shared-components/Flex';

const ShowScore = ({ score }) => {

	return (
		<div className="container text-center">
			<Flex alignItems="center" justifyContent="between" mobileFlex={false}>
				<Flex mobileFlex={false}>
					<div className='text-right' >
						<Link to={`${APP_PREFIX_PATH}/take-test`}>
							<Button type="default" icon={<RollbackOutlined />} block> <IntlMessage id="back" /></Button>
						</Link>
					</div>
				</Flex>
			</Flex>
			<div className="py-lg-4 bg-mkp rounded-4 mt-4">
				<h1 className="text-white display-4"><IntlMessage id="total-exam-score" /></h1>
				<p className="text-white text-center text-2xl mt-2 mb-4 mx-auto">
					{score}
				</p>
			</div>
		</div>
	)

}

export default ShowScore