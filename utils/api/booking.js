import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, DEFAULT_HEADERS } from '../../config/options.js';

// GET /booking — ambil semua booking ID
export function getBookingIds() {
  const res = http.get(`${BASE_URL}/booking`, {
    headers: DEFAULT_HEADERS,
  });

  check(res, {
    'getBookingIds - status 200': (r) => r.status === 200,
    'getBookingIds - has data': (r) => r.json().length > 0,
  });

  return res.json();
}

// GET /booking/:id — ambil detail satu booking
export function getBookingById(bookingId) {
  const res = http.get(`${BASE_URL}/booking/${bookingId}`, {
    headers: DEFAULT_HEADERS,
  });

  check(res, {
    'getBookingById - status 200': (r) => r.status === 200,
    'getBookingById - has firstname': (r) => r.json('firstname') !== null,
    'getBookingById - has lastname': (r) => r.json('lastname') !== null,
  });

  return res.json();
}