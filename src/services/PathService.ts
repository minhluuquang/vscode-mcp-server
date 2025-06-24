import * as path from "path";
import * as os from "os";

export class PathService {
  getUserSettingsPath(): string {
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

  getWorkspaceSettingsPath(): string {
    const cwd = process.cwd();
    return path.join(cwd, ".vscode", "settings.json");
  }

  getExtensionsPath(): string {
    const platform = process.platform;
    const homeDir = os.homedir();

    switch (platform) {
      case "win32":
      case "darwin":
      case "linux":
        return path.join(homeDir, ".vscode", "extensions");
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  getUserDataPath(): string {
    const platform = process.platform;
    const homeDir = os.homedir();

    switch (platform) {
      case "win32":
        return path.join(homeDir, "AppData", "Roaming", "Code", "User");
      case "darwin":
        return path.join(homeDir, "Library", "Application Support", "Code", "User");
      case "linux":
        return path.join(homeDir, ".config", "Code", "User");
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  getAllPaths() {
    return {
      userSettings: this.getUserSettingsPath(),
      workspaceSettings: this.getWorkspaceSettingsPath(),
      extensions: this.getExtensionsPath(),
      userData: this.getUserDataPath(),
    };
  }
}
