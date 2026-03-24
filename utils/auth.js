import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL } from '../config/options.js';

export function getToken() {
  const res = http.post(
    `${BASE_URL}/auth`,
    JSON.stringify({
      username: 'admin',
      password: 'password123',
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  check(res, {
    'auth - status 200': (r) => r.status === 200,
    'auth - token exists': (r) => r.json('token') !== null,
  });

  return res.json('token');
}