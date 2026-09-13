import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import App from "./App";

export function render(url: string) {
  return new Promise<string>((resolve, reject) => {
    const output = new PassThrough();
    const chunks: Buffer[] = [];
    let didError = false;
    let timeout: ReturnType<typeof setTimeout>;

    output.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    output.on("end", () => {
      clearTimeout(timeout);
      if (didError) {
        reject(new Error(`SSR failed for ${url}`));
        return;
      }
      resolve(Buffer.concat(chunks).toString("utf8"));
    });

    const { pipe, abort } = renderToPipeableStream(<App ssrPath={url} />, {
      onAllReady() {
        pipe(output);
      },
      onShellError(error) {
        clearTimeout(timeout);
        reject(error);
      },
      onError(error) {
        didError = true;
        console.error(`SSR error for ${url}:`, error);
      },
    });

    timeout = setTimeout(abort, 15_000);
  });
}