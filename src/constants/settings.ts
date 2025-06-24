import { SettingsSchema } from "../types/index.js";

export const COMMON_SETTINGS: Record<string, Record<string, string>> = {
  Editor: {
    "editor.fontSize": "Font size in pixels",
    "editor.fontFamily": "Font family",
    "editor.tabSize": "Number of spaces for tab",
    "editor.wordWrap": "Word wrap setting (on/off/wordWrapColumn/bounded)",
    "editor.minimap.enabled": "Show minimap",
    "editor.lineNumbers": "Show line numbers (on/off/relative/interval)",
  },
  Workbench: {
    "workbench.colorTheme": "Color theme",
    "workbench.iconTheme": "Icon theme",
    "workbench.startupEditor":
      "Startup editor (none/welcomePage/readme/newUntitledFile/welcomePageInEmptyWorkbench)",
  },
  Files: {
    "files.autoSave": "Auto save (off/afterDelay/onFocusChange/onWindowChange)",
    "files.exclude": "Files to exclude from explorer",
    "files.trimTrailingWhitespace": "Trim trailing whitespace",
  },
  Terminal: {
    "terminal.integrated.fontSize": "Terminal font size",
    "terminal.integrated.shell.windows": "Windows shell path",
    "terminal.integrated.shell.osx": "macOS shell path",
    "terminal.integrated.shell.linux": "Linux shell path",
  },
};

export const SETTINGS_SCHEMA: SettingsSchema = {
  editor: {
    "editor.fontSize": {
      type: "number",
      default: 14,
      description: "Controls the font size in pixels",
    },
    "editor.fontFamily": {
      type: "string",
      default: "Consolas, 'Courier New', monospace",
      description: "Controls the font family",
    },
    "editor.tabSize": {
      type: "number",
      default: 4,
      description: "The number of spaces a tab is equal to",
    },
    "editor.wordWrap": {
      type: "string",
      enum: ["off", "on", "wordWrapColumn", "bounded"],
      default: "off",
      description: "Controls how lines should wrap",
    },
    "editor.minimap.enabled": {
      type: "boolean",
      default: true,
      description: "Controls whether the minimap is shown",
    },
    "editor.lineNumbers": {
      type: "string",
      enum: ["off", "on", "relative", "interval"],
      default: "on",
      description: "Controls the display of line numbers",
    },
    "editor.theme": {
      type: "string",
      description: "Color theme for the editor",
      default: "Default Dark+",
    },
  },
  workbench: {
    "workbench.colorTheme": {
      type: "string",
      description: "Specifies the color theme used in the workbench",
      default: "Default Dark+",
    },
    "workbench.iconTheme": {
      type: "string",
      description: "Specifies the icon theme used in the workbench",
      default: "vs-seti",
    },
    "workbench.startupEditor": {
      type: "string",
      enum: ["none", "welcomePage", "readme", "newUntitledFile", "welcomePageInEmptyWorkbench"],
      default: "welcomePage",
      description: "Controls which editor is shown at startup",
    },
    "workbench.sideBar.location": {
      type: "string",
      enum: ["left", "right"],
      default: "left",
      description: "Controls the location of the sidebar",
    },
  },
  files: {
    "files.autoSave": {
      type: "string",
      enum: ["off", "afterDelay", "onFocusChange", "onWindowChange"],
      default: "off",
      description: "Controls auto save of dirty files",
    },
    "files.exclude": {
      type: "object",
      description: "Configure glob patterns for excluding files and folders",
      default: {},
    },
    "files.trimTrailingWhitespace": {
      type: "boolean",
      default: false,
      description: "When enabled, will trim trailing whitespace when saving a file",
    },
  },
  terminal: {
    "terminal.integrated.fontSize": {
      type: "number",
      default: 14,
      description: "Controls the font size of the terminal",
    },
    "terminal.integrated.fontFamily": {
      type: "string",
      description: "Controls the font family of the terminal",
    },
    "terminal.integrated.shell.windows": {
      type: "string",
      description: "The path of the shell that the terminal uses on Windows",
    },
    "terminal.integrated.shell.osx": {
      type: "string",
      description: "The path of the shell that the terminal uses on macOS",
    },
    "terminal.integrated.shell.linux": {
      type: "string",
      description: "The path of the shell that the terminal uses on Linux",
    },
  },
};
