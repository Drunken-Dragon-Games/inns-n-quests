
import { DenonConfig } from "https://deno.land/x/denon@2.5.0/mod.ts";

const config: DenonConfig = {
  scripts: {
    start: {
      cmd: "deno run app.ts",
      desc: "run my app.ts file",
    },
  },
  "logger": {
    // Clear screen after every restart.
    "fullscreen": false,
    // Output only errors
    "quiet": false,
    // Output debug messages
    "debug": false
  }
};

export default config;