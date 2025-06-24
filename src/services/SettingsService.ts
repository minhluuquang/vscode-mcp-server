import { PathService } from "./PathService.js";
import { FileService } from "./FileService.js";

export type SettingsScope = "user" | "workspace";

export class SettingsService {
  constructor(
    private pathService: PathService,
    private fileService: FileService
  ) {}

  async getSettings(scope: SettingsScope): Promise<Record<string, any>> {
    const settingsPath = this.getSettingsPath(scope);
    return await this.fileService.readSettings(settingsPath);
  }

  async getSetting(key: string, scope: SettingsScope): Promise<any> {
    const settings = await this.getSettings(scope);
    return settings[key];
  }

  async updateSetting(key: string, value: any, scope: SettingsScope): Promise<void> {
    if (!key || key.trim() === "") {
      throw new Error("Setting name cannot be empty");
    }

    const settingsPath = this.getSettingsPath(scope);
    const settings = await this.fileService.readSettings(settingsPath);
    settings[key] = value;
    await this.fileService.writeSettings(settingsPath, settings);
  }

  private getSettingsPath(scope: SettingsScope): string {
    return scope === "user"
      ? this.pathService.getUserSettingsPath()
      : this.pathService.getWorkspaceSettingsPath();
  }
}
