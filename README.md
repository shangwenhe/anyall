# MCP Chrome Browser Controller

A simple MCP (Model Context Protocol) server for controlling Google Chrome browser from MCP clients.

## Features

- **openChrome**: Open Chrome browser to a specified URL
- **closeChrome**: Close all Chrome browser instances  
- **navigateUrl**: Open a new tab in Chrome with a specified URL

## Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build
```

## Running the Server

```bash
# Using npm command
npm run dev

# Or using the start script
bash /Users/rc/Code/github/shangwenhe/mcp/start.sh
```

## Configuration

### Chrome Path
The default Chrome path is set to regular Chrome:
```
/Applications/Google Chrome.app/Contents/MacOS/Google Chrome
```

To use Chrome Canary, edit the `CHROME_PATH` constant in `src/tools.ts`:
```typescript
const CHROME_PATH = '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary';
```

## Usage

The server exposes 3 MCP actions:

### 1. openChrome
- **Description**: Open Chrome browser to the specified URL
- **Input**: `{ "url": "https://example.com" }`

### 2. closeChrome
- **Description**: Close all Chrome browser instances
- **Input**: `{}` (no parameters)

### 3. navigateUrl
- **Description**: Open a new tab in Chrome with the specified URL
- **Input**: `{ "url": "https://example.com" }`

## Example Usage

You can use any MCP client to interact with this server.
