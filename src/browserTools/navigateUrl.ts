/*
 * @Author: shangwenhe shangwenhe@rongcloud.cn
 * @Date: 2025-12-26 14:16:16
 * @LastEditors: shangwenhe shangwenhe@rongcloud.cn
 * @LastEditTime: 2025-12-26 17:53:24
 * @FilePath: /mcp/src/browserTools/navigateUrl.ts
 * @Description: navigateUrl tool implementation
 */
import * as z from 'zod';
import { spawn, ChildProcess } from 'child_process';
import { BrowserTool, CHROME_PATH } from './shared';

export const navigateUrlTool: BrowserTool = {
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
      }) as ChildProcess;

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
};
