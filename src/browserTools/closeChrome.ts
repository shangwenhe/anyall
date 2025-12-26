/*
 * @Author: shangwenhe shangwenhe@rongcloud.cn
 * @Date: 2025-12-26 14:16:16
 * @LastEditors: shangwenhe shangwenhe@rongcloud.cn
 * @LastEditTime: 2025-12-26 17:53:24
 * @FilePath: /mcp/src/browserTools/closeChrome.ts
 * @Description: closeChrome tool implementation
 */
import * as z from 'zod';
import { spawn } from 'child_process';
import { BrowserTool, getChromeProcess, setChromeProcess } from './shared';

export const closeChromeTool: BrowserTool = {
  name: 'closeChrome',
  schema: {
    title: 'Close Chrome Browser',
    description: 'Close all Chrome browser instances',
    inputSchema: z.object({})
  },
  implementation: async () => {
    try {
      if (getChromeProcess()) {
        console.log('Killing Chrome process...');
        // On macOS, we need to kill the process differently
        spawn('pkill', ['-f', 'mcp-chrome-tools'], {
          detached: true,
          stdio: 'ignore'
        });
        setChromeProcess(null);
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
};
