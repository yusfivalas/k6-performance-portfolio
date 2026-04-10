export const BASE_URL = 'https://restful-booker.herokuapp.com';

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

export const defaultOptions = {
  vus: 10,
  duration: '30s',
};

export function AUTH_HEADERS(token) {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Cookie': `token=${token}`,
  };
}