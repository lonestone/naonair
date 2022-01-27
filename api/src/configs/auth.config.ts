import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({ passKey: process.env.PASS_KEY }));
