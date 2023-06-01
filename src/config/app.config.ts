import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV,
  name: process.env.APP_NAME,
  host: process.env.APP_IP,
  port: process.env.APP_PORT,
  logLevel: process.env.LOG_LEVEL,
}));
