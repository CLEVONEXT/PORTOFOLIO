const { app, BrowserWindow, shell, nativeTheme } = require("electron");
const path = require("node:path");

const isDev = !app.isPackaged;
const DEV_URL = process.env.ELECTRON_START_URL || "http://localhost:3000";

// Production: Next.js standalone server bundled in extraResources.
const PROD_PORT = process.env.PORT || 3000;
let nextServer = null;

function createWindow() {
  nativeTheme.themeSource = "dark";

  const window = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 720,
    backgroundColor: "#050506",
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  window.once("ready-to-show", () => window.show());

  // Open external links in the default browser instead of a new window.
  window.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http")) shell.openExternal(url);
    return { action: "deny" };
  });

  if (isDev) {
    window.loadURL(DEV_URL);
    window.webContents.openDevTools({ mode: "detach" });
  } else {
    startNextServer()
      .then(() => window.loadURL(`http://localhost:${PROD_PORT}`))
      .catch((error) => {
        console.error("Gagal menjalankan Next.js server:", error);
        window.loadURL(`http://localhost:${PROD_PORT}`);
      });
  }

  return window;
}

/** Boot the bundled Next.js standalone server (production builds only). */
async function startNextServer() {
  if (nextServer) return;
  const serverPath = path.join(process.resourcesPath, "app", "server.js");

  process.env.PORT = String(PROD_PORT);
  process.env.NODE_ENV = "production";

  nextServer = require(serverPath);
  if (typeof nextServer === "function") {
    await nextServer({ port: Number(PROD_PORT), dev: false });
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", () => {
  nextServer = null;
});
