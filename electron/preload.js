const { contextBridge } = require("electron");

/**
 * Minimal, safe bridge. Exposes only what the renderer needs to know it is
 * running inside the desktop shell (used for desktop-specific UI affordances).
 */
contextBridge.exposeInMainWorld("clevonext", {
  platform: process.platform,
  isDesktop: true,
  version: process.versions.electron,
});
