import { sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

import { defaultThresholds } from '../config/thresholds.js';
import { defaultOptions } from '../config/options.js';
import { getBookingIds, getBookingById } from '../utils/api/booking.js';

// ── Options ──────────────────────────────────────────────────────────────────
export const options = {
  stages: [
    { duration: '1m', target: 10 }, // ramp up
    { duration: '3m', target: 10 }, // stable
    { duration: '1m', target: 0 },  // ramp down
  ],
  thresholds: defaultThresholds,
};

// ── Main Flow ─────────────────────────────────────────────────────────────────
export default function () {
  // Step 1: ambil semua booking ID
  const bookings = getBookingIds();

  // Step 2: ambil detail dari salah satu ID
  if (bookings && bookings.length > 0) {
    const bookingId = bookings[0].bookingid;
    const detail = getBookingById(bookingId);
    console.log(detail);
  }

  sleep(1);
}

// ── Report ────────────────────────────────────────────────────────────────────
export function handleSummary(data) {
  return {
    'reports/load-test-report.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}