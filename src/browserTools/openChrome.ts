/*
 * @Author: shangwenhe shangwenhe@rongcloud.cn
 * @Date: 2025-12-26 14:16:16
 * @LastEditors: shangwenhe shangwenhe@rongcloud.cn
 * @LastEditTime: 2025-12-26 17:53:24
 * @FilePath: /mcp/src/browserTools/openChrome.ts
 * @Description: openChrome tool implementation
 */
import * as z from 'zod';
import { spawn, ChildProcess } from 'child_process';
import { BrowserTool, CHROME_PATH, getChromeProcess, setChromeProcess, setCdpPort } from './shared';

export const openChromeTool: BrowserTool = {
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
      if (getChromeProcess()) {
        console.log('Chrome is already running, opening new tab...');
        const newTabProcess = spawn(CHROME_PATH, ['--new-tab', url], {
          detached: true,
          stdio: 'ignore'
        }) as ChildProcess;
        newTabProcess.unref();

        return {
          content: [{ type: 'text', text: `New tab opened in existing Chrome process: ${url}` }]
        };
      }

      // Open new Chrome process with debugging enabled
      console.log('Opening new Chrome process with debugging enabled...');

      const process = spawn(CHROME_PATH, [
        `--tags=mcp-chrome-tools`,
        `--user-data-dir=/tmp/chrome_debug`, // Use a temporary user data directory
        `--remote-debugging-port=${port}`, // Enable CDP with custom port
        '--remote-debugging-address=0.0.0.0', // Allow remote connections
        '--no-first-run', // Skip first run prompts
        '--no-default-browser-check', // Skip default browser check
        '--disable-extensions', // Disable extensions for cleaner environment
        url // Initial URL
      ], {
        detached: true,
        stdio: 'ignore'
      }) as ChildProcess;

      process.unref();

      // Set up exit handler
      process.on('exit', () => {
        console.log('Chrome process exited');
        setChromeProcess(null);
      });

      // Update state with new process and port
      setChromeProcess(process);
      setCdpPort(port);

      return {
        content: [{ type: 'text', text: `Chrome opened successfully to: ${url} (CDP port: ${port})` }]
      };
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('Error opening Chrome:', errorMessage);
      return {
        content: [{ type: 'text', text: `Failed to open Chrome: ${errorMessage}` }]
      };
    }
  }
};
