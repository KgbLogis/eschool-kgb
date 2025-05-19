import { SIDE_NAV_LIGHT, NAV_TYPE_SIDE, DIR_LTR } from 'constants/ThemeConstant';
import { env } from './EnvironmentConfig';

export const APP_NAME = 'KGB';
export const API_BASE_URL = env.API_ENDPOINT_URL;
export const  BASE_SERVER_URL = env.SERVER_ENDPOINT_URL;
export const MEETING_DOMAIN = env.MEETING_DOMAIN;
export const APP_PREFIX_PATH = '/app';
export const AUTH_PREFIX_PATH = '/auth';
export const REPORT_PREFIX_PATH = '/report';

const locale = localStorage.getItem('locale');

export const THEME_CONFIG = {
	navCollapsed: false,
	sideNavTheme: SIDE_NAV_LIGHT,
	locale: locale ? locale : localStorage.setItem('locale', 'mn'),
	navType: NAV_TYPE_SIDE,
	topNavColor: '#3e82f7',
	headerNavColor: '#3c8dbc',
	mobileNav: false,
	currentTheme: 'light',
	direction: DIR_LTR
};
