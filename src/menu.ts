import { app, BrowserWindow, Menu, MenuItem } from "electron";
import { menu_click_handlers } from "./main";
import { Store, store_defaults } from "./storing";

export async function create_menu(): Promise<Menu> {
  let template: any = [
    {
      label: "File",
      submenu: [
        {
          click: menu_click_handlers.create_editing_window(false),
          accelerator: "CmdOrCtrl+E",
          label: "New Script",
        },
        {
          click: menu_click_handlers.editing_open_script(false),
          label: "Open",
          submenu: [
            {
              click: menu_click_handlers.editing_open_script(false),
              accelerator: "CmdOrCtrl+O",
              label: "Open Better Scripts Script...",
            },
            {
              click: menu_click_handlers.editing_open_script(true),
              accelerator: "CmdOrCtrl+Shift+O",
              label: "Open nx-TAS Script...",
            },
          ],
        },
        {
          click: menu_click_handlers.create_export_window,
          accelerator: "CmdOrCtrl+Shift+E",
          label: "Export Existing Script",
        },
        { type: "separator" },
        {
          click: menu_click_handlers.export_active(true),
          accelerator: "CmdOrCtrl+S",
          label: "Save",
          id: "editing_save",
          enabled: false,
        },
        {
          click: menu_click_handlers.export_active(true, true),
          accelerator: "CmdOrCtrl+Shift+S",
          label: "Save As...",
          id: "editing_save_as",
          enabled: false,
        },
        {
          click: menu_click_handlers.export_active(),
          label: "Export As...",
          id: "editing_export_as",
          enabled: true,
          submenu: [
            {
              click: menu_click_handlers.export_active(),
              accelerator: "CmdOrCtrl+Shift+X",
              label: "Export As Better Scripts Script...",
              enabled: false,
              id: "editing_export_as_tig",
            },
            {
              click: menu_click_handlers.export_active(false, false, true),
              accelerator: "CmdOrCtrl+Alt+X",
              label: "Export As nx-TAS Script...",
              enabled: false,
              id: "editing_export_as_nx_tas",
            },
          ],
        },
        { type: "separator" },
        {
          click: menu_click_handlers.create_compile_window,
          accelerator: "CmdOrCtrl+M",
          label: "Compile Script",
        },
        {
          click: menu_click_handlers.create_compile_export_window,
          accelerator: "CmdOrCtrl+Shift+M",
          label: "Compile and Export Script",
        },
        {
          click: menu_click_handlers.create_preprocessor_window,
          accelerator: "CmdOrCtrl+P",
          label: "Preprocess Script",
        },
        {
          click: menu_click_handlers.create_decompile_window,
          accelerator: "CmdOrCtrl+Shift+Z",
          label: "Decompile Script",
        },
        { type: "separator" },
        {
          click: menu_click_handlers.create_js_compile_window,
          accelerator: "CmdOrCtrl+J",
          label: "Compile JavaScript to TAS Script",
        },
        {
          click: menu_click_handlers.create_js_compile_export_window,
          accelerator: "CmdOrCtrl+Shift+J",
          label: "Compile JavaScript to TAS Script and Export",
        },
        { type: "separator" },
        {
          click: menu_click_handlers.open_backups,
          label: "Open Script Backups",
        },
        {
          click: menu_click_handlers.clear_backups,
          label: "Delete All Script Backups",
        },
      ],
    },
    {
      label: "Project",
      submenu: [
        {
          click: menu_click_handlers.request_export_to_switch,
          label: "Export to Switch",
          enabled: false,
          id: "editing_export_to_switch",
          accelerator: "CmdOrCtrl+P",
        },
        { type: "separator" },
        {
          click: menu_click_handlers.request_enter_export_name,
          label: "Enter Export Name on Switch",
          enabled: false,
          id: "editing_enter_export_name",
        },
        {
          click: menu_click_handlers.request_enter_switch_ip,
          label: "Enter Switch's Local IP Address",
          enabled: false,
          id: "editing_enter_switch_ip",
        },
      ],
    },
    {
      label: "Utilities",
      submenu: [
        {
          click: menu_click_handlers.create_numeric_value_window,
          label: "Narrow Down Numeric Value",
        },
      ],
    },
    {
      label: "Options",
      submenu: [
        {
          label: "Compiling",
          submenu: [
            {
              click: (
                menu_item: MenuItem,
                _browser_window: BrowserWindow,
                _event: Event
              ): Promise<void> => {
                menu_click_handlers.show_compiler_errors(menu_item.checked);
                return;
              },
              label: "Show Compiler Errors",
              type: "checkbox",
              checked: await Store.value_of(
                "dialogs",
                "show_compiler_errors",
                store_defaults.dialogs
              ),
            },
            {
              click: (
                menu_item: MenuItem,
                _browser_window: BrowserWindow,
                _event: Event
              ): Promise<void> => {
                const dialogs = new Store("dialogs", store_defaults.dialogs);
                dialogs.set("show_compile_success", menu_item.checked).then(
                  () => void 0,
                  reason => console.error(reason)
                );
                return;
              },
              label: "Show Compile Success",
              type: "checkbox",
              checked: await Store.value_of(
                "dialogs",
                "show_compile_success",
                store_defaults.dialogs
              ),
            },
          ],
        },
        {
          label: "Decompiling",
          submenu: [
            {
              click: (
                menu_item: MenuItem,
                _browser_window: BrowserWindow,
                _event: Event
              ): Promise<void> => {
                menu_click_handlers.show_decompiler_errors(menu_item.checked);
                return;
              },
              label: "Show Decompiler Errors",
              type: "checkbox",
              checked: await Store.value_of(
                "dialogs",
                "show_decompiler_errors",
                store_defaults.dialogs
              ),
            },
            {
              click: (
                menu_item: MenuItem,
                _browser_window: BrowserWindow,
                _event: Event
              ): Promise<void> => {
                const dialogs = new Store(
                  "preferences",
                  store_defaults.preferences
                );
                dialogs
                  .set("decompiling_perfect_decimal_match", menu_item.checked)
                  .then(
                    () => void 0,
                    reason => console.error(reason)
                  );
                return;
              },
              label: "Allow Decimals on Stick Angles",
              type: "checkbox",
              checked: await Store.value_of(
                "preferences",
                "decompiling_perfect_decimal_match",
                store_defaults.preferences
              ),
            },
          ],
        },
        {
          label: "Exporting",
          submenu: [
            {
              click: (
                menu_item: MenuItem,
                _browser_window: BrowserWindow,
                _event: Event
              ): Promise<void> => {
                const dialogs = new Store("dialogs", store_defaults.dialogs);
                dialogs.set("show_export_success", menu_item.checked).then(
                  () => void 0,
                  reason => console.error(reason)
                );
                return;
              },
              label: "Show Export Success",
              type: "checkbox",
              checked: await Store.value_of(
                "dialogs",
                "show_export_success",
                store_defaults.dialogs
              ),
            },
            {
              click: (
                menu_item: MenuItem,
                _browser_window: BrowserWindow,
                _event: Event
              ): Promise<void> => {
                const dialogs = new Store("dialogs", store_defaults.dialogs);
                dialogs
                  .set("all_exporting_show_replace", menu_item.checked)
                  .then(
                    () => void 0,
                    reason => console.error(reason)
                  );
                return;
              },
              label: "Show Warning When Replacing Scripts",
              type: "checkbox",
              checked: await Store.value_of(
                "dialogs",
                "all_exporting_show_replace",
                store_defaults.dialogs
              ),
            },
          ],
        },
      ],
    },
    {
      label: "View",
      submenu: [
        {
          click: menu_click_handlers.toggle_theme,
          label: "Toggle Theme",
        },
        { type: "separator" },
        {
          click: (
            _menu_item: MenuItem,
            browser_window: BrowserWindow,
            _event: Event
          ): void => {
            browser_window.reload();
          },
          accelerator: "CmdOrCtrl+R",
          label: "Reload Window",
        },
        {
          click: (
            _menu_item: MenuItem,
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
    {
      label: "Help",
      submenu: [
        {
          label: "Better Scripts Help",
          click: (
            _menu_item: MenuItem,
            _browser_window: BrowserWindow,
            _event: Event
          ): void => {
            menu_click_handlers.create_help_window(
              "../src/help/better_scripts/index.html"
            );
          },
        },
        {
          label: "Built-in Macros Help",
          click: (
            _menu_item: MenuItem,
            _browser_window: BrowserWindow,
            _event: Event
          ): void => {
            menu_click_handlers.create_help_window(
              "../src/help/builtins/index.html"
            );
          },
        },
        {
          label: "Programmatic Scripts Help",
          click: (
            _menu_item: MenuItem,
            _browser_window: BrowserWindow,
            _event: Event
          ): void => {
            menu_click_handlers.create_help_window(
              "../src/help/programmatic/index.html"
            );
          },
        },
        {
          label: "Exporting Help",
          click: (
            _menu_item: MenuItem,
            _browser_window: BrowserWindow,
            _event: Event
          ): void => {
            menu_click_handlers.create_help_window(
              "../src/help/exporting/index.html"
            );
          },
        },
      ],
    },
  ];

  // Change menu if we're on Mac by adding normal menu categories
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
    ]
      .concat(template)
      .concat([
        {
          label: "Window",
          submenu: [
            { role: "minimize" },
            { role: "zoom" },
            { type: "separator" },
            { role: "front" },
            { type: "separator" },
            { role: "window" },
          ],
        },
      ]);
  }

  return Menu.buildFromTemplate(template);
}
