import { MtnMomoAdapter } from "./mtnMomo.js";
import { AirtelMoneyAdapter } from "./airtelMoney.js";

const registry = {
  mtn: new MtnMomoAdapter(),
  airtel: new AirtelMoneyAdapter(),
};

export const getPaymentAdapter = (provider) => {
  const adapter = registry[provider];
  if (!adapter) throw new Error(`Unknown payment provider: ${provider}`);
  return adapter;
};

export const listProviders = () =>
  Object.entries(registry).map(([name, adapter]) => ({
    name,
    configured: adapter.isConfigured(),
  }));
