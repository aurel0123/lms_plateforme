import Stripe from 'stripe';
import { env } from './env';

export const stripe = new Stripe(env.STRIPE_SECRET_API, {
    apiVersion : "2026-01-28.clover", 
    typescript : true
});
