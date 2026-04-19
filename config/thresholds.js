export const defaultThresholds = {
  // 95% request harus selesai di bawah 500ms
  http_req_duration: ['p(95)<1500'],

  // Error rate tidak boleh lebih dari 1%
  http_req_failed: ['rate<0.01'],
};

// ── Load Test Thresholds ─────────────────────────────────────────────────────
export const loadTestThresholds = {
  http_req_duration: ['p(95)<1500'], // ketat — kondisi normal
  http_req_failed:   ['rate<0.01'],  // error rate max 1%
};

// ── Stress Test Thresholds ───────────────────────────────────────────────────
export const stressTestThresholds = {
  http_req_duration: ['p(95)<3000'], // lebih longgar — sistem sedang ditekan
  http_req_failed:   ['rate<0.05'],  // toleransi error 5%
};

// ── Soak Test Thresholds ─────────────────────────────────────────────────────
export const soakTestThresholds = {
  http_req_duration: ['p(95)<1500'], // sama dengan load test
  http_req_failed:   ['rate<0.01'],  // error rate tetap ketat
};

// ── Spike Test Thresholds ────────────────────────────────────────────────────
export const spikeTestThresholds = {
  http_req_duration: ['p(95)<2000'], // toleransi lebih tinggi saat spike
  http_req_failed:   ['rate<0.10'],  // toleransi error 10% — spike memang brutal
};