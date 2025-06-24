#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as fs from "fs/promises";
import * as path from "path";
import * as os from "os";

class VSCodeSettingsServer {
  private server: McpServer;

  constructor() {
    this.server = new McpServer({
      name: "vscode-settings-server",
      version: "1.0.0",
    });

    this.setupTools();
  }

  private getUserSettingsPath(): string {
    const platform = process.platform;
    const homeDir = os.homedir();

    switch (platform) {
      case "win32":
        return path.join(homeDir, "AppData", "Roaming", "Code", "User", "settings.json");
      case "darwin":
        return path.join(
          homeDir,
          "Library",
          "Application Support",
          "Code",
          "User",
          "settings.json"
        );
      case "linux":
        return path.join(homeDir, ".config", "Code", "User", "settings.json");
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  private getWorkspaceSettingsPath(): string {
    const cwd = process.cwd();
    return path.join(cwd, ".vscode", "settings.json");
  }

  private async readSettings(settingsPath: string): Promise<Record<string, any>> {
    try {
      const content = await fs.readFile(settingsPath, "utf-8");
      return JSON.parse(content);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return {};
      }
      throw new Error(`Failed to read settings from ${settingsPath}: ${(error as Error).message}`);
    }
  }

  private async writeSettings(settingsPath: string, settings: Record<string, any>): Promise<void> {
    try {
      const dir = path.dirname(settingsPath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2), "utf-8");
    } catch (error) {
      throw new Error(`Failed to write settings to ${settingsPath}: ${(error as Error).message}`);
    }
  }

  private setupTools(): void {
    this.server.tool(
      "update_vscode_setting",
      "Update a VS Code setting",
      {
        setting: z.string().describe("The setting key to update (e.g., 'editor.fontSize')"),
        value: z.any().describe("The value to set for the setting"),
        scope: z
          .enum(["user", "workspace"])
          .default("user")
          .describe("Whether to update user or workspace settings"),
      },
      async (args) => {
        try {
          const { setting, value, scope } = args;

          if (!setting || setting.trim() === "") {
            throw new Error("Setting name cannot be empty");
          }

          const settingsPath =
            scope === "user" ? this.getUserSettingsPath() : this.getWorkspaceSettingsPath();

          const settings = await this.readSettings(settingsPath);
          settings[setting] = value;

          await this.writeSettings(settingsPath, settings);

          return {
            content: [
              {
                type: "text",
                text: `Successfully updated ${scope} setting "${setting}" to: ${JSON.stringify(value)}`,
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error updating setting: ${(error as Error).message}`,
              },
            ],
          };
        }
      }
    );

    this.server.tool(
      "get_vscode_setting",
      "Get VS Code settings",
      {
        setting: z
          .string()
          .optional()
          .describe("Specific setting to retrieve, or all settings if not provided"),
        scope: z
          .enum(["user", "workspace"])
          .default("user")
          .describe("Which settings scope to read from"),
      },
      async (args) => {
        try {
          const { setting, scope } = args;

          const settingsPath =
            scope === "user" ? this.getUserSettingsPath() : this.getWorkspaceSettingsPath();

          const settings = await this.readSettings(settingsPath);

          if (setting) {
            const value = settings[setting];
            return {
              content: [
                {
                  type: "text",
                  text: `Setting "${setting}" in ${scope} scope: ${JSON.stringify(value, null, 2)}`,
                },
              ],
            };
          } else {
            return {
              content: [
                {
                  type: "text",
                  text: `All ${scope} settings:\n${JSON.stringify(settings, null, 2)}`,
                },
              ],
            };
          }
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error reading settings: ${(error as Error).message}`,
              },
            ],
          };
        }
      }
    );

    this.server.tool(
      "list_common_settings",
      "List common VS Code settings that can be modified",
      {},
      async () => {
        const commonSettings = {
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

        return {
          content: [
            {
              type: "text",
              text: `Common VS Code Settings:\n${JSON.stringify(commonSettings, null, 2)}`,
            },
          ],
        };
      }
    );
  }

  public async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

const server = new VSCodeSettingsServer();
server.start().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
