import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  alertsUrl: process.env.ALERTS_URL,
  graphhopperUrl: process.env.GRAPHHOPPER_URL,
}));
