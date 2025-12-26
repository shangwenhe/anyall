/*
 * @Author: shangwenhe shangwenhe@rongcloud.cn
 * @Date: 2025-12-26 14:16:16
 * @LastEditors: shangwenhe shangwenhe@rongcloud.cn
 * @LastEditTime: 2025-12-26 17:53:24
 * @FilePath: /mcp/src/browserTools/resetSession.ts
 * @Description: resetSession tool implementation
 */
import * as z from 'zod';
import { spawn } from 'child_process';
import { BrowserTool, CHROME_PATH, getCdpPort, setChromeProcess } from './shared';

export const resetSessionTool: BrowserTool = {
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

      setChromeProcess(null);

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
};
