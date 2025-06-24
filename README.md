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

## 🚀 Quick Start

### Installation Methods

#### Option 1: Local Installation (Recommended)

**Prerequisites:**
- Node.js 18 or higher
- npm or yarn
- Visual Studio Code installed

**Setup:**
```bash
# Clone the repository
git clone <repository-url>
cd vscode-mcp-server

# Install dependencies
npm install

# Build the project
npm run build
```

#### Option 2: Use with npx (Recommended for Published Package)
When the package is published to npm, you can use it directly with npx without installation:

```bash
# Test the server directly
npx -y vscode-mcp-server
```

### Configuration

#### Claude Desktop
Add this configuration to your Claude Desktop config file:

**Config file locations:**
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

**For published package (recommended):**
```json
{
  "mcpServers": {
    "vscode-settings": {
      "command": "npx",
      "args": [
        "-y",
        "vscode-mcp-server"
      ]
    }
  }
}
```

**For local development:**
```json
{
  "mcpServers": {
    "vscode-settings": {
      "command": "node",
      "args": ["/absolute/path/to/vscode-mcp-server/dist/index.js"]
    }
  }
}
```

#### VS Code with MCP Extension
If using an MCP-compatible extension in VS Code:

**For published package:**
```json
{
  "mcp.servers": [
    {
      "name": "vscode-settings",
      "command": "npx",
      "args": ["-y", "vscode-mcp-server"]
    }
  ]
}
```

**For local development:**
```json
{
  "mcp.servers": [
    {
      "name": "vscode-settings",
      "command": "node",
      "args": ["/absolute/path/to/vscode-mcp-server/dist/index.js"]
    }
  ]
}
```

#### Other MCP Clients
Any MCP-compatible client can connect using stdio transport:

**For published package:**
```json
{
  "name": "vscode-settings",
  "command": "npx",
  "args": ["-y", "vscode-mcp-server"],
  "transport": "stdio"
}
```

**For local development:**
```json
{
  "name": "vscode-settings",
  "command": "node",
  "args": ["/path/to/vscode-mcp-server/dist/index.js"],
  "transport": "stdio"
}
```

### Environment Variables

The server supports these optional environment variables:

```bash
# Set custom VS Code installation path (optional)
export VSCODE_USER_PATH="/custom/path/to/vscode/settings"

# Enable debug logging (optional)
export DEBUG="vscode-mcp-server:*"
```

## 🎯 Usage

Once configured, you can interact with VS Code settings through your MCP client:

### Basic Commands
```
# Update settings
"Set my VS Code font size to 16"
"Change VS Code theme to GitHub Dark"
"Enable word wrap in VS Code"

# Read settings  
"What's my current VS Code font size?"
"Show me my VS Code theme setting"
"List all my workspace settings"

# Get help
"What VS Code settings can I modify?"
"Show me common VS Code editor settings"
```

### Advanced Usage
```
# Language-specific settings
"Configure TypeScript formatting for this workspace"
"Set up Python linting rules in VS Code"

# Complex configurations
"Hide node_modules and .git folders from VS Code explorer"
"Set up custom file associations for .env files"
"Configure VS Code rulers at columns 80 and 120"
```

## 🧪 Testing and Troubleshooting

### Direct Server Testing
Test the server directly without an MCP client:

**For published package:**
```bash
# Test tool listing
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | npx -y vscode-mcp-server

# Test updating a setting (user scope)
echo '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"update_vscode_setting","arguments":{"setting":"editor.fontSize","value":16,"scope":"user"}}}' | npx -y vscode-mcp-server

# Test reading a setting
echo '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"get_vscode_setting","arguments":{"setting":"editor.fontSize","scope":"user"}}}' | npx -y vscode-mcp-server
```

**For local development:**
```bash
# 1. Build the project first
npm run build

# 2. Test tool listing
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node dist/index.js

# 3. Test updating a setting (user scope)
echo '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"update_vscode_setting","arguments":{"setting":"editor.fontSize","value":16,"scope":"user"}}}' | node dist/index.js

# 4. Test reading a setting
echo '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"get_vscode_setting","arguments":{"setting":"editor.fontSize","scope":"user"}}}' | node dist/index.js
```

### Testing with Claude Desktop

After integration, test these commands in Claude Desktop:

```
# Basic setting updates
"Please update my VS Code font size to 14"
"Change my VS Code theme to Dark+ (default dark)"
"Enable word wrap in my VS Code editor"

# Reading settings
"What's my current VS Code font size?"
"Show me all my workspace VS Code settings"
"What theme am I currently using in VS Code?"

# Advanced configurations
"Set up TypeScript formatting on save for my workspace"
"Configure my VS Code to hide node_modules from the file explorer"
```

### Common Settings to Test
- `editor.fontSize`: Number value (e.g., 12, 14, 16)
- `workbench.colorTheme`: String value (e.g., "Dark+ (default dark)")
- `editor.minimap.enabled`: Boolean value (true/false)
- `files.exclude`: Object value (e.g., {"node_modules": true})
- `editor.rulers`: Array value (e.g., [80, 120])
- `editor.wordWrap`: String value ("on", "off", "wordWrapColumn")

### Troubleshooting

#### Server Not Responding
1. Verify the server builds successfully: `npm run build`
2. Check the absolute path in your MCP configuration
3. Ensure Node.js version is 18 or higher: `node --version`
4. Test direct server communication with the commands above

#### Settings Not Updating
1. Verify VS Code is not running (close all instances)
2. Check file permissions for VS Code settings directories
3. Ensure the setting key is valid (use `list_common_settings` tool)
4. Verify JSON syntax in complex setting values

#### Path Issues
- **macOS**: Ensure path starts with `/Users/username/...`
- **Windows**: Use forward slashes or escape backslashes in JSON
- **Linux**: Ensure proper permissions for the home directory

#### Debug Mode
Run with additional logging:
```bash
DEBUG=* node dist/index.js
```

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