import React, { useContext, useEffect, useState } from 'react';
import { Button, Form, Input, Alert, message } from "antd";
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import {
	AUTH_TOKEN,
} from 'redux/constants/Auth';
import { useHistory } from "react-router-dom";
import { motion } from "framer-motion"
import { gql, useMutation } from '@apollo/client';
import IntlMessage from 'components/util-components/IntlMessage';
import { UserContext } from 'hooks/UserContextProvider';

const LOG_IN = gql`
    mutation tokenAuth($username: String!, $password: String!){
        tokenAuth(username: $username, password: $password) {
			success,
			errors,
			unarchiving,
			token,
			# refreshToken,
			unarchiving,
			user {
				id,
				firstName,
				lastName,
				username,
			}
        }
    }
`;

export const LoginForm = props => {
	let history = useHistory();

	const { user, refetch } = useContext(UserContext);
	const token = localStorage.getItem(AUTH_TOKEN);
	const [showMessage, setShowMessage] = useState(false)

	function hideAuthMessage() {
		setShowMessage(false)
	}

	function showAuthMessage() {
		setShowMessage(true)
	}

	const [onLogin, { loading }] = useMutation(LOG_IN, {
		onCompleted: data => {
			switch (data.tokenAuth.success) {
				case true:
					message.success('Амжилттай нэвтэрлээ!')
					localStorage.setItem(AUTH_TOKEN, data.tokenAuth.token);
					refetch()
					break;
				default:
					showAuthMessage();
					break;
			}
		}
	});

	if(showMessage) {
		setTimeout(() => {
			hideAuthMessage();
		}, 3000);
	}

	useEffect(() => {
		if (token && user) {
			history.push('/app/home')
		}
	}, [user, token])

	return (
		<div>
			<motion.div 
				initial={{ opacity: 0, marginBottom: 0 }} 
				animate={{ 
					opacity: showMessage ? 1 : 0,
					marginBottom: showMessage ? 20 : 0 
				}}> 
				<Alert type="error" showIcon message={<IntlMessage id="login-fail" />}></Alert>
			</motion.div>
			<Form 
				layout="vertical" 
				name="login-form"
				onFinish={e => {
					onLogin({ variables: { username: e.username, password: e.password } });
				}}
			>
				<Form.Item 
					name="username" 
					label={<IntlMessage id="username" />}
					rules={[
						{ 
							required: true,
							message: 'Нэвтрэх нэр оруулна уу',
						}
					]}>
					<Input prefix={<UserOutlined className="text-primary" />}/>
				</Form.Item>
				<Form.Item 
					name="password" 
					label={
						<div>
							<span><IntlMessage id="password" /></span>
						</div>
					} 
					rules={[
						{ 
							required: true,
							message: 'Нууц үг оруулна уу',
						}
					]}
				>
					<Input.Password prefix={<LockOutlined className="text-primary" />}/>
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit" block loading={loading}> <IntlMessage id="main.login" /></Button>
				</Form.Item>
			</Form>
		</div>
	)
}

LoginForm.propTypes = {
	otherSignIn: PropTypes.bool,
	showForgetPassword: PropTypes.bool,
	extra: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.element
	]),
};

LoginForm.defaultProps = {
	otherSignIn: true,
	showForgetPassword: false
};

export default LoginForm
