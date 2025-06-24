#!/usr/bin/env node

import { VSCodeSettingsServer } from "./server/VSCodeSettingsServer.js";

const server = new VSCodeSettingsServer();
server.start().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
