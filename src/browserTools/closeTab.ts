/*
 * @Author: shangwenhe shangwenhe@rongcloud.cn
 * @Date: 2025-12-26 14:16:16
 * @LastEditors: shangwenhe shangwenhe@rongcloud.cn
 * @LastEditTime: 2025-12-26 17:53:24
 * @FilePath: /mcp/src/browserTools/closeTab.ts
 * @Description: closeTab tool implementation
 */
import * as z from 'zod';
import chrome from 'chrome-remote-interface';
import { BrowserTool, getCdpPort } from './shared';

export const closeTabTool: BrowserTool = {
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
      const tabs = await chrome.List({ port: parseInt(getCdpPort()) });
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
};
