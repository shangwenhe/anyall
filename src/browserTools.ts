/*
 * @Author: shangwenhe shangwenhe@rongcloud.cn
 * @Date: 2025-12-26 14:16:16
 * @LastEditors: shangwenhe shangwenhe@rongcloud.cn
 * @LastEditTime: 2025-12-26 14:28:15
 * @FilePath: /mcp/src/tools.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { spawn, ChildProcess } from 'child_process';
import * as z from 'zod';

// Chrome browser path (Canary version)
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

// Keep track of Chrome processes
let chromeProcess: ChildProcess | null = null;

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
      description: 'Open Chrome browser to the specified URL',
      inputSchema: z.object({
        url: z.string().url({ message: 'Please provide a valid URL' }).default('about:blank')
      })
    },
    implementation: async ({ url }) => {
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

        // Open new Chrome process
        console.log('Opening new Chrome process...');
        chromeProcess = spawn(CHROME_PATH, [url], {
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
          content: [{ type: 'text', text: `Chrome opened successfully to: ${url}` }]
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
          spawn('pkill', ['-f', 'Google Chrome Canary'], {
            detached: true,
            stdio: 'ignore'
          });
          chromeProcess = null;
        } else {
          // Try to close any Chrome Canary instances
          console.log('Closing all Chrome Canary instances...');
          spawn('pkill', ['-f', 'Google Chrome Canary'], {
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
  }
];


