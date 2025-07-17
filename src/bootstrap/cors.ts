import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const corsConfig = (whiteList: string[] = []): CorsOptions => ({
  origin: (origin, callback) => {
    // Allow all origins in dev
    if (process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      // Whitelist some origins in prod
      if (whiteList.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
});
