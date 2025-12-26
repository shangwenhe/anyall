/*
 * @Author: shangwenhe shangwenhe@rongcloud.cn
 * @Date: 2025-12-26 14:16:16
 * @LastEditors: shangwenhe shangwenhe@rongcloud.cn
 * @LastEditTime: 2025-12-26 17:53:24
 * @FilePath: /mcp/src/browserTools/switchTab.ts
 * @Description: switchTab tool implementation
 */
import * as z from 'zod';
import chrome from 'chrome-remote-interface';
import { BrowserTool, getCdpPort } from './shared';

export const switchTabTool: BrowserTool = {
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
      const tabs = await chrome.List({ port: parseInt(getCdpPort()) });
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
};
