import { PathService } from "../services/PathService.js";
import { McpToolResponse } from "../types/index.js";

export function createPathsTools(pathService: PathService) {
  return {
    get_vscode_paths: {
      description: "Get all relevant VS Code directory paths",
      schema: {},
      handler: async (): Promise<McpToolResponse> => {
        try {
          const paths = pathService.getAllPaths();

          return {
            content: [
              {
                type: "text",
                text: `VS Code paths:\n${JSON.stringify(paths, null, 2)}`,
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error getting VS Code paths: ${(error as Error).message}`,
              },
            ],
          };
        }
      },
    },
  };
}
