import { z } from "zod";
import { PathService } from "../services/PathService.js";
import { FileService } from "../services/FileService.js";
import { McpToolResponse, ThemeInfo } from "../types/index.js";

export function createThemesTools(pathService: PathService, fileService: FileService) {
  return {
    list_installed_themes: {
      description: "List all installed VS Code themes (color and icon themes)",
      schema: {
        type: z
          .enum(["color", "icon", "all"])
          .default("all")
          .describe("Type of themes to list: color, icon, or all"),
      },
      handler: async (args: { type?: "color" | "icon" | "all" }): Promise<McpToolResponse> => {
        try {
          const { type = "all" } = args;
          const extensionsPath = pathService.getExtensionsPath();

          if (!(await fileService.directoryExists(extensionsPath))) {
            return {
              content: [
                {
                  type: "text",
                  text: `Extensions directory not found: ${extensionsPath}`,
                },
              ],
            };
          }

          const extensions = await fileService.readDirectory(extensionsPath);
          const themes: ThemeInfo[] = [];

          for (const extensionDir of extensions) {
            try {
              const extensionPath = `${extensionsPath}/${extensionDir}`;
              const packageJsonPath = `${extensionPath}/package.json`;
              const packageJson = await fileService.readJsonFile(packageJsonPath);

              if (packageJson && packageJson.contributes && packageJson.contributes.themes) {
                const isColorTheme = packageJson.contributes.themes.length > 0;
                const isIconTheme =
                  packageJson.contributes.iconThemes &&
                  packageJson.contributes.iconThemes.length > 0;

                if (
                  type === "all" ||
                  (type === "color" && isColorTheme) ||
                  (type === "icon" && isIconTheme)
                ) {
                  const themeData: ThemeInfo = {
                    name: packageJson.name || extensionDir,
                    displayName: packageJson.displayName || packageJson.name || extensionDir,
                    publisher: packageJson.publisher || "unknown",
                    version: packageJson.version || "unknown",
                    type:
                      isColorTheme && isIconTheme ? "color+icon" : isColorTheme ? "color" : "icon",
                    themes: packageJson.contributes.themes || [],
                  };

                  if (packageJson.contributes.iconThemes) {
                    themeData.themes = themeData.themes.concat(
                      packageJson.contributes.iconThemes.map((iconTheme: Record<string, any>) => ({
                        label: iconTheme.label,
                        uiTheme: "icon",
                        path: iconTheme.path,
                      }))
                    );
                  }

                  themes.push(themeData);
                }
              }
            } catch {
              // Skip extensions that can't be read
              continue;
            }
          }

          return {
            content: [
              {
                type: "text",
                text: `Found ${themes.length} theme extension(s):\n${JSON.stringify(themes, null, 2)}`,
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error listing themes: ${(error as Error).message}`,
              },
            ],
          };
        }
      },
    },
  };
}
