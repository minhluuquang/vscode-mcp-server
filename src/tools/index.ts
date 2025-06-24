import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { PathService } from "../services/PathService.js";
import { FileService } from "../services/FileService.js";
import { SettingsService } from "../services/SettingsService.js";
import { createSettingsTools } from "./settings.js";
import { createThemesTools } from "./themes.js";
import { createExtensionsTools } from "./extensions.js";
import { createPathsTools } from "./paths.js";
import { createSettingsSchemaTools } from "./settings-schema.js";

export function registerTools(
  server: McpServer,
  pathService: PathService,
  fileService: FileService,
  settingsService: SettingsService
): void {
  const settingsTools = createSettingsTools(settingsService);
  const themesTools = createThemesTools(pathService, fileService);
  const extensionsTools = createExtensionsTools(pathService, fileService);
  const pathsTools = createPathsTools(pathService);
  const settingsSchemaTools = createSettingsSchemaTools();

  // Register settings tools
  server.tool(
    "update_vscode_setting",
    settingsTools.update_vscode_setting.description,
    settingsTools.update_vscode_setting.schema,
    async (args) => settingsTools.update_vscode_setting.handler(args)
  );

  server.tool(
    "get_vscode_setting",
    settingsTools.get_vscode_setting.description,
    settingsTools.get_vscode_setting.schema,
    async (args) => settingsTools.get_vscode_setting.handler(args)
  );

  server.tool(
    "list_common_settings",
    settingsTools.list_common_settings.description,
    settingsTools.list_common_settings.schema,
    async () => settingsTools.list_common_settings.handler()
  );

  // Register themes tools
  server.tool(
    "list_installed_themes",
    themesTools.list_installed_themes.description,
    themesTools.list_installed_themes.schema,
    async (args) => themesTools.list_installed_themes.handler(args)
  );

  // Register extensions tools
  server.tool(
    "list_extensions",
    extensionsTools.list_extensions.description,
    extensionsTools.list_extensions.schema,
    async (args) => extensionsTools.list_extensions.handler(args)
  );

  // Register paths tools
  server.tool(
    "get_vscode_paths",
    pathsTools.get_vscode_paths.description,
    pathsTools.get_vscode_paths.schema,
    async () => pathsTools.get_vscode_paths.handler()
  );

  // Register settings schema tools
  server.tool(
    "get_available_settings",
    settingsSchemaTools.get_available_settings.description,
    settingsSchemaTools.get_available_settings.schema,
    async (args) => settingsSchemaTools.get_available_settings.handler(args)
  );
}
