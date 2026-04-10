import { sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

import { defaultThresholds } from '../config/thresholds.js';
import { defaultOptions } from '../config/options.js';
// import * as api from '../utils/api/booking.js';
import { createBooking, getBookingById, updateBooking, deleteBooking } from '../utils/api/booking.js';

import { getToken } from '../utils/api/auth.js';

// ── Options ──────────────────────────────────────────────────────────────────
export const options = {
  stages: [
    { duration: '1m', target: 10 }, // ramp up
    { duration: '3m', target: 10 }, // stable
    { duration: '1m', target: 0 },  // ramp down
  ],
  thresholds: defaultThresholds,
  userAgent: 'MyK6UserAgentString/1.0',
};


export function setup() {
  // Step 1: ambil token autentikasi
  const login = getToken();
  console.log(`Obtained token: ${login}`);
  return login;
}

// ── Main Flow ─────────────────────────────────────────────────────────────────
export default function (data) {
  const token = data


  console.log(`Token: ${token}`);
  // Step 1: create Booking

  const booking = createBooking();
  const bookingId = booking.bookingid;

  console.log(`Created booking with ID: ${bookingId}`);
  //Step 2:  Search Booking by ID
  getBookingById(bookingId);

  //Step 3: Update Booking by ID
  updateBooking(bookingId, token);

  //Step 4: Delete Booking by ID
  deleteBooking(bookingId, token);

  sleep(1);
}

// ── Report ────────────────────────────────────────────────────────────────────
export function handleSummary(data) {
  return {
    'reports/load-test-report.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}