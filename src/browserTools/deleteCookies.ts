/*
 * @Author: shangwenhe shangwenhe@rongcloud.cn
 * @Date: 2025-12-26 14:16:16
 * @LastEditors: shangwenhe shangwenhe@rongcloud.cn
 * @LastEditTime: 2025-12-26 17:53:24
 * @FilePath: /mcp/src/browserTools/deleteCookies.ts
 * @Description: deleteCookies tool implementation
 */
import * as z from 'zod';
import chrome from 'chrome-remote-interface';
import { BrowserTool, getCdpPort } from './shared';

export const deleteCookiesTool: BrowserTool = {
  name: 'deleteCookies',
  schema: {
    title: 'Delete Cookies',
    description: 'Delete cookies from the current page',
    inputSchema: z.object({
      cookieNames: z.array(z.string()),
      tabId: z.string().optional() // Add tabId parameter, optional for backward compatibility
    })
  },
  implementation: async ({ cookieNames, tabId }) => {
    try {
      console.log('Deleting cookies:', cookieNames, ' tabId:', tabId);
      const tabs = await chrome.List({ port: parseInt(getCdpPort()) });
      if (tabs.length === 0) {
        return { content: [{ type: 'text', text: 'No Chrome tabs found' }] };
      }

      // Find the specified tab by tabId, or use the first tab if tabId is not provided
      const tab = tabId
        ? tabs.find(t => t.id === tabId || t.id?.includes(tabId)) // Match tabId or partial tabId
        : tabs[0];

      // Verify tab exists
      if (!tab) {
        return { content: [{ type: 'text', text: `Tab with id '${tabId}' not found` }] };
      }
      const client = await chrome({ target: tab, port: parseInt(getCdpPort()) });
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
};
