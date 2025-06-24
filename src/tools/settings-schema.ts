import { z } from "zod";
import { McpToolResponse } from "../types/index.js";
import { SETTINGS_SCHEMA } from "../constants/settings.js";

export function createSettingsSchemaTools() {
  return {
    get_available_settings: {
      description: "Get available VS Code settings with descriptions and types",
      schema: {
        category: z
          .string()
          .optional()
          .describe("Optional category filter (e.g., 'editor', 'workbench', 'files')"),
        search: z.string().optional().describe("Optional search term to filter settings"),
      },
      handler: async (args: {
        category?: string | undefined;
        search?: string | undefined;
      }): Promise<McpToolResponse> => {
        try {
          const { category, search } = args;

          let filteredSettings = { ...SETTINGS_SCHEMA };

          // Filter by category if provided
          if (category) {
            const categoryKey = category.toLowerCase();
            if (SETTINGS_SCHEMA[categoryKey]) {
              filteredSettings = {
                [categoryKey]: SETTINGS_SCHEMA[categoryKey],
              };
            } else {
              filteredSettings = {};
            }
          }

          // Filter by search term if provided
          if (search) {
            const searchTerm = search.toLowerCase();
            const searchResults: typeof SETTINGS_SCHEMA = {};

            for (const [categoryName, categorySettings] of Object.entries(filteredSettings)) {
              const matchingSettings: Record<string, any> = {};

              for (const [settingKey, settingValue] of Object.entries(categorySettings)) {
                if (
                  settingKey.toLowerCase().includes(searchTerm) ||
                  settingValue.description.toLowerCase().includes(searchTerm)
                ) {
                  matchingSettings[settingKey] = settingValue;
                }
              }

              if (Object.keys(matchingSettings).length > 0) {
                searchResults[categoryName] = matchingSettings;
              }
            }

            filteredSettings = searchResults;
          }

          return {
            content: [
              {
                type: "text",
                text: `Available VS Code settings:\n${JSON.stringify(filteredSettings, null, 2)}`,
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error getting available settings: ${(error as Error).message}`,
              },
            ],
          };
        }
      },
    },
  };
}
