import { z } from "zod";
import { PathService } from "../services/PathService.js";
import { FileService } from "../services/FileService.js";
import { McpToolResponse, ExtensionInfo } from "../types/index.js";

export function createExtensionsTools(pathService: PathService, fileService: FileService) {
  return {
    list_extensions: {
      description: "List all installed VS Code extensions",
      schema: {
        category: z
          .string()
          .optional()
          .describe("Optional category filter (e.g., 'Themes', 'Languages', 'Debuggers')"),
      },
      handler: async (args: { category?: string | undefined }): Promise<McpToolResponse> => {
        try {
          const { category } = args;
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
          const extensionList: ExtensionInfo[] = [];

          for (const extensionDir of extensions) {
            try {
              const extensionPath = `${extensionsPath}/${extensionDir}`;
              const packageJsonPath = `${extensionPath}/package.json`;
              const packageJson = await fileService.readJsonFile(packageJsonPath);

              if (packageJson) {
                const extensionCategories = packageJson.categories || [];

                if (!category || extensionCategories.includes(category)) {
                  extensionList.push({
                    name: packageJson.name || extensionDir,
                    displayName: packageJson.displayName || packageJson.name || extensionDir,
                    publisher: packageJson.publisher || "unknown",
                    version: packageJson.version || "unknown",
                    description: packageJson.description || "No description",
                    categories: extensionCategories,
                  });
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
                text: `Found ${extensionList.length} extension(s):\n${JSON.stringify(extensionList, null, 2)}`,
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error listing extensions: ${(error as Error).message}`,
              },
            ],
          };
        }
      },
    },
  };
}
