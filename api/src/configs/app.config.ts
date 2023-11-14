import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  alertsUrl: process.env.ALERTS_URL,
  pollenUrl: process.env.POLLEN_URL,
  graphhopperUrl: process.env.GRAPHHOPPER_URL,
  logItinerary: process.env.LOG_ITINERARY === 'true',
}));
