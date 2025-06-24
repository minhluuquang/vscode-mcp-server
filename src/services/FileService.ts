import * as fs from "fs/promises";
import * as path from "path";

export class FileService {
  async readJsonFile(filePath: string): Promise<any> {
    try {
      const content = await fs.readFile(filePath, "utf-8");
      return JSON.parse(content);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return null;
      }
      throw new Error(`Failed to read JSON file ${filePath}: ${(error as Error).message}`);
    }
  }

  async directoryExists(dirPath: string): Promise<boolean> {
    try {
      const stats = await fs.stat(dirPath);
      return stats.isDirectory();
    } catch {
      return false;
    }
  }

  async readDirectory(dirPath: string): Promise<string[]> {
    try {
      return await fs.readdir(dirPath);
    } catch (error) {
      throw new Error(`Failed to read directory ${dirPath}: ${(error as Error).message}`);
    }
  }

  async readSettings(settingsPath: string): Promise<Record<string, any>> {
    try {
      const content = await fs.readFile(settingsPath, "utf-8");
      // Strip single-line comments (// ...) and multi-line comments (/* ... */) to handle JSONC format
      const cleanedContent = content
        .replace(/\/\*[\s\S]*?\*\//g, "") // Remove multi-line comments
        .replace(/\/\/.*$/gm, "") // Remove single-line comments
        .replace(/,(\s*[}\]])/g, "$1"); // Remove trailing commas before } or ]
      return JSON.parse(cleanedContent);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return {};
      }
      throw new Error(`Failed to read settings from ${settingsPath}: ${(error as Error).message}`);
    }
  }

  async writeSettings(settingsPath: string, settings: Record<string, any>): Promise<void> {
    try {
      const dir = path.dirname(settingsPath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2), "utf-8");
    } catch (error) {
      throw new Error(`Failed to write settings to ${settingsPath}: ${(error as Error).message}`);
    }
  }
}
