import axios from "axios";
import { logger } from "../../middleware/logger.js";

const DEFAULT_TIMEOUT_MS = 15000;
const DEFAULT_MAX_RETRIES = 3;
const BASE_BACKOFF_MS = 500;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const isRetryable = (error) => {
  if (!error) return false;
  if (error.code && ["ECONNABORTED", "ETIMEDOUT", "ECONNRESET", "ENOTFOUND", "EAI_AGAIN"].includes(error.code)) {
    return true;
  }
  const status = error.response?.status;
  if (!status) return true;
  return status >= 500 || status === 408 || status === 429;
};

export const createHttpClient = ({ baseURL, timeout = DEFAULT_TIMEOUT_MS, headers = {} } = {}) => {
  const instance = axios.create({ baseURL, timeout, headers });
  return instance;
};

export const requestWithRetry = async (instance, requestConfig, { maxRetries = DEFAULT_MAX_RETRIES, context = "http" } = {}) => {
  let attempt = 0;
  let lastError;
  while (attempt <= maxRetries) {
    try {
      const started = Date.now();
      const response = await instance.request(requestConfig);
      logger.info(`[${context}] ${requestConfig.method?.toUpperCase() || "GET"} ${requestConfig.url} -> ${response.status} (${Date.now() - started}ms)`);
      return response;
    } catch (err) {
      lastError = err;
      const status = err.response?.status;
      const willRetry = attempt < maxRetries && isRetryable(err);
      logger.warn(
        `[${context}] attempt ${attempt + 1}/${maxRetries + 1} failed for ${requestConfig.method?.toUpperCase() || "GET"} ${requestConfig.url}: ${status || err.code || err.message}${willRetry ? " — retrying" : ""}`
      );
      if (!willRetry) break;
      const delay = BASE_BACKOFF_MS * Math.pow(2, attempt) + Math.floor(Math.random() * 200);
      await sleep(delay);
      attempt++;
    }
  }
  throw lastError;
};
