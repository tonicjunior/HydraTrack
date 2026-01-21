const { app, BrowserWindow, ipcMain, Tray, Menu } = require("electron");
const path = require("path");

let splashWindow;
let mainWindow;
let tray = null;
let isQuitting = false;

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
    icon: path.join(__dirname, "favicon.ico"),
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

    setTimeout(() => {
      fadeInMainWindow();
      fadeOutSplash();
    }, 2800);
  });

  /* ============================= */
  /* INTERCEPTA FECHAR (✕)         */
  /* ============================= */

  mainWindow.on("close", (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
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

  mainWindow.webContents.on("render-process-gone", (_, details) => {
    console.error("❌ Renderer crashed:", details);
    app.quit();
  });

  createTray();
}

/* ============================= */
/* TRAY (BANDEJA DO SISTEMA)      */
/* ============================= */

function createTray() {
  tray = new Tray(path.join(__dirname, "favicon.ico"));

  const menu = Menu.buildFromTemplate([
    {
      label: "Abrir HydraTrack",
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      },
    },
    { type: "separator" },
    {
      label: "Fechar HydraTrack",
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip("HydraTrack - Lembrete de Hidratação");
  tray.setContextMenu(menu);

  tray.on("double-click", () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
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
  if (mainWindow) {
    mainWindow.hide();
  }
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
