import { sleep, group } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

import { soakTestOptions } from '../../config/options.js';
import { soakTestThresholds } from '../../config/thresholds.js';
import { createBooking, updateBookingPartially } from '../../utils/api/booking.js';
import { getToken } from '../../utils/api/auth.js';

export const options = {
  scenarios: {
    soak_j5_admin_manage: { ...soakTestOptions },
  },
  thresholds: soakTestThresholds,
};

export default function () {
  const token = getToken();

  group('J5: Admin Manage', function () {
    const booking = createBooking();
    if (booking) {
      updateBookingPartially(booking.bookingid, token);
    }
  });

  sleep(1);
}

export function handleSummary(data) {
  return {
    'reports/soak/j5-admin-manage-report.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}