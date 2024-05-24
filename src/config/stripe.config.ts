import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
// stripe.config.ts
config();
const configuration = new ConfigService();
export default {
  stripeSecretKey: configuration.get<string>('STRIPE_SECRET_KEY'),
  stripePublicKey: configuration.get<string>('STRIPE_PUBLIC_KEY'),
};
