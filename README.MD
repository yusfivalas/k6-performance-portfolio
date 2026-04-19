# 🚀 K6 Performance Testing Portfolio

> A comprehensive performance testing portfolio built with **k6**, targeting the [Restful-Booker](https://restful-booker.herokuapp.com) public API. This project demonstrates real-world performance testing practices including load, stress, spike, and soak testing — structured around realistic user journeys and integrated with a CI/CD pipeline via GitHub Actions.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [User Journeys](#user-journeys)
- [Test Scenarios](#test-scenarios)
- [Configuration](#configuration)
- [How to Run](#how-to-run)
- [CI/CD Pipeline](#cicd-pipeline)
- [Threshold Strategy](#threshold-strategy)
- [Key Findings](#key-findings)
- [Possible Improvements](#possible-improvements)

---

## Overview

This project was built to demonstrate practical performance testing skills using **k6** — a modern, developer-friendly load testing tool. The target system is Restful-Booker, a publicly available hotel booking REST API that supports full CRUD operations including authentication, booking creation, retrieval, update, and deletion.

The testing strategy is designed around **real user behavior** — each test scenario is composed of meaningful user journeys rather than testing individual endpoints in isolation. This approach produces more realistic and actionable performance data.

### Goals

- Validate system stability and response time under normal load conditions
- Identify system breaking points under incremental stress
- Detect performance degradation and memory leaks over extended periods
- Simulate sudden traffic spikes and measure system recovery behavior
- Integrate automated performance testing into a CI/CD pipeline via GitHub Actions

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [k6](https://k6.io) | Load testing engine |
| [k6-reporter](https://github.com/benc-uk/k6-reporter) | HTML report generation |
| JavaScript (ES6) | Test scripting language |
| GitHub Actions | CI/CD pipeline & automation |
| Postman | API exploration & functional verification |
| Node.js & npm | Project management & script runner |
| Prettier | Code formatting |

---

## Project Structure

```
k6-performance-portfolio/
│
├── scripts/
│   ├── load/                           # Load test scenarios
│   │   ├── j1-browsing.js
│   │   ├── j2-create-reservation.js
│   │   ├── j3-modify-reservation.js
│   │   ├── j4-cancel-reservation.js
│   │   └── j5-admin-manage.js
│   ├── stress/                         # Stress test scenarios
│   │   ├── j1-browsing.js
│   │   ├── j2-create-reservation.js
│   │   ├── j3-modify-reservation.js
│   │   └── j4-cancel-reservation.js
│   ├── soak/                           # Soak test scenarios
│   │   ├── j1-browsing.js
│   │   ├── j2-create-reservation.js
│   │   └── j5-admin-manage.js
│   └── spike/                          # Spike test scenarios
│       ├── j1-browsing.js
│       └── j2-create-reservation.js
│
├── config/
│   ├── options.js                      # Executor & stage options per test type
│   └── thresholds.js                   # Threshold definitions per test type
│
├── utils/
│   ├── api/
│   │   ├── auth.js                     # Token authentication handler
│   │   └── booking.js                  # Booking API request functions
│   ├── data/
│   │   └── createBooking.json          # 500 randomized Indonesian test data entries
│   └── helpers.js                      # Shared utility & error logging functions
│
├── reports/                            # Auto-generated HTML reports (git-ignored)
│   ├── stress/
│   ├── soak/
│   └── spike/
│
├── .github/workflows/
│   └── k6-pipeline.yml                 # GitHub Actions CI/CD pipeline
│
├── .gitignore
├── .prettierrc
├── package.json
└── README.md
```

---

## User Journeys

Each test type is broken into **isolated user journeys** that reflect realistic user behavior in a hotel booking system. Rather than hitting endpoints randomly, each journey follows a logical flow that a real user would perform.

| Journey | Flow | Load | Stress | Soak | Spike |
|---|---|:---:|:---:|:---:|:---:|
| **J1 — Browsing** | Get All Bookings → Get Booking by ID | ✅ | ✅ | ✅ | ✅ |
| **J2 — Create Reservation** | Create Booking → Get Booking by ID | ✅ | ✅ | ✅ | ✅ |
| **J3 — Modify Reservation** | Create Booking → Get Booking by ID → Update Booking | ✅ | ✅ | ❌ | ❌ |
| **J4 — Cancel Reservation** | Create Booking → Get Booking by ID → Delete Booking | ✅ | ✅ | ❌ | ❌ |
| **J5 — Admin Manage** | Create Booking → Partial Update Booking | ✅ | ❌ | ✅ | ❌ |

### Design Decisions

**Why journeys vary per test type:**
- **Spike** focuses only on J1 and J2 — the most realistic journeys during sudden traffic bursts (read and create operations)
- **Soak** excludes J3 and J4 — modify and cancel are low-frequency actions in real usage and not the primary concern for long-duration stability testing
- **Stress** excludes J5 — partial update is similar in nature to J3 and would add redundant coverage

**Why write operations always create a fresh booking first (J3, J4, J5):**
Fetching an existing booking ID from `GET /booking` and then updating or deleting it is unreliable under concurrent load — another VU may have already deleted the same resource, causing 404 errors. Creating a fresh booking per iteration ensures each VU operates on its own isolated data, eliminating race conditions entirely.

**Why VU-based executor is used across all test types:**
This project uses `ramping-vus` for all scenarios. VU-based executors are the correct choice for **user journey simulations** — each VU represents a user navigating through a sequence of actions, and pacing naturally reflects real user behavior. Arrival rate-based executors are more appropriate for system-to-system throughput testing (e.g., webhooks, message queues, SLA validation), which is outside the scope of this project.

---

## Test Scenarios

### 🟢 Load Test
Validates system stability and response time under **normal, expected traffic**.

| Parameter | Value |
|---|---|
| Executor | `ramping-vus` |
| Ramp Up | 2 minutes → 16 VUs |
| Stable | 6 minutes @ 16 VUs |
| Ramp Down | 2 minutes → 0 VUs |
| Total Duration | ~10 minutes |
| Journeys | J1, J2, J3, J4, J5 |

---

### 🔴 Stress Test
Identifies the **breaking point** of the system by incrementally pushing load beyond normal capacity.

| Parameter | Value |
|---|---|
| Executor | `ramping-vus` |
| Stage 1 | 2 min → 16 VUs (baseline) |
| Stage 2 | 3 min → 32 VUs (2× normal) |
| Stage 3 | 3 min → 64 VUs (4× normal) |
| Stage 4 | 3 min → 100 VUs (near breaking point) |
| Ramp Down | 2 minutes → 0 VUs |
| Total Duration | ~13 minutes |
| Journeys | J1, J2, J3, J4 |

---

### ⚡ Spike Test
Simulates **sudden, extreme traffic surges** to measure system resilience and recovery behavior.

| Parameter | Value |
|---|---|
| Executor | `ramping-vus` |
| Stage 1 | 1 min → 16 VUs (normal traffic) |
| Stage 2 | 1 min → 200 VUs (spike!) |
| Stage 3 | 1 min → 16 VUs (recovery) |
| Ramp Down | 1 min → 0 VUs |
| Total Duration | ~4 minutes |
| Journeys | J1, J2 |

---

### 🔵 Soak Test
Detects **memory leaks and gradual performance degradation** by sustaining normal load over an extended period.

| Parameter | Value |
|---|---|
| Executor | `ramping-vus` |
| Ramp Up | 5 minutes → 16 VUs |
| Stable | 50 minutes @ 16 VUs |
| Ramp Down | 5 minutes → 0 VUs |
| Total Duration | ~60 minutes |
| Journeys | J1, J2, J5 |

---

## Configuration

### VU Calculation — Little's Law

VU counts were calculated using **Little's Law** rather than arbitrary estimates:

```
VU = RPS × (Avg Response Time + Think Time)
VU = 10 × (0.6s + 1s)
VU = 16 VUs
```

Based on:
- Target throughput: 10 requests per second (estimated normal load)
- Observed average response time from baseline run: ~621ms
- Think time (`sleep`): 1 second per iteration

### Centralized Configuration

All executor options and thresholds are defined once in `config/` and imported by each test script — eliminating duplication and ensuring consistency across all scenarios.

```javascript
// config/options.js
export const loadTestOptions = {
  executor: 'ramping-vus',
  stages: [
    { duration: '2m', target: 16 },
    { duration: '6m', target: 16 },
    { duration: '2m', target: 0  },
  ],
  gracefulRampDown: '30s',
};

// In any test script — import and spread
export const options = {
  scenarios: {
    load_j1: { ...loadTestOptions },
  },
  thresholds: loadTestThresholds,
};
```

### Data-Driven Testing

Test data for booking creation consists of **500 randomized entries** stored in `utils/data/createBooking.json`, featuring Indonesian names, randomized prices (100–2000), stay durations (1–14 days), and 14 additional needs variations. The dataset is loaded using k6's `SharedArray` — ensuring data is loaded **once into shared memory** regardless of VU count, preventing redundant memory allocation.

```javascript
const bookingData = new SharedArray('bookings', function () {
  return JSON.parse(open('../../utils/data/createBooking.json'));
});
```

### URL Grouping

All dynamic endpoints (e.g., `/booking/:id`) are tagged with a `name` metric tag to prevent high-cardinality time series — an issue encountered during stress testing that caused k6 to generate over 100,000 unique time series.

```javascript
tags: { name: 'GET /booking/:id' }
```

---

## How to Run

### Prerequisites

- [k6](https://k6.io/docs/getting-started/installation/) installed
- Node.js & npm installed

### Installation

```bash
git clone https://github.com/yusfivalas/k6-performance-portfolio.git
cd k6-performance-portfolio
npm install
```

### Run by Journey

```bash
# Load Test
npm run load:j1    # J1 — Browsing
npm run load:j2    # J2 — Create Reservation
npm run load:j3    # J3 — Modify Reservation
npm run load:j4    # J4 — Cancel Reservation
npm run load:j5    # J5 — Admin Manage

# Stress Test
npm run stress:j1
npm run stress:j2
npm run stress:j3
npm run stress:j4

# Soak Test
npm run soak:j1
npm run soak:j2
npm run soak:j5

# Spike Test
npm run spike:j1
npm run spike:j2
```

### HTML Report

After each run, an HTML report is automatically generated in the `reports/` directory. Open it in any browser to view detailed metrics, checks, and trends.

---

## CI/CD Pipeline

This project includes a **GitHub Actions pipeline** with manual trigger and test type selection.

### Why Manual Trigger Only

The pipeline uses `workflow_dispatch` exclusively — no push or scheduled triggers. This is an intentional decision to avoid generating unnecessary load on the public Restful-Booker API. Performance tests should be executed deliberately, not on every code push.

### How to Trigger

```
GitHub Repo → Actions → K6 Performance Test → Run workflow → Select test type → Run workflow
```

### Test Type Options

| Option | Jobs Executed |
|---|---|
| `load` | All 5 load test journeys |
| `stress` | All 4 stress test journeys |
| `spike` | 2 spike test journeys |
| `all` | All of the above, sequentially |

### Pipeline Flow

```
[Manual Trigger] → Select: load / stress / spike / all
        ↓
[load-test]   → J1 → J2 → J3 → J4 → J5 → Upload Reports
        ↓
[stress-test] → J1 → J2 → J3 → J4 → Upload Reports
        ↓
[spike-test]  → J1 → J2 → Upload Reports
```

Jobs run **sequentially** (`needs`) to avoid overloading the target server. Each job uses `continue-on-error: true` so all journeys complete even if a threshold is breached, and `if: always()` ensures reports are always uploaded as artifacts.

---

## Threshold Strategy

Thresholds are **data-driven**, derived from baseline measurements rather than arbitrary values.

```
Threshold = P(95) baseline × 1.3 buffer
          = 1128ms × 1.3
          ≈ 1500ms
```

| Test Type | `http_req_duration` | `http_req_failed` | Rationale |
|---|---|---|---|
| **Load** | `p(95) < 1500ms` | `rate < 1%` | Strict — normal conditions should be consistently reliable |
| **Stress** | `p(95) < 3000ms` | `rate < 5%` | Lenient — degradation at high VUs is expected and informative |
| **Soak** | `p(95) < 1500ms` | `rate < 1%` | Same as load — normal load, extended duration |
| **Spike** | `p(95) < 2000ms` | `rate < 10%` | Most lenient — spike conditions are inherently volatile |

> Stress test thresholds are intentionally more lenient — threshold breaches at high VU counts serve as **indicators of the system's degradation boundary** rather than test failures.

---

## Key Findings

### Baseline Observations (Load Test — J2: Create Reservation)

| Metric | Value |
|---|---|
| Average `http_req_duration` | ~621ms |
| Median | ~557ms |
| P(90) | ~924ms |
| P(95) | ~1128ms |
| Max | ~7407ms |
| Error Rate | 0% |
| Total Iterations | 1,080 |

### Notable Observations

- **High P(95) relative to median** — the gap between median (~557ms) and P(95) (~1128ms) indicates occasional slow outliers, likely caused by Heroku free tier cold starts and geographic latency from Indonesia to the US-based server. This informed the decision to set thresholds at 1500ms rather than the standard 500ms target.
- **Zero error rate under normal load** — the system handles defined load reliably with no failed requests across all journeys.
- **High-cardinality time series resolved** — stress testing initially triggered a k6 warning after generating >100,000 unique time series due to dynamic booking IDs being tracked individually in URL metrics. Resolved by applying `name` metric tags to all requests, grouping dynamic paths under a single time series.
- **Token expiry handled per iteration** — authentication token is refreshed per iteration rather than cached in `setup()`, preventing 403 errors caused by session expiry during longer test durations.

---

## Possible Improvements

- **Grafana + InfluxDB** — real-time metrics visualization dashboard during test execution for live monitoring and trend analysis
- **Multi-environment support** — parameterize `BASE_URL` via `-e TARGET_ENV=staging` for seamless targeting of dev/staging/prod environments
- **Breakpoint test** — systematic breaking point discovery before stress test VU configuration, enabling more precise and data-backed stage design
- **Soak test in pipeline** — currently excluded from CI/CD due to 60-minute duration; could be added as a separate scheduled workflow running weekly

---

*Built by [Yusfi Krismon Valas](https://github.com/yusfivalas) · Software Quality Assurance Engineer*
