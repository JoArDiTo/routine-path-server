export const {
  DATABASE_URL = 'postgres://postgres:1234@localhost:5432/routinepathdb',
  PORT = '4000',
  SALT_ROUNDS = '20',
  TOKEN_SECRET_KEY = 'b1e344c1b74a316e185f5b939728b795fdcc3c72e7555ae1742bfb8f9ee1cf16',
  CORS_ORIGIN = 'http://localhost:3000'
} = process.env; // Default values for local development