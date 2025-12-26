# Chrome Browser Controller MCP Service

MCP (Model Context Protocol) service to control Chrome browser.


## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Production

```bash
npm start
```

## Browser Tools API

This MCP service provides the following tools to control Chrome:

### Browser Management Tools:
1. `openChrome(url: string)` - Open Chrome browser to the specified URL
2. `closeChrome()` - Close all Chrome browser instances
3. `resetSession()` - Reset the Chrome browser session
4. `getBrowserStatus()` - Get the current status of the Chrome browser

### Tab Management Tools:
1. `navigateUrl(url: string)` - Open a new tab in Chrome with the specified URL
2. `reload()` - Reload the current page in Chrome
3. `back()` - Navigate back in Chrome history
4. `forward()` - Navigate forward in Chrome history
5. `closeTab(tabId: string)` - Close the specified tab
6. `switchTab(tabId: string)` - Switch to the specified tab

### Page Content Tools:
1. `getPageHtml()` - Get the complete HTML of the current page
2. `getPageText()` - Get the plain text content of the current page
3. `getPageScreenshot()` - Get a screenshot of the current page
4. `getTabs()` - Get information about all open tabs

### Element Interaction Tools:
1. `clickElement(selector: string)` - Click a page element
2. `inputText(selector: string, text: string)` - Input text into a page element

### Element Data Extraction Tools:
1. `getElementText(selector: string)` - Get text from a page element
2. `getElementAttribute(selector: string, attributeName: string)` - Get attribute from a page element

### JavaScript Execution Tools:
1. `executeJavaScript(code: string)` - Execute JavaScript code in the current page context

### Cookie Management Tools:
1. `getCookies()` - Get cookies from the current page
2. `setCookies(cookies: Cookie[])` - Set cookies for the current page
3. `deleteCookies(cookieNames: string[])` - Delete cookies from the current page


## Chrome DevTools Protocol (CDP)

The service uses CDP for advanced browser control. When Chrome is started, it's launched with the following flags:

- `--remote-debugging-port=9222` - Enable CDP
- `--remote-debugging-address=0.0.0.0` - Allow remote connections
- `--no-first-run` - Skip first run prompts
- `--no-default-browser-check` - Skip default browser check
- `--disable-extensions` - Disable extensions for cleaner environment

## Configuration

The following environment variables can be used to configure the service:

- `CHROME_PATH` - Path to Chrome executable (default: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`)
- `CHROME_CDP_PORT` - CDP port (default: 9222)


## Usage

The service listens on port 3000 by default. You can use any MCP client to send requests.


## Architecture

- `src/index.ts` - Main MCP server implementation
- `src/browserTools.ts` - Browser tools implementation
- `dist/` - Built files

