import {
  app,
  BrowserWindow,
  Menu,
  shell,
  dialog,
  nativeTheme,
  MenuItem,
} from "electron";
import * as path from "path";
import { readdir, unlink } from "fs";
import { Store } from "./storing";

if (require("electron-squirrel-startup")) {
  app.quit();
}

// TODO: Fix window size on windows
const create_window = async (): Promise<void> => {
  const db = new Store("config", {
    theme: "dark",
    is_default: true,
  });
  const current = await db.get("theme");
  const main_window = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      nodeIntegration: true,
    },
    backgroundColor: current === "dark" ? "#121212" : "#FFF",
  });
  main_window.loadFile(path.join(__dirname, "../src/index.html"));
};

const create_editing_window = async (): Promise<void> => {
  const db = new Store("config", {
    theme: "dark",
    is_default: true,
  });
  const current = await db.get("theme");
  const main_window = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      nodeIntegration: true,
    },
    backgroundColor: current === "dark" ? "#121212" : "#FFF",
  });
  main_window.loadFile(path.join(__dirname, "../src/editing/index.html"));
};

const create_export_window = async (): Promise<void> => {
  const db = new Store("config", {
    theme: "dark",
    is_default: true,
  });
  const current = await db.get("theme");
  const popup = new BrowserWindow({
    height: 150,
    width: 330,
    resizable: process.platform === "darwin" ? false : true,
    webPreferences: {
      nodeIntegration: true,
    },
    backgroundColor: current === "dark" ? "#121212" : "#FFF",
  });
  popup.setMenuBarVisibility(false);
  popup.loadFile(path.join(__dirname, "../src/exporting/index.html"));
};

const create_compile_window = async (): Promise<void> => {
  const db = new Store("config", {
    theme: "dark",
    is_default: true,
  });
  const current = await db.get("theme");
  const popup = new BrowserWindow({
    height: 125,
    width: 330,
    resizable: process.platform === "darwin" ? false : true,
    webPreferences: {
      nodeIntegration: true,
    },
    backgroundColor: current === "dark" ? "#121212" : "#FFF",
  });
  popup.setMenuBarVisibility(false);
  popup.loadFile(path.join(__dirname, "../src/compiling/index.html"));
};

const create_compile_export_window = async (): Promise<void> => {
  const db = new Store("config", {
    theme: "dark",
    is_default: true,
  });
  const current = await db.get("theme");
  const popup = new BrowserWindow({
    height: 150,
    width: 330,
    resizable: process.platform === "darwin" ? false : true,
    webPreferences: {
      nodeIntegration: true,
    },
    backgroundColor: current === "dark" ? "#121212" : "#FFF",
  });
  popup.setMenuBarVisibility(false);
  popup.loadFile(path.join(__dirname, "../src/compiling_to_switch/index.html"));
};

const toggle_theme = async (): Promise<void> => {
  const db = new Store("config", {
    theme: "dark",
    is_default: true,
  });
  const current = await db.get("theme");
  if (current === "light") {
    db.set("theme", "dark");
  } else {
    db.set("theme", "light");
  }
  // Change theme for all open windows
  BrowserWindow.getAllWindows().forEach((win) => {
    win.webContents.executeJavaScript("set_theme(document);");
  });
};

const on_os_theme_update = async (is_dark: boolean): Promise<void> => {
  const db = new Store("config", {
    theme: "dark",
    is_default: true,
  });
  if (is_dark === true) {
    db.set("theme", "dark");
  } else {
    db.set("theme", "light");
  }
  // Change theme for all open windows
  BrowserWindow.getAllWindows().forEach((win) => {
    win.webContents.executeJavaScript("set_theme(document);");
  });
};

const open_backups = async (): Promise<void> => {
  const folder = path.join(app.getPath("userData"), "backups");
  shell.openItem(folder);
};

const clear_backups = async (): Promise<void> => {
  const folder = path.join(app.getPath("userData"), "backups");
  const response = await dialog.showMessageBox(null, {
    title: "Confirm",
    message: "Really delete all script backups? This cannot be undone.",
    type: "warning",
    buttons: ["Cancel", "Delete"],
  });
  if (response.response === 0) {
    return;
  } else {
    readdir(folder, (err, list) => {
      if (err) throw err;

      for (const backup of list) {
        unlink(path.join(folder, backup), (err) => {
          if (err) throw err;
        });
      }
    });
    dialog.showMessageBox({
      title: "Success",
      message: "All backups have been deleted.",
      type: "info",
      buttons: ["OK"],
    });
  }
};

// App events

app.on("ready", create_window);

app.on("window-all-closed", () => {
  app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    create_window();
  }
});

// Menu items
// TODO: Add in-app builtins function list
let template: any = [
  {
    label: "File",
    submenu: [
      {
        click: create_editing_window,
        accelerator: "CmdOrCtrl+E",
        label: "New Script",
      },
      {
        click: create_export_window,
        accelerator: "CmdOrCtrl+Shift+E",
        label: "Export Existing Script",
      },
      { type: "separator" },
      {
        click: create_compile_window,
        accelerator: "CmdOrCtrl+M",
        label: "Compile Script",
      },
      {
        click: create_compile_export_window,
        accelerator: "CmdOrCtrl+Shift+M",
        label: "Compile and Export Script",
      },
      { type: "separator" },
      {
        click: open_backups,
        label: "Open Script Backups",
      },
      {
        click: clear_backups,
        label: "Delete All Script Backups",
      },
    ],
  },
  {
    label: "View",
    submenu: [
      {
        click: toggle_theme,
        label: "Toggle Theme",
      },
      { type: "separator" },
      {
        click: (
          menu_item: MenuItem,
          browser_window: BrowserWindow,
          _event: Event
        ): void => {
          browser_window.webContents.openDevTools();
        },
        accelerator:
          process.platform === "darwin"
            ? "CmdOrCtrl+Option+I"
            : "CmdOrCtrl+Alt+I",
        label: "Open Dev Tools",
      },
    ],
  },
];

if (process.platform === "darwin") {
  template = [
    {
      label: app.name,
      submenu: [
        { role: "about" },
        { type: "separator" },
        { role: "services" },
        { type: "separator" },
        { role: "hide" },
        { role: "hideothers" },
        { role: "unhide" },
        { type: "separator" },
        { role: "quit" },
      ],
    },
  ].concat(template);
}

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

// Theme change handling

nativeTheme.on("updated", () => {
  on_os_theme_update(nativeTheme.shouldUseDarkColors);
});
