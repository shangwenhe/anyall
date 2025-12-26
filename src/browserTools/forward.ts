/*
 * @Author: shangwenhe shangwenhe@rongcloud.cn
 * @Date: 2025-12-26 14:16:16
 * @LastEditors: shangwenhe shangwenhe@rongcloud.cn
 * @LastEditTime: 2025-12-26 17:53:24
 * @FilePath: /mcp/src/browserTools/forward.ts
 * @Description: forward tool implementation
 */
import * as z from 'zod';
import chrome from 'chrome-remote-interface';
import { BrowserTool, getCdpPort } from './shared';

export const forwardTool: BrowserTool = {
  name: 'forward',
  schema: {
    title: 'Go Forward',
    description: 'Navigate forward in Chrome history',
    inputSchema: z.object({})
  },
  implementation: async () => {
    try {
      console.log('Navigating forward...');
      const tabs = await chrome.List({ port: parseInt(getCdpPort()) });
      if (tabs.length === 0) {
        return { content: [{ type: 'text', text: 'No Chrome tabs found' }] };
      }
      const tab = tabs[0];
      const client = await chrome({ target: tab, port: parseInt(getCdpPort()) });
      await client.Page.enable();
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
};
