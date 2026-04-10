import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, DEFAULT_HEADERS, AUTH_HEADERS } from '../../config/options.js';
import { SharedArray } from 'k6/data';

const bookingData = new SharedArray('bookings', function () {
  return JSON.parse(open('../../utils/data/createBooking.json'));
});

function bookingPayload(data) {
  return JSON.stringify({
    firstname: data.firstname,
    lastname: data.lastname,
    totalprice: data.totalprice,
    depositpaid: data.depositpaid,
    bookingdates: {
      checkin: data.checkin,
      checkout: data.checkout,
    },
    additionalneeds: data.additionalneeds,
  });
}

// GET /booking — ambil semua booking ID
export function getBookingIds() {
  const res = http.get(`${BASE_URL}/booking`, {
    headers: DEFAULT_HEADERS,
  });

  check(res, {
    'getBookingIds - status 200': (r) => r.status === 200,
    'getBookingIds - has data': (r) => r.json().length > 0,
  });


  if (res.status !== 200) {
    console.warn(`getBookingById failed - status: ${res.status}, body: ${res.body}`);
    return null;
  };

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

  if (res.status !== 200) {
    console.warn(`getBookingById failed - status: ${res.status}, body: ${res.body}`);
    return null;
  };

  return res.json();
}

// POST /booking — buat booking baru
export function createBooking() {

  const data = bookingData[Math.floor(Math.random() * bookingData.length)];
  const createBookingPayload = bookingPayload(data);

  const res = http.post(
    `${BASE_URL}/booking`,
    createBookingPayload,
    {
      headers: DEFAULT_HEADERS,
    }
  );

  check(res, {
    'createBooking - status 200': (r) => r.status === 200,
    'createBooking - has bookingid': (r) => r.json('bookingid') !== null,
  });

  if (res.status !== 200) {
    console.warn(`getBookingById failed - status: ${res.status}, body: ${res.body}`);
    return null;
  };

  return res.json();
}

export function updateBooking(bookingId, token) {

  const data = bookingData[Math.floor(Math.random() * bookingData.length)];

  const updateBookingPayload = bookingPayload(data);

  const res = http.put(
    `${BASE_URL}/booking/${bookingId}`,
    updateBookingPayload,
    {
      headers: AUTH_HEADERS(token),
    }
  );

  check(res, {
    'updateBooking - status 200': (r) => r.status === 200,
    'updateBooking - has firstname': (r) => r.json('firstname') === data.firstname,
    'updateBooking - has lastname': (r) => r.json('lastname') === data.lastname,
  });


  if (res.status !== 200) {
    console.warn(`getBookingById failed - status: ${res.status}, body: ${res.body}`);
    return null;
  };

  return res.json();
}

export function deleteBooking(bookingId, token) {
  const res = http.del(
    `${BASE_URL}/booking/${bookingId}`,
    null,
    {
      headers: AUTH_HEADERS(token),
    }
  );

  check(res, {
    'deleteBooking - status 201': (r) => r.status === 201,
  });
  
}

export function updateBookingPartially(bookingId, token) {
  
  const data = bookingData[Math.floor(Math.random() * bookingData.length)];


  const updateBookingPayload = JSON.stringify({
    firstname: data.firstname,
    lastname: data.lastname,
  });

  const res = http.patch(
    `${BASE_URL}/booking/${bookingId}`,
    updateBookingPayload,
    {
      headers: AUTH_HEADERS(token),
    }
  );

  check(res, {
    'updateBookingPartially - status 200': (r) => r.status === 200,
    'updateBookingPartially - has firstname': (r) => r.json('firstname') === data.firstname,
    'updateBookingPartially - has lastname': (r) => r.json('lastname') === data.lastname,
  });


  if (res.status !== 200) {
    console.warn(`getBookingById failed - status: ${res.status}, body: ${res.body}`);
    return null;
  };

  return res.json();
}
