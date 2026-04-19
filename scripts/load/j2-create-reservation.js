import { sleep, group } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

import { loadTestOptions } from '../../config/options.js';
import { loadTestThresholds } from '../../config/thresholds.js';
import { createBooking, getBookingById } from '../../utils/api/booking.js';

export const options = {
  scenarios: {
    j2_create_reservation: { ...loadTestOptions },
  },
  thresholds: loadTestThresholds,
};

export default function () {
  group('J2: Create Reservation', function () {
    const booking = createBooking();
    if (booking) {
      getBookingById(booking.bookingid);
    }
  });

  sleep(1);
}

export function handleSummary(data) {
  return {
    'reports/load/j2-create-reservation-report.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}