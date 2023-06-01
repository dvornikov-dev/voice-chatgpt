import { registerAs } from '@nestjs/config';

export default registerAs('openai', () => ({
  apiKey: process.env.OPENAI_API_KEY,
  apiUrl: process.env.OPENAI_API_URL,
}));
