/*
 * @Author: shangwenhe shangwenhe@rongcloud.cn
 * @Date: 2025-12-26 14:16:16
 * @LastEditors: shangwenhe shangwenhe@rongcloud.cn
 * @LastEditTime: 2025-12-26 17:53:24
 * @FilePath: /mcp/src/browserTools/reload.ts
 * @Description: reload tool implementation
 */
import * as z from 'zod';
import chrome from 'chrome-remote-interface';
import { BrowserTool, getCdpPort } from './shared';

export const reloadTool: BrowserTool = {
  name: 'reload',
  schema: {
    title: 'Reload Page',
    description: 'Reload the current page in Chrome',
    inputSchema: z.object({})
  },
  implementation: async () => {
    try {
      console.log('Reloading current page...');
      const tabs = await chrome.List({ port: parseInt(getCdpPort()) });
      if (tabs.length === 0) {
        return { content: [{ type: 'text', text: 'No Chrome tabs found' }] };
      }
      // Use the first tab
      const tab = tabs[0];
      const client = await chrome({ target: tab, port: parseInt(getCdpPort()) });
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
};
