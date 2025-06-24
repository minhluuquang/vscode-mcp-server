# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development Tasks
- `npm run build` - Compile TypeScript to JavaScript in `dist/` directory
- `npm run dev` - Start development server with hot reload using tsx
- `npm run start` - Run the built server from `dist/index.js`
- `npm run typecheck` - Run TypeScript type checking without emitting files
- `npm run lint` - Check for ESLint issues in TypeScript files
- `npm run lint:fix` - Auto-fix linting issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check if code is properly formatted

### Testing the MCP Server
- Start server: `npm run dev` or `npm run start`
- Test tool listing: `echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node dist/index.js`
- The server communicates via stdio using the MCP protocol

## Architecture Overview

### Project Structure
The codebase follows a modular architecture with clear separation of concerns:

```
src/
├── index.ts                     # Entry point (9 lines)
├── server/
│   └── VSCodeSettingsServer.ts  # Main server class (36 lines)
├── services/
│   ├── PathService.ts           # Platform-specific path resolution (71 lines)
│   ├── FileService.ts           # File I/O operations (60 lines)
│   └── SettingsService.ts       # Settings read/write logic (39 lines)
├── tools/
│   ├── index.ts                 # Tool registration (77 lines)
│   ├── settings.ts              # Settings management tools (113 lines)
│   ├── themes.ts                # Theme listing tools (103 lines)
│   ├── extensions.ts            # Extension listing tools (83 lines)
│   ├── paths.ts                 # Path utilities (35 lines)
│   └── settings-schema.ts       # Settings schema tools (81 lines)
├── types/
│   └── index.ts                 # TypeScript type definitions (47 lines)
└── constants/
    └── settings.ts              # Settings schema and constants (143 lines)
```

### Core Services
- **PathService**: Cross-platform handling of VS Code file locations
- **FileService**: JSON file read/write operations with JSONC support
- **SettingsService**: High-level settings management abstraction
- **VSCodeSettingsServer**: Main server implementation with MCP protocol integration

### MCP Tools Available
1. `update_vscode_setting` - Updates VS Code settings (user/workspace scope)
2. `get_vscode_setting` - Retrieves specific or all VS Code settings
3. `list_common_settings` - Returns reference guide of common VS Code settings
4. `list_installed_themes` - Lists all installed VS Code themes (color/icon)
5. `list_extensions` - Lists all installed VS Code extensions with filtering
6. `get_vscode_paths` - Returns all relevant VS Code directory paths
7. `get_available_settings` - Provides searchable settings schema with descriptions

### Settings File Locations
- **User settings**: Platform-specific paths (~/Library/Application Support/Code/User/settings.json on macOS)
- **Workspace settings**: `.vscode/settings.json` relative to current working directory
- **Auto-creation**: Missing directories and files are created automatically

### Key Features
- **Extension Management**: List and categorize installed VS Code extensions
- **Theme Discovery**: Find all color and icon themes with metadata
- **Settings Schema**: Comprehensive settings reference with types and descriptions
- **Path Resolution**: Automatic detection of VS Code configuration directories
- **JSONC Support**: Handles VS Code's JSON with Comments format
- **Cross-Platform**: Works on Windows, macOS, and Linux

### Error Handling Strategy
- Comprehensive try-catch blocks around all file operations
- User-friendly error messages returned via MCP protocol
- Automatic creation of missing settings files and directories
- Cross-platform compatibility validation
- Graceful handling of missing extensions or corrupted package.json files

### Technology Stack
- **Runtime**: Node.js 18+ with ESM modules
- **Language**: TypeScript with strict type checking
- **MCP SDK**: @modelcontextprotocol/sdk for server implementation
- **Validation**: Zod schemas for input validation
- **Code Quality**: ESLint + Prettier with TypeScript rules

## Development Guidelines

### Code Style
- Uses ES modules (type: "module" in package.json)
- Strict TypeScript configuration with declaration files
- Prettier formatting with 100 character line width, 2-space indentation
- ESLint with TypeScript rules, allows console.log, warns on explicit any
- Error handling with descriptive messages and proper error types

### Architecture Principles
- **Single Responsibility**: Each service handles one specific concern
- **Dependency Injection**: Services are injected into classes for better testability
- **Modular Design**: Tools are separated by functionality for easier maintenance
- **Type Safety**: Comprehensive TypeScript types for all interfaces
- **Error Boundaries**: Each tool handles its own errors gracefully

### Adding New Tools
1. Create tool handler in appropriate `src/tools/*.ts` file
2. Export tool definition with schema, description, and handler
3. Register tool in `src/tools/index.ts`
4. Add types to `src/types/index.ts` if needed
5. Update CLAUDE.md documentation