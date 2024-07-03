const dev = {
};

const prod = {
};

const test = {
};

const getServer = () => {
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

export const server = getServer()