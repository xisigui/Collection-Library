import { spawn } from "node:child_process";
import { setTimeout } from "node:timers/promises";
import electron from "electron";

const deadline = Date.now() + 30_000;
let ready = false;
while (Date.now() < deadline) {
  try {
    const response = await fetch("http://localhost:5123/", { signal: AbortSignal.timeout(1_000) });
    if (response.ok) {
      ready = true;
      break;
    }
  } catch {
    // Vite and this script start concurrently.
  }
  await setTimeout(250);
}

if (!ready) throw new Error("Vite did not become ready at http://localhost:5123 within 30 seconds.");

const child = spawn(electron, ["."], { stdio: "inherit" });
child.on("error", (error) => { console.error(error); process.exitCode = 1; });
child.on("exit", (code) => { process.exitCode = code ?? 1; });
process.on("SIGINT", () => child.kill());
process.on("SIGTERM", () => child.kill());
