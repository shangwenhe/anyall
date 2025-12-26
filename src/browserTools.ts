/*
 * @Author: shangwenhe shangwenhe@rongcloud.cn
 * @Date: 2025-12-26 14:16:16
 * @LastEditors: shangwenhe shangwenhe@rongcloud.cn
 * @LastEditTime: 2025-12-26 17:53:24
 * @FilePath: /mcp/src/browserTools.ts
 * @Description: Chrome Browser Controller MCP Service
 */
import { spawn, ChildProcess } from 'child_process';
import * as z from 'zod';
import chrome from 'chrome-remote-interface'; // Chrome DevTools Protocol (CDP) client

// Chrome browser path
const CHROME_PATH = '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary';

// Keep track of Chrome processes and CDP port
let chromeProcess: ChildProcess | null = null;
let currentCdpPort: string = '9222';

// Define tool type for type safety
type BrowserTool<T extends z.ZodType<any, any>> = {
  name: string;
  schema: {
    title: string;
    description: string;
    inputSchema: T;
  };
  implementation: (input: z.infer<T>) => Promise<{ content: Array<{ type: string; text: string }> }>;
};

// Define tools data array
export const browserTools: BrowserTool<any>[] = [
  // openChrome tool configuration
  {
    name: 'openChrome',
    schema: {
      title: 'Open Chrome Browser',
      description: 'Open Chrome browser with Chrome DevTools Protocol (CDP) enabled. You can specify a custom CDP port.',
      inputSchema: z.object({
        url: z.string().url({ message: 'Please provide a valid URL' }).default('about:blank'),
        port: z.string().default('9222') // Allow custom CDP port
      })
    },
    implementation: async ({ url, port }) => {
      try {
        if (chromeProcess) {
          console.log('Chrome is already running, opening new tab...');
          const newTabProcess = spawn(CHROME_PATH, ['--new-tab', url], {
            detached: true,
            stdio: 'ignore'
          });
          newTabProcess.unref();

          return {
            content: [{ type: 'text', text: `New tab opened in existing Chrome process: ${url}` }]
          };
        }

        // Open new Chrome process with debugging enabled
        console.log('Opening new Chrome process with debugging enabled...');
        currentCdpPort = port; // Update current CDP port
        chromeProcess = spawn(CHROME_PATH, [
          `--tags=mcp-chrome-tools`,
          `--user-data-dir=/tmp/chrome_debug`, // Use a temporary user data directory
          `--remote-debugging-port=${currentCdpPort}`, // Enable CDP with custom port
          '--remote-debugging-address=0.0.0.0', // Allow remote connections
          '--no-first-run', // Skip first run prompts
          '--no-default-browser-check', // Skip default browser check
          '--disable-extensions', // Disable extensions for cleaner environment
          url // Initial URL
        ], {
          detached: true,
          stdio: 'ignore'
        });

        chromeProcess.unref();

        // Set up exit handler
        chromeProcess.on('exit', () => {
          console.log('Chrome process exited');
          chromeProcess = null;
        });

        return {
          content: [{ type: 'text', text: `Chrome opened successfully to: ${url} (CDP port: ${currentCdpPort})` }]
        };
      } catch (error) {
        const errorMessage = (error as Error).message;
        console.error('Error opening Chrome:', errorMessage);
        return {
          content: [{ type: 'text', text: `Failed to open Chrome: ${errorMessage}` }]
        };
      }
    }
  },

  // getCdpPort tool configuration
  {
    name: 'getCdpPort',
    schema: {
      title: 'Get CDP Port',
      description: 'Get the current Chrome DevTools Protocol (CDP) port',
      inputSchema: z.object({})
    },
    implementation: async () => {
      try {
        return {
          content: [{ type: 'text', text: currentCdpPort }]
        };
      } catch (error) {
        const errorMessage = (error as Error).message;
        console.error('Error getting CDP port:', errorMessage);
        return {
          content: [{ type: 'text', text: `Failed to get CDP port: ${errorMessage}` }]
        };
      }
    }
  },

  // closeChrome tool configuration
  {
    name: 'closeChrome',
    schema: {
      title: 'Close Chrome Browser',
      description: 'Close all Chrome browser instances',
      inputSchema: z.object({})
    },
    implementation: async () => {
      try {
        if (chromeProcess) {
          console.log('Killing Chrome process...');
          // On macOS, we need to kill the process differently
          spawn('pkill', ['-f', 'mcp-chrome-tools'], {
            detached: true,
            stdio: 'ignore'
          });
          chromeProcess = null;
        } else {
          // Try to close any Chrome instances
          console.log('Closing all Chrome instances...');
          spawn('pkill', ['-f', 'mcp-chrome-tools'], {
            detached: true,
            stdio: 'ignore'
          });
        }

        return {
          content: [{ type: 'text', text: 'All Chrome instances closed successfully' }]
        };
      } catch (error) {
        const errorMessage = (error as Error).message;
        console.error('Error closing Chrome:', errorMessage);
        return {
          content: [{ type: 'text', text: `Failed to close Chrome: ${errorMessage}` }]
        };
      }
    }
  },

  // navigateUrl tool configuration
  {
    name: 'navigateUrl',
    schema: {
      title: 'Navigate to URL',
      description: 'Open a new tab in Chrome with the specified URL',
      inputSchema: z.object({
        url: z.string().url({ message: 'Please provide a valid URL' })
      })
    },
    implementation: async ({ url }) => {
      try {
        console.log('Navigating to URL:', url);

        // Open new tab with the URL (this works reliably on macOS)
        const tabProcess = spawn(CHROME_PATH, ['--new-tab', url], {
          detached: true,
          stdio: 'ignore'
        });

        tabProcess.unref();

        return {
          content: [{ type: 'text', text: `URL opened in new tab: ${url}` }]
        };
      } catch (error) {
        const errorMessage = (error as Error).message;
        console.error('Error navigating URL:', errorMessage);
        return {
          content: [{ type: 'text', text: `Failed to navigate URL: ${errorMessage}` }]
        };
      }
    }
  },
  // reload tool configuration
  {
    name: 'reload',
    schema: {
      title: 'Reload Page',
      description: 'Reload the current page in Chrome',
      inputSchema: z.object({})
    },
    implementation: async () => {
      try {
        console.log('Reloading current page...');
        const tabs = await chrome.List({ port: parseInt(currentCdpPort) });
        if (tabs.length === 0) {
          return { content: [{ type: 'text', text: 'No Chrome tabs found' }] };
        }
        // Use the first tab
        const tab = tabs[0];
        const client = await chrome({ target: tab, port: parseInt(currentCdpPort) });
        await client.Page.enable();
        await client.Page.reload();
        await client.close();

        return { content: [{ type: 'text', text: 'Page reloaded successfully' }] };
      } catch (error) {
        const errorMessage = (error as Error).message;
        console.error('Error reloading page:', errorMessage);
        return {
          content: [{ type: 'text', text: `Failed to reload page: ${errorMessage}` }]
        };
      }
    }
  },

  // back tool configuration
  {
    name: 'back',
    schema: {
      title: 'Go Back',
      description: 'Navigate back in Chrome history',
      inputSchema: z.object({})
    },
    implementation: async () => {
      try {
        console.log('Navigating back...');
        const tabs = await chrome.List({ port: parseInt(currentCdpPort) });
        if (tabs.length === 0) {
          return { content: [{ type: 'text', text: 'No Chrome tabs found' }] };
        }
        // Use the first tab
        const tab = tabs[0];
        const client = await chrome({ target: tab, port: parseInt(currentCdpPort) });
        await client.Page.enable();
        // Navigate back in Chrome history using JavaScript
        await client.Runtime.evaluate({
          expression: 'window.history.back()',
          returnByValue: false
        });
        await client.close();

        return { content: [{ type: 'text', text: 'Navigated back successfully' }] };
      } catch (error) {
        const errorMessage = (error as Error).message;
        console.error('Error navigating back:', errorMessage);
        return {
          content: [{ type: 'text', text: `Failed to navigate back: ${errorMessage}` }]
        };
      }
    }
  },

  // forward tool configuration
  {
    name: 'forward',
    schema: {
      title: 'Go Forward',
      description: 'Navigate forward in Chrome history',
      inputSchema: z.object({})
    },
    implementation: async () => {
      try {
        console.log('Navigating forward...');
        const tabs = await chrome.List({ port: parseInt(currentCdpPort) });
        if (tabs.length === 0) {
          return { content: [{ type: 'text', text: 'No Chrome tabs found' }] };
        }
        // Use the first tab
        const tab = tabs[0];
        const client = await chrome({ target: tab, port: parseInt(currentCdpPort) });
        await client.Page.enable();
        // Navigate forward in Chrome history using JavaScript
        await client.Runtime.evaluate({
          expression: 'window.history.forward()',
          returnByValue: false
        });
        await client.close();

        return { content: [{ type: 'text', text: 'Navigated forward successfully' }] };
      } catch (error) {
        const errorMessage = (error as Error).message;
        console.error('Error navigating forward:', errorMessage);
        return {
          content: [{ type: 'text', text: `Failed to navigate forward: ${errorMessage}` }]
        };
      }
    }
  },

  // getPageHtml tool configuration
  {
    name: 'getPageHtml',
    schema: {
      title: 'Get Page HTML',
      description: 'Get the complete HTML of the current page',
      inputSchema: z.object({})
    },
    implementation: async () => {
      try {
        console.log('Getting page HTML...');
        const tabs = await chrome.List({ port: parseInt(currentCdpPort) });
        if (tabs.length === 0) {
          return { content: [{ type: 'text', text: 'No Chrome tabs found' }] };
        }
        // Use the first tab
        const tab = tabs[0];
        const client = await chrome({ target: tab, port: parseInt(currentCdpPort) });
        await client.Page.enable();
        const { root } = await client.DOM.getDocument();
        const { outerHTML } = await client.DOM.getOuterHTML({ nodeId: root.nodeId });
        await client.close();

        return { content: [{ type: 'text', text: outerHTML }] };
      } catch (error) {
        const errorMessage = (error as Error).message;
        console.error('Error getting page HTML:', errorMessage);
        return {
          content: [{ type: 'text', text: `Failed to get page HTML: ${errorMessage}` }]
        };
      }
    }
  },

  // getPageText tool configuration
  {
    name: 'getPageText',
    schema: {
      title: 'Get Page Text',
      description: 'Get the plain text content of the current page',
      inputSchema: z.object({})
    },
    implementation: async () => {
      try {
        console.log('Getting page text...');
        const tabs = await chrome.List({ port: parseInt(currentCdpPort) });
        if (tabs.length === 0) {
          return { content: [{ type: 'text', text: 'No Chrome tabs found' }] };
        }
        // Use the first tab
        const tab = tabs[0];
        const client = await chrome({ target: tab, port: parseInt(currentCdpPort) });
        await client.Page.enable();

        // Execute JavaScript to get the page text
        const { result } = await client.Runtime.evaluate({
          expression: 'document.body.innerText',
          returnByValue: true
        });
        await client.close();

        return { content: [{ type: 'text', text: result.value as string }] };
      } catch (error) {
        const errorMessage = (error as Error).message;
        console.error('Error getting page text:', errorMessage);
        return {
          content: [{ type: 'text', text: `Failed to get page text: ${errorMessage}` }]
        };
      }
    }
  },

  // executeJavaScript tool configuration
  {
    name: 'executeJavaScript',
    schema: {
      title: 'Execute JavaScript',
      description: 'Execute JavaScript code in the current page context',
      inputSchema: z.object({
        code: z.string().min(1, { message: 'JavaScript code is required' })
      })
    },
    implementation: async ({ code }) => {
      try {
        console.log('Executing JavaScript:', code);
        const tabs = await chrome.List({ port: parseInt(currentCdpPort) });
        if (tabs.length === 0) {
          return { content: [{ type: 'text', text: 'No Chrome tabs found' }] };
        }
        // Use the first tab
        const tab = tabs[0];
        const client = await chrome({ target: tab, port: parseInt(currentCdpPort) });
        await client.Page.enable();

        // Execute the JavaScript code
        const { result } = await client.Runtime.evaluate({
          expression: code,
          returnByValue: true
        });

        await client.close();

        // Convert the result to a string
        const resultString = JSON.stringify(result.value);
        return { content: [{ type: 'text', text: resultString }] };
      } catch (error) {
        const errorMessage = (error as Error).message;
        console.error('Error executing JavaScript:', errorMessage);
        return {
          content: [{ type: 'text', text: `Failed to execute JavaScript: ${errorMessage}` }]
        };
      }
    }
  },

  // resetSession tool configuration
  {
    name: 'resetSession',
    schema: {
      title: 'Reset Session',
      description: 'Reset the Chrome browser session',
      inputSchema: z.object({})
    },
    implementation: async () => {
      try {
        console.log('Resetting session...');
        // Close all Chrome instances first
        spawn('pkill', ['-f', 'Google Chrome'], {
          detached: true,
          stdio: 'ignore'
        });

        chromeProcess = null;

        // Reopen Chrome with a clean session
        setTimeout(() => {
          spawn(CHROME_PATH, ['--incognito', 'about:blank'], {
            detached: true,
            stdio: 'ignore'
          });
        }, 1000);

        return {
          content: [{ type: 'text', text: 'Chrome session reset successfully' }]
        };
      } catch (error) {
        const errorMessage = (error as Error).message;
        console.error('Error resetting session:', errorMessage);
        return {
          content: [{ type: 'text', text: `Failed to reset session: ${errorMessage}` }]
        };
      }
    }
  },

  // setCookies tool configuration
  {
    name: 'setCookies',
    schema: {
      title: 'Set Cookies',
      description: 'Set cookies for the current page',
      inputSchema: z.object({
        cookies: z.array(z.object({
          name: z.string(),
          value: z.string(),
          domain: z.string().optional(),
          path: z.string().optional()
        }))
      })
    },
    implementation: async ({ cookies }) => {
      try {
        console.log('Setting cookies:', cookies);
        const tabs = await chrome.List({ port: parseInt(currentCdpPort) });
        if (tabs.length === 0) {
          return { content: [{ type: 'text', text: 'No Chrome tabs found' }] };
        }
        // Use the first tab
        const tab = tabs[0];
        const client = await chrome({ target: tab, port: parseInt(currentCdpPort) });
        await client.Page.enable();

        // Set each cookie
        for (const cookie of cookies) {
          await client.Network.setCookie(cookie);
        }

        await client.close();

        return { content: [{ type: 'text', text: 'Cookies set successfully' }] };
      } catch (error) {
        const errorMessage = (error as Error).message;
        console.error('Error setting cookies:', errorMessage);
        return {
          content: [{ type: 'text', text: `Failed to set cookies: ${errorMessage}` }]
        };
      }
    }
  },

  // deleteCookies tool configuration
  {
    name: 'deleteCookies',
    schema: {
      title: 'Delete Cookies',
      description: 'Delete cookies from the current page',
      inputSchema: z.object({
        cookieNames: z.array(z.string())
      })
    },
    implementation: async ({ cookieNames }) => {
      try {
        console.log('Deleting cookies:', cookieNames);
        const tabs = await chrome.List({ port: parseInt(currentCdpPort) });
        if (tabs.length === 0) {
          return { content: [{ type: 'text', text: 'No Chrome tabs found' }] };
        }
        // Use the first tab
        const tab = tabs[0];
        const client = await chrome({ target: tab, port: parseInt(currentCdpPort) });
        await client.Page.enable();

        // Delete each cookie by name
        for (const name of cookieNames) {
          await client.Network.deleteCookies({ name });
        }

        await client.close();

        return { content: [{ type: 'text', text: 'Cookies deleted successfully' }] };
      } catch (error) {
        const errorMessage = (error as Error).message;
        console.error('Error deleting cookies:', errorMessage);
        return {
          content: [{ type: 'text', text: `Failed to delete cookies: ${errorMessage}` }]
        };
      }
    }
  },
  // getBrowserStatus tool configuration
  {
    name: 'getBrowserStatus',
    schema: {
      title: 'Get Browser Status',
      description: 'Get the current status of the Chrome browser',
      inputSchema: z.object({})
    },
    implementation: async () => {
      try {
        console.log('Getting browser status...');

        // 查询所有进程是否有  mcp-chrome-tools 的字样，如果有则把进程号返回。
        const { spawnSync } = require('child_process');
        const psResult = spawnSync('ps', ['aux']);
        const output = psResult.stdout.toString();
        const chromePids: string[] = [];

        // 解析输出，提取进程号
        output.split('\n').forEach((line: string) => {
          if (line.includes('mcp-chrome-tools') && !line.includes('grep')) {
            const parts = line.split(/\s+/);
            if (parts[1]) {
              chromePids.push(parts[1]);
            }
          }
        });

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              running: chromePids.length > 0,
              processIds: chromePids,
              mainProcessId: chromeProcess?.pid || null
            }, null, 2)
          }]
        };
      } catch (error) {
        const errorMessage = (error as Error).message;
        console.error('Error getting browser status:', errorMessage);
        return {
          content: [{ type: 'text', text: `Failed to get browser status: ${errorMessage}` }]
        };
      }
    }
  },
  {
    name: 'getPageScreenshot',
    schema: {
      title: 'Get Page Screenshot',
      description: 'Get a screenshot of the current page',
      inputSchema: z.object({})
    },
    implementation: async () => {
      try {
        console.log('Getting page screenshot...');
        const tabs = await chrome.List({ port: parseInt(currentCdpPort) });
        if (tabs.length === 0) {
          return { content: [{ type: 'text', text: 'No Chrome tabs found' }] };
        }
        // Use the first tab
        const tab = tabs[0];
        const client = await chrome({ target: tab, port: parseInt(currentCdpPort) });
        await client.Page.enable();

        // Capture the screenshot
        const { data } = await client.Page.captureScreenshot({
          format: 'png',
          quality: 100
        });

        await client.close();

        return { content: [{ type: 'base64image', text: `data:image/png;base64,${data}` }] };
      } catch (error) {
        const errorMessage = (error as Error).message;
        console.error('Error getting page screenshot:', errorMessage);
        return {
          content: [{ type: 'text', text: `Failed to get page screenshot: ${errorMessage}` }]
        };
      }
    }
  },

  // getTabs tool configuration
  {
    name: 'getTabs',
    schema: {
      title: 'Get Tabs',
      description: 'Get information about all open tabs',
      inputSchema: z.object({})
    },
    implementation: async () => {
      try {
        console.log('Getting tabs...');
        const tabs = await chrome.List({ port: parseInt(currentCdpPort) });
        if (tabs.length === 0) {
          return { content: [{ type: 'text', text: 'No Chrome tabs found' }] };
        }

        // Convert tabs to JSON string
        const tabsString = JSON.stringify(tabs, null, 2);
        return { content: [{ type: 'text', text: tabsString }] };
      } catch (error) {
        const errorMessage = (error as Error).message;
        console.error('Error getting tabs:', errorMessage);
        return {
          content: [{ type: 'text', text: `Failed to get tabs: ${errorMessage}` }]
        };
      }
    }
  },

  // switchTab tool configuration
  {
    name: 'switchTab',
    schema: {
      title: 'Switch Tab',
      description: 'Switch to the specified tab',
      inputSchema: z.object({
        tabId: z.string()
      })
    },
    implementation: async ({ tabId }) => {
      try {
        console.log('Switching to tab:', tabId);
        const tabs = await chrome.List({ port: parseInt(currentCdpPort) });
        if (tabs.length === 0) {
          return { content: [{ type: 'text', text: 'No Chrome tabs found' }] };
        }

        // Find the tab with the given id
        const targetTab = tabs.find(tab => tab.id === tabId);
        if (!targetTab) {
          return { content: [{ type: 'text', text: `Tab with id ${tabId} not found` }] };
        }

        // Switch to the tab
        const client = await chrome({ target: targetTab });
        // There's no direct CDP command to switch tabs, but activating the target will switch to it
        await client.Page.enable();
        await client.close();

        return { content: [{ type: 'text', text: `Switched to tab ${tabId} successfully` }] };
      } catch (error) {
        const errorMessage = (error as Error).message;
        console.error('Error switching tab:', errorMessage);
        return {
          content: [{ type: 'text', text: `Failed to switch tab: ${errorMessage}` }]
        };
      }
    }
  },

  // closeTab tool configuration
  {
    name: 'closeTab',
    schema: {
      title: 'Close Tab',
      description: 'Close the specified tab',
      inputSchema: z.object({
        tabId: z.string().optional()
      })
    },
    implementation: async ({ tabId }) => {
      try {
        console.log('Closing tab:', tabId);
        const tabs = await chrome.List({ port: parseInt(currentCdpPort) });
        if (tabs.length === 0) {
          return { content: [{ type: 'text', text: 'No Chrome tabs found' }] };
        }

        if (tabId) {
          // Find the tab with the given id
          const targetTab = tabs.find(tab => tab.id === tabId);
          if (!targetTab) {
            return { content: [{ type: 'text', text: `Tab with id ${tabId} not found` }] };
          }

          // Close the specific tab
          const client = await chrome({ target: targetTab });
          await client.Target.closeTarget({ targetId: targetTab.id });
          await client.close();
        } else {
          // Close the first tab if no tabId provided
          const firstTab = tabs[0];
          const client = await chrome({ target: firstTab });
          await client.Target.closeTarget({ targetId: firstTab.id });
          await client.close();
        }

        return { content: [{ type: 'text', text: 'Tab closed successfully' }] };
      } catch (error) {
        const errorMessage = (error as Error).message;
        console.error('Error closing tab:', errorMessage);
        return {
          content: [{ type: 'text', text: `Failed to close tab: ${errorMessage}` }]
        };
      }
    }
  },

  // clickElement tool configuration
  {
    name: 'clickElement',
    schema: {
      title: 'Click Element',
      description: 'Click a page element',
      inputSchema: z.object({
        selector: z.string()
      })
    },
    implementation: async ({ selector }) => {
      try {
        console.log('Clicking element:', selector);
        const tabs = await chrome.List({ port: parseInt(currentCdpPort) });
        if (tabs.length === 0) {
          return { content: [{ type: 'text', text: 'No Chrome tabs found' }] };
        }
        // Use the first tab
        const tab = tabs[0];
        const client = await chrome({ target: tab, port: parseInt(currentCdpPort) });
        await client.Page.enable();

        // Click the element using JavaScript
        await client.Runtime.evaluate({
          expression: `document.querySelector('${selector}').click()`,
          returnByValue: false
        });
        await client.close();

        return { content: [{ type: 'text', text: `Clicked element: ${selector}` }] };
      } catch (error) {
        const errorMessage = (error as Error).message;
        console.error('Error clicking element:', errorMessage);
        return {
          content: [{ type: 'text', text: `Failed to click element: ${errorMessage}` }]
        };
      }
    }
  },

  // inputText tool configuration
  {
    name: 'inputText',
    schema: {
      title: 'Input Text',
      description: 'Input text into a page element',
      inputSchema: z.object({
        selector: z.string(),
        text: z.string()
      })
    },
    implementation: async ({ selector, text }) => {
      try {
        console.log('Inputting text into element:', selector, ' text:', text);
        const tabs = await chrome.List({ port: parseInt(currentCdpPort) });
        if (tabs.length === 0) {
          return { content: [{ type: 'text', text: 'No Chrome tabs found' }] };
        }
        // Use the first tab
        const tab = tabs[0];
        const client = await chrome({ target: tab, port: parseInt(currentCdpPort) });
        await client.Page.enable();

        // Escape the text to prevent JavaScript injection
        const escapedText = JSON.stringify(text);

        // Input the text into the element using JavaScript
        await client.Runtime.evaluate({
          expression: `document.querySelector('${selector}').value = ${escapedText}`,
          returnByValue: false
        });
        await client.close();

        return { content: [{ type: 'text', text: `Input text into element: ${selector}` }] };
      } catch (error) {
        const errorMessage = (error as Error).message;
        console.error('Error inputting text:', errorMessage);
        return {
          content: [{ type: 'text', text: `Failed to input text: ${errorMessage}` }]
        };
      }
    }
  },

  // getElementText tool configuration
  {
    name: 'getElementText',
    schema: {
      title: 'Get Element Text',
      description: 'Get text from a page element',
      inputSchema: z.object({
        selector: z.string()
      })
    },
    implementation: async ({ selector }) => {
      try {
        console.log('Getting element text:', selector);
        const tabs = await chrome.List({ port: parseInt(currentCdpPort) });
        if (tabs.length === 0) {
          return { content: [{ type: 'text', text: 'No Chrome tabs found' }] };
        }
        // Use the first tab
        const tab = tabs[0];
        const client = await chrome({ target: tab, port: parseInt(currentCdpPort) });
        await client.Page.enable();

        // Get the element text using JavaScript
        const { result } = await client.Runtime.evaluate({
          expression: `document.querySelector('${selector}').textContent`,
          returnByValue: true
        });
        await client.close();

        return { content: [{ type: 'text', text: result.value as string }] };
      } catch (error) {
        const errorMessage = (error as Error).message;
        console.error('Error getting element text:', errorMessage);
        return {
          content: [{ type: 'text', text: `Failed to get element text: ${errorMessage}` }]
        };
      }
    }
  },

  // getElementAttribute tool configuration
  {
    name: 'getElementAttribute',
    schema: {
      title: 'Get Element Attribute',
      description: 'Get attribute from a page element',
      inputSchema: z.object({
        selector: z.string(),
        attributeName: z.string()
      })
    },
    implementation: async ({ selector, attributeName }) => {
      try {
        console.log('Getting element attribute:', selector, ' attribute:', attributeName);
        const tabs = await chrome.List({ port: parseInt(currentCdpPort) });
        if (tabs.length === 0) {
          return { content: [{ type: 'text', text: 'No Chrome tabs found' }] };
        }
        // Use the first tab
        const tab = tabs[0];
        const client = await chrome({ target: tab, port: parseInt(currentCdpPort) });
        await client.Page.enable();

        // Get the element attribute using JavaScript
        const { result } = await client.Runtime.evaluate({
          expression: `document.querySelector('${selector}').getAttribute('${attributeName}')`,
          returnByValue: true
        });
        await client.close();

        return { content: [{ type: 'text', text: result.value as string }] };
      } catch (error) {
        const errorMessage = (error as Error).message;
        console.error('Error getting element attribute:', errorMessage);
        return {
          content: [{ type: 'text', text: `Failed to get element attribute: ${errorMessage}` }]
        };
      }
    }
  }
];


