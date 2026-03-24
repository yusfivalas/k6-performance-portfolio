export const defaultThresholds = {
  // 95% request harus selesai di bawah 500ms
  http_req_duration: ['p(95)<1500'],

  // Error rate tidak boleh lebih dari 1%
  http_req_failed: ['rate<0.01'],
};