import { registerAs } from '@nestjs/config';

export default registerAs('sentry', () => ({
  env: process.env.SENTRY_ENV,
  dsn: process.env.SENTRY_DSN,
  //   release: process.env.RENDER_GIT_COMMIT,
}));
