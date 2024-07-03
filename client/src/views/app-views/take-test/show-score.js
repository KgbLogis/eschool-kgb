import React from 'react';
import { Row, Col, Typography  } from 'antd';
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
import IntlMessage from 'components/util-components/IntlMessage';

const { Title } = Typography;

const ShowScore = (props) => {

    return (
        <PageHeaderAlt className="bg-primary" overlap>
			<div className="container text-center">
				<div className="py-lg-4">
					<h1 className="text-white display-4"><IntlMessage id="total-exam-score" /></h1>
					<Row type="flex" justify="center">
						<Col xs={24} sm={24} md={12}>
							<Title className="text-white w-75 text-center mt-2 mb-4 mx-auto">
								{props.location.state.message.finishTest?.score}
							</Title>
						</Col>
					</Row>
				</div>
			</div>
		</PageHeaderAlt>
    )

}

export default ShowScore