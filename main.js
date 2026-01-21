const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let splashWindow;
let mainWindow;

let splashReady = false;
let mainReady = false;

function tryCloseSplash() {
  if (splashReady && mainReady) {
    splashWindow.close();
    mainWindow.show();
  }
}

function createWindow() {
  splashWindow = new BrowserWindow({
    fullscreen: true, 
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    transparent: true,
  });

  splashWindow.loadFile("splash.html");


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


  setTimeout(() => {
    splashReady = true;
    tryCloseSplash();
  }, 3500);

 
mainWindow.webContents.on("did-finish-load", () => {
  mainWindow.setOpacity(0);
  mainWindow.show();
  setTimeout(() => {
    fadeInMainWindow();
    fadeOutSplash();
  }, 50);
});

  mainWindow.on("enter-full-screen", sendWindowState);
  mainWindow.on("leave-full-screen", sendWindowState);
  mainWindow.on("maximize", sendWindowState);
  mainWindow.on("unmaximize", sendWindowState);
}



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
      opacity = 1;
      clearInterval(interval);
    }
    mainWindow.setOpacity(opacity);
  }, 16); // ~60fps
}

function fadeOutSplash() {
  let opacity = 1;
  const step = 0.08;

  const interval = setInterval(() => {
    opacity -= step;
    if (opacity <= 0) {
      clearInterval(interval);
      splashWindow.close();
    } else {
      splashWindow.setOpacity(opacity);
    }
  }, 16);
}


app.whenReady().then(createWindow);
