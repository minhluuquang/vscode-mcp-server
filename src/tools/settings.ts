import { z } from "zod";
import { SettingsService } from "../services/SettingsService.js";
import { McpToolResponse } from "../types/index.js";
import { COMMON_SETTINGS } from "../constants/settings.js";

export function createSettingsTools(settingsService: SettingsService) {
  return {
    update_vscode_setting: {
      description: "Update a VS Code setting",
      schema: {
        setting: z.string().describe("The setting key to update (e.g., 'editor.fontSize')"),
        value: z.any().describe("The value to set for the setting"),
        scope: z
          .enum(["user", "workspace"])
          .default("user")
          .describe("Whether to update user or workspace settings"),
      },
      handler: async (args: {
        setting: string;
        value?: any;
        scope: "user" | "workspace";
      }): Promise<McpToolResponse> => {
        try {
          const { setting, value, scope } = args;
          if (value === undefined) {
            throw new Error("Value is required for update operation");
          }
          await settingsService.updateSetting(setting, value, scope);

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
      },
    },

    get_vscode_setting: {
      description: "Get VS Code settings",
      schema: {
        setting: z
          .string()
          .optional()
          .describe("Specific setting to retrieve, or all settings if not provided"),
        scope: z
          .enum(["user", "workspace"])
          .default("user")
          .describe("Which settings scope to read from"),
      },
      handler: async (args: {
        setting?: string | undefined;
        scope: "user" | "workspace";
      }): Promise<McpToolResponse> => {
        try {
          const { setting, scope } = args;

          if (setting) {
            const value = await settingsService.getSetting(setting, scope);
            return {
              content: [
                {
                  type: "text",
                  text: `Setting "${setting}" in ${scope} scope: ${JSON.stringify(value, null, 2)}`,
                },
              ],
            };
          } else {
            const settings = await settingsService.getSettings(scope);
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
      },
    },

    list_common_settings: {
      description: "List common VS Code settings that can be modified",
      schema: {},
      handler: async (): Promise<McpToolResponse> => {
        return {
          content: [
            {
              type: "text",
              text: `Common VS Code Settings:\n${JSON.stringify(COMMON_SETTINGS, null, 2)}`,
            },
          ],
        };
      },
    },
  };
}
