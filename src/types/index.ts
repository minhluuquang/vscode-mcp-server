export interface ExtensionInfo {
  name: string;
  displayName: string;
  publisher: string;
  version: string;
  description: string;
  categories: string[];
}

export interface ThemeInfo {
  name: string;
  displayName: string;
  publisher: string;
  version: string;
  type: string;
  themes: Array<{ label: string; uiTheme: string; path: string }>;
}

export interface VSCodePaths {
  userSettings: string;
  workspaceSettings: string;
  extensions: string;
  userData: string;
}

export interface SettingDefinition {
  type: string;
  description: string;
  default?: any;
  enum?: string[];
}

export interface SettingsSchema {
  [category: string]: {
    [settingKey: string]: SettingDefinition;
  };
}

export interface McpToolResponse {
  [x: string]: unknown;
  content: Array<{
    type: "text";
    text: string;
    [x: string]: unknown;
  }>;
}
