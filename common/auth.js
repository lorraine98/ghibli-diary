import {login} from '../api/auth.js';

const ACCESS_TOKEN_KEY = 'accessToken';

let cachedAccessToken = '';

const getOrLoadAccessToken = () => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY) ?? '';
  return accessToken;
};

const saveAccessToken = accessToken => {
	localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
};

const initAccessToken = async () => {
	const loadedAccessToken = getOrLoadAccessToken();
	
	const result = await login({accessToken: loadedAccessToken})
	
	if(!result.ok) {
		return;
	}

	const newAccessToken = result.data.accessToken;
	saveAccessToken(newAccessToken);
};

document.addEventListener("DOMContentLoaded", initAccessToken);

