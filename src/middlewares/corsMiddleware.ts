import cors from 'cors';
import { CORS_ORIGIN } from '@config/constants.ts';

export const corsMiddleware = (acceptOrigin = CORS_ORIGIN ?? '') => cors({
  origin: (origin, callback) => {
    if (acceptOrigin === origin) return callback(null, true);

    if (!origin) return callback(null, true);
    
    return callback(new Error('CORS policy error'), false);
  }
})
