# VS Code Settings MCP Server

A powerful MCP (Model Context Protocol) server that enables programmatic management of Visual Studio Code settings through AI assistants and automated tools.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MCP](https://img.shields.io/badge/MCP-Model%20Context%20Protocol-blue?style=flat-square)](https://github.com/modelcontextprotocol)

## 🚀 Overview

This MCP server bridges the gap between AI assistants and VS Code configuration management. It allows AI models to read, modify, and manage VS Code settings across different scopes (user/workspace) with full cross-platform support.

### Why This Server?

- **AI-Driven Configuration**: Let AI assistants help optimize your VS Code setup
- **Automated Workflows**: Integrate VS Code settings management into CI/CD pipelines
- **Cross-Platform Consistency**: Maintain consistent settings across different operating systems
- **Workspace Management**: Easily synchronize project-specific configurations

## ✨ Features

### Core Functionality
- 🔧 **Update VS Code Settings**: Modify user or workspace settings programmatically
- 📖 **Read VS Code Settings**: Retrieve current setting values or complete configuration
- 📋 **List Common Settings**: Built-in reference guide for frequently used VS Code settings
- 🌍 **Cross-Platform Support**: Seamless operation on Windows, macOS, and Linux
- 🛡️ **Error Handling**: Comprehensive validation and error reporting
- 📁 **Smart Path Resolution**: Automatic detection of VS Code settings locations

### Developer Experience
- 🎯 **TypeScript Support**: Full type safety and IntelliSense support
- 🔍 **ESLint & Prettier**: Code quality and formatting enforcement
- 🏗️ **Modern Architecture**: Built with latest ES modules and async/await patterns
- 📦 **Zero Configuration**: Works out of the box with sensible defaults

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Visual Studio Code

### Setup
```bash
# Clone or download the project
cd vscode-mcp-server

# Install dependencies
npm install

# Build the project
npm run build
```

## 🛠️ Development

### Available Scripts

```bash
# Development with hot reload
npm run dev

# Production build
npm run build

# Run the server
npm run start

# Code quality
npm run lint          # Check for linting issues
npm run lint:fix      # Auto-fix linting issues
npm run format        # Format code with Prettier
npm run format:check  # Check formatting
npm run typecheck     # TypeScript type checking
```

### Project Structure
```
vscode-mcp-server/
├── src/
│   └── index.ts          # Main server implementation
├── dist/                 # Compiled JavaScript
├── eslint.config.js      # ESLint configuration
├── .prettierrc           # Prettier configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Project dependencies
```

## 🔧 MCP Tools

### `update_vscode_setting`
Updates a VS Code setting with a new value.

**Parameters:**
- `setting` (string): The setting key (e.g., "editor.fontSize")
- `value` (any): The value to set (string, number, boolean, object, array)
- `scope` ("user" | "workspace"): Target scope (default: "user")

**Example Response:**
```json
{
  "content": [{
    "type": "text", 
    "text": "Successfully updated user setting \"editor.fontSize\" to: 16"
  }]
}
```

### `get_vscode_setting`
Retrieves VS Code settings.

**Parameters:**
- `setting` (string, optional): Specific setting key, or omit for all settings
- `scope` ("user" | "workspace"): Source scope (default: "user")

**Example Response:**
```json
{
  "content": [{
    "type": "text",
    "text": "Setting \"workbench.colorTheme\" in user scope: \"Dark+ (default dark)\""
  }]
}
```

### `list_common_settings`
Lists commonly used VS Code settings with descriptions.

**No Parameters Required**

**Returns:** Reference guide organized by category (Editor, Workbench, Files, Terminal)

## 💡 Usage Examples

### Basic Setting Updates
```javascript
// Change font size
await updateVSCodeSetting({
  setting: "editor.fontSize",
  value: 16,
  scope: "user"
});

// Enable word wrap
await updateVSCodeSetting({
  setting: "editor.wordWrap",
  value: "on",
  scope: "workspace"
});

// Configure auto-save
await updateVSCodeSetting({
  setting: "files.autoSave",
  value: "afterDelay",
  scope: "user"
});
```

### Reading Settings
```javascript
// Get current theme
await getVSCodeSetting({
  setting: "workbench.colorTheme",
  scope: "user"
});

// Get all workspace settings
await getVSCodeSetting({
  scope: "workspace"
});

// Check if minimap is enabled
await getVSCodeSetting({
  setting: "editor.minimap.enabled",
  scope: "user"
});
```

### Complex Configurations
```javascript
// Configure language-specific settings
await updateVSCodeSetting({
  setting: "[typescript]",
  value: {
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    }
  },
  scope: "workspace"
});

// Set up file associations
await updateVSCodeSetting({
  setting: "files.associations",
  value: {
    "*.env.*": "properties",
    "*.config.js": "javascript"
  },
  scope: "user"
});
```

## 📍 Settings Locations

The server automatically detects VS Code settings locations based on your operating system:

### User Settings
- **macOS**: `~/Library/Application Support/Code/User/settings.json`
- **Windows**: `%APPDATA%/Code/User/settings.json`  
- **Linux**: `~/.config/Code/User/settings.json`

### Workspace Settings
- **All Platforms**: `.vscode/settings.json` (relative to current working directory)

## 🛡️ Error Handling & Validation

The server provides comprehensive error handling for common scenarios:

### Input Validation
- Empty or invalid setting names
- Unsupported setting scopes
- Malformed JSON values

### File System Errors
- Missing settings files (automatically created)
- Permission denied errors
- Disk space issues
- Invalid JSON parsing

### Platform Compatibility
- Unsupported operating systems
- Missing VS Code installations
- Path resolution failures

**Example Error Response:**
```json
{
  "content": [{
    "type": "text",
    "text": "Error updating setting: Setting name cannot be empty"
  }]
}
```

## 🔌 Integration with MCP Clients

### Claude Desktop
Add to your MCP configuration:
```json
{
  "mcpServers": {
    "vscode-settings": {
      "command": "node",
      "args": ["/path/to/vscode-mcp-server/dist/index.js"]
    }
  }
}
```

### Other MCP Clients
The server follows the standard MCP protocol and works with any compliant client using stdio transport.

## 🧪 Testing

### Manual Testing
```bash
# Start the server in development mode
npm run dev

# In another terminal, test with MCP client or direct stdio
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node dist/index.js
```

### Common Settings to Test
- `editor.fontSize`: Number value
- `workbench.colorTheme`: String value  
- `editor.minimap.enabled`: Boolean value
- `files.exclude`: Object value
- `editor.rulers`: Array value

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Install dependencies: `npm install`
3. Make your changes in `src/`
4. Run tests: `npm run lint && npm run typecheck`
5. Format code: `npm run format`
6. Build: `npm run build`

### Code Style
- Follow existing TypeScript patterns
- Use async/await for asynchronous operations
- Include comprehensive error handling
- Add JSDoc comments for public methods
- Maintain cross-platform compatibility

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- [Model Context Protocol](https://github.com/modelcontextprotocol) - For the MCP specification
- [VS Code Team](https://code.visualstudio.com/) - For the excellent editor and settings system
- [TypeScript](https://www.typescriptlang.org/) - For type safety and developer experience

---

**Made with ❤️ for the VS Code and AI community**