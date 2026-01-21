const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let splashWindow;
let mainWindow;

/* ============================= */
/* SINGLE INSTANCE               */
/* ============================= */

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      if (!mainWindow.isVisible()) mainWindow.show();
      mainWindow.focus();
    }
  });
}

/* ============================= */
/* WINDOW CREATION               */
/* ============================= */

function createWindow() {
  /* SPLASH */
  splashWindow = new BrowserWindow({
    fullscreen: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    transparent: true,
  });

  splashWindow.loadFile("splash.html");

  /* MAIN WINDOW */
  mainWindow = new BrowserWindow({
    fullscreen: true,
    frame: false,
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile("index.html");

  /* ============================= */
  /* TRANSIÇÃO SPLASH → MAIN       */
  /* ============================= */

  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.setOpacity(0);
    mainWindow.show();

    // tempo mínimo do splash (UX)
    setTimeout(() => {
      fadeInMainWindow();
      fadeOutSplash();
    }, 3500);
  });

  /* ============================= */
  /* WINDOW STATE EVENTS           */
  /* ============================= */

  mainWindow.on("enter-full-screen", sendWindowState);
  mainWindow.on("leave-full-screen", sendWindowState);
  mainWindow.on("maximize", sendWindowState);
  mainWindow.on("unmaximize", sendWindowState);

  /* ============================= */
  /* RENDERER CRASH                */
  /* ============================= */

  mainWindow.webContents.on("render-process-gone", (event, details) => {
    console.error("❌ Renderer crashed:", details);
    app.quit();
  });
}

/* ============================= */
/* IPC WINDOW CONTROLS            */
/* ============================= */

ipcMain.on("window-minimize", () => {
  mainWindow.minimize();
});

ipcMain.on("window-maximize", () => {
  if (mainWindow.isFullScreen()) {
    mainWindow.setFullScreen(false);
  } else if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.on("window-close", () => {
  app.quit();
});

/* ============================= */
/* HELPERS                        */
/* ============================= */

function sendWindowState() {
  if (!mainWindow) return;

  mainWindow.webContents.send("window-state", {
    fullscreen: mainWindow.isFullScreen(),
    maximized: mainWindow.isMaximized(),
  });
}

function fadeInMainWindow() {
  let opacity = 0;
  const step = 0.08;

  const interval = setInterval(() => {
    opacity += step;
    if (opacity >= 1) {
      clearInterval(interval);
      opacity = 1;
    }
    mainWindow.setOpacity(opacity);
  }, 16);
}

function fadeOutSplash() {
  if (!splashWindow) return;

  let opacity = 1;
  const step = 0.08;

  const interval = setInterval(() => {
    opacity -= step;
    if (opacity <= 0) {
      clearInterval(interval);
      splashWindow.close();
      splashWindow = null;
    } else {
      splashWindow.setOpacity(opacity);
    }
  }, 16);
}

/* ============================= */
/* FATAL ERRORS (MAIN PROCESS)    */
/* ============================= */

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception (main):", error);
  app.quit();
});

process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Rejection (main):", reason);
  app.quit();
});

/* ============================= */
/* APP READY                      */
/* ============================= */

app.whenReady().then(createWindow);
