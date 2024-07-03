const dev = {
	API_ENDPOINT_URL: 'http://localhost:8000/graphql',
	SERVER_ENDPOINT_URL: 'http://localhost:8000/media/'
};

const prod = {
	API_ENDPOINT_URL: 'http://103.50.205.111/:8001/graphql',
	SERVER_ENDPOINT_URL: 'http://103.50.205.111/:8001/media/'
};

const test = {
	API_ENDPOINT_URL: 'http://66.181.175.235:8001/graphql',
	SERVER_ENDPOINT_URL: 'http://66.181.175.235:8001/media/'
};

const getEnv = () => {
	switch (process.env.NODE_ENV) {
		case 'development':
			return dev
		case 'production':
			return prod
		case 'test':
			return test
		default:
			break;
	}
}

export const env = getEnv()