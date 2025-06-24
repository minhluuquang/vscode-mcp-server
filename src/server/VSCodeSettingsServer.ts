import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { PathService } from "../services/PathService.js";
import { FileService } from "../services/FileService.js";
import { SettingsService } from "../services/SettingsService.js";
import { registerTools } from "../tools/index.js";

export class VSCodeSettingsServer {
  private server: McpServer;
  private pathService: PathService;
  private fileService: FileService;
  private settingsService: SettingsService;

  constructor() {
    this.server = new McpServer({
      name: "vscode-settings-server",
      version: "1.0.0",
    });

    this.pathService = new PathService();
    this.fileService = new FileService();
    this.settingsService = new SettingsService(this.pathService, this.fileService);

    this.setupTools();
  }

  private setupTools(): void {
    registerTools(this.server, this.pathService, this.fileService, this.settingsService);
  }

  public async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}
