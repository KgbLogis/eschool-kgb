const dev = {
	// API_ENDPOINT_URL: 'https://2424job.com:8000/graphql',
	// SERVER_ENDPOINT_URL: 'https://2424job.com:8000/media/'
	API_ENDPOINT_URL: 'http://localhost:8000/graphql',
	SERVER_ENDPOINT_URL: 'http://localhost:8000/media/',
	MEETING_DOMAIN: 'meet.itgeltugsbayasgalant.mn'
};

const prod = {
	API_ENDPOINT_URL: 'https://2424job.com:8000/graphql',
	SERVER_ENDPOINT_URL: 'https://2424job.com:8000/media/',
	MEETING_DOMAIN: 'meet.itgeltugsbayasgalant.mn'
};

const test = {
	API_ENDPOINT_URL: 'http://66.181.175.235:8001/graphql',
	SERVER_ENDPOINT_URL: 'http://66.181.175.235:8001/media/',
	MEETING_DOMAIN: 'meet.itgeltugsbayasgalant.mn'
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