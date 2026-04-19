export const BASE_URL = 'https://restful-booker.herokuapp.com';

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

export const defaultOptions = {
  vus: 10,
  duration: '30s',
};

export function AUTH_HEADERS(token) {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Cookie': `token=${token}`,
  };
};

// ── Load Test — Ramping VUs ──────────────────────────────────────────────────
export const loadTestOptions = {
  executor: 'ramping-vus',
  stages: [
    { duration: '2m', target: 16 },
    { duration: '6m', target: 16 },
    { duration: '2m', target: 0  },
  ],
  gracefulRampDown: '30s',
};

// ── Stress Test — Ramping VUs ────────────────────────────────────────────────
export const stressTestOptions = {
  executor: 'ramping-vus',
  stages: [
    { duration: '2m', target: 16  },
    { duration: '3m', target: 32  },
    { duration: '3m', target: 64  },
    { duration: '3m', target: 100 },
    { duration: '2m', target: 0   },
  ],
  gracefulRampDown: '30s',
};

// ── Soak Test — Ramping VUs ──────────────────────────────────────────────────
export const soakTestOptions = {
  executor: 'ramping-vus',
  stages: [
    { duration: '5m',  target: 16 },
    { duration: '50m', target: 16 },
    { duration: '5m',  target: 0  },
  ],
  gracefulRampDown: '30s',
};

// ── Spike Test — Ramping VUs ─────────────────────────────────────────────────
export const spikeTestOptions = {
  executor: 'ramping-vus',
  stages: [
    { duration: '1m', target: 16  }, // traffic normal
    { duration: '1m', target: 200 }, // spike! lonjakan tiba-tiba
    { duration: '1m', target: 16  }, // turun kembali normal
    { duration: '1m', target: 0   }, // ramp down
  ],
  gracefulRampDown: '30s',
};