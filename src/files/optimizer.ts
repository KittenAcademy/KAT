import setting, { OptimizerConf } from "../settings";
import fetch from "node-fetch";

const conf: OptimizerConf | null | undefined = setting("OptimizerConf");

let lastMillis = 0;

export function shouldOptimize(): boolean {
  const now = Date.now();
  if (!conf) return false;
  if (now < conf.startMillis || now > conf.endMillis) return false;
  if (lastMillis + conf.cooldownMillis > now) return false;
  if (Math.random() > conf.frequency) return false;
  return true;
}

export async function optimize(id: string): Promise<ArrayBuffer | undefined> {
  if (!conf) {
    console.error("No optimizer conf defined");
    return undefined;
  }
  const url = conf.url + id + ".gif";
  lastMillis = Date.now();
  return await fetchWithTimeout(url, conf.deadlineMillis);
}

async function fetchWithTimeout(
  url: string,
  deadlineMillis: number
): Promise<ArrayBuffer | undefined> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    console.error(`Optimizer timeout of ${deadlineMillis} kicked in`);
    controller.abort();
  }, deadlineMillis);
  try {
    console.log(`Optimizer querying ${url}`);
    const response = await fetch(url, {
      signal: controller.signal
    });
    if (response.status != 200) {
      console.error(`Optimizer received ${response.status} response`);
    }
    return response.arrayBuffer();
  } catch (error) {
    console.error("Error while optimizing", error);
  } finally {
    clearTimeout(timeoutId);
  }
}
