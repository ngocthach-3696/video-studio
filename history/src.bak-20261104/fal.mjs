import { sleep } from "./util.mjs";

const QUEUE = "https://queue.fal.run";

// Submits a job to fal's queue API and polls until it completes.
// Uses the status/response URLs fal returns: for nested model ids those live
// under the base app id, not the full model path.
export async function falRun(model, input, env, { timeoutMs = 15 * 60_000 } = {}) {
  if (!env.FAL_KEY) {
    const e = new Error("Thiếu FAL_KEY trong history/.env (tạo key tại https://fal.ai/dashboard/keys)");
    e.fatal = true;
    throw e;
  }
  const headers = { Authorization: `Key ${env.FAL_KEY}`, "Content-Type": "application/json" };
  const sub = await fetch(`${QUEUE}/${model}`, { method: "POST", headers, body: JSON.stringify(input) });
  const sj = await sub.json().catch(() => ({}));
  if (!sub.ok) {
    const e = new Error(`fal ${model} HTTP ${sub.status}: ${JSON.stringify(sj.detail ?? sj).slice(0, 600)}`);
    // Bad key, no credit or invalid input won't fix themselves on retry.
    e.fatal = [400, 401, 402, 403, 404, 422].includes(sub.status);
    throw e;
  }
  const statusUrl = sj.status_url ?? `${QUEUE}/${model}/requests/${sj.request_id}/status`;
  const responseUrl = sj.response_url ?? `${QUEUE}/${model}/requests/${sj.request_id}`;

  const t0 = Date.now();
  for (;;) {
    await sleep(3000);
    const st = await fetch(statusUrl, { headers });
    const sj2 = await st.json().catch(() => ({}));
    if (!st.ok) throw new Error(`fal status HTTP ${st.status}: ${JSON.stringify(sj2).slice(0, 300)}`);
    if (sj2.status === "COMPLETED") break;
    if (Date.now() - t0 > timeoutMs) throw new Error(`fal ${model}: quá ${timeoutMs / 60000} phút chưa xong`);
  }
  const r = await fetch(responseUrl, { headers });
  const rj = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`fal ${model} kết quả HTTP ${r.status}: ${JSON.stringify(rj.detail ?? rj).slice(0, 600)}`);
  return rj;
}

export async function download(url) {
  const r = await fetch(url, { signal: AbortSignal.timeout(300_000) });
  if (!r.ok) throw new Error(`Tải ${url} lỗi HTTP ${r.status}`);
  return Buffer.from(await r.arrayBuffer());
}

export const dataUri = (buf, mime = "image/jpeg") => `data:${mime};base64,${buf.toString("base64")}`;
