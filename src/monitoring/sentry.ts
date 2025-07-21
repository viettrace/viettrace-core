// Import with `const Sentry = require("@sentry/nestjs");` if you are using CJS
import Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { NODE_ENV } from '@src/shared/constants/node-env.constant';
import { ObjUtils } from '@src/shared/utils/obj';

const getSampleRate = () => {
  if (process.env.NODE_ENV === NODE_ENV.DEVELOPMENT) {
    return 1.0; // 100% for debugging
  }

  // Production - depends on traffic
  const dailyTraffic = +(process.env.DAILY_TRAFFIC || 10000);

  if (dailyTraffic > 100000) {
    return 0.05; // 5% for high traffic
  }

  if (dailyTraffic > 10000) {
    return 0.1; // 10% for medium traffic
  }

  return 1.0; // 100% for low traffic
};

const getProfileRate = () => {
  if (process.env.NODE_ENV === NODE_ENV.DEVELOPMENT) {
    return 1.0; // 100% for debugging
  }

  return 0.1;
};

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Meaning: Enable profiling integration for Node.js
  // Function: Collect detailed information about application performance such as CPU usage, memory usage, call stack
  // Benefits: Helps detect bottlenecks, memory leaks, and other performance issues
  // Note: Only works when profilesSampleRate > 0
  integrations: [nodeProfilingIntegration()],

  // Meaning: Send personally identifiable information (PII) by default
  // Includes:
  // - User's IP address
  // - User agent from request headers
  // - Cookies (if any)
  // - Username (if set)
  // Warning: Consider GDPR and privacy compliance
  // Recommendation: Set to false in production if high security is required
  sendDefaultPii: false,

  // Meaning: Sampling rate for performance monitoring
  // Value:
  // - 1.0 = 100% of transactions are tracked
  // - 0.1 = 10% of transactions are tracked
  // - 0 = Performance monitoring is disabled
  // Production recommendation: 0.1 or lower to reduce overhead and costs
  tracesSampleRate: getSampleRate(),

  // Meaning: Sampling rate for profiling (relative to tracesSampleRate)
  // Calculation method: profilesSampleRate × tracesSampleRate = actual ratio
  // Example:
  // - tracesSampleRate: 0.1, profilesSampleRate: 1.0 → 10% profiles
  // - tracesSampleRate: 1.0, profilesSampleRate: 0.5 → 50% profiles
  // Production recommendation: 0.1 to 0.5
  profilesSampleRate: getProfileRate(),

  environment: process.env.NODE_ENV,

  // Filter sensitive data
  beforeSend(event) {
    if (
      event.request?.data &&
      ObjUtils.isPlainObject(event.request.data) &&
      'password' in event.request.data
    ) {
      delete event.request.data.password;
    }

    return event;
  },
});
