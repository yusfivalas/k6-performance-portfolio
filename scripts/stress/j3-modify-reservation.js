import { sleep, group } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

import { stressTestOptions } from '../../config/options.js';
import { stressTestThresholds } from '../../config/thresholds.js';
import { createBooking, getBookingById, updateBooking } from '../../utils/api/booking.js';
import { getToken } from '../../utils/api/auth.js';

export const options = {
  scenarios: {
    stress_j3_modify_reservation: { ...stressTestOptions },
  },
  thresholds: stressTestThresholds,
};

export default function () {
  const token = getToken();

  group('J3: Modify Reservation', function () {
    const booking = createBooking();
    if (booking) {
      const bookingId = booking.bookingid;
      getBookingById(bookingId);
      updateBooking(bookingId, token);
    }
  });

  sleep(1);
}

export function handleSummary(data) {
  return {
    'reports/stress/j3-modify-reservation-report.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}