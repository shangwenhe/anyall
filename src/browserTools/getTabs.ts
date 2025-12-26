/*
 * @Author: shangwenhe shangwenhe@rongcloud.cn
 * @Date: 2025-12-26 14:16:16
 * @LastEditors: shangwenhe shangwenhe@rongcloud.cn
 * @LastEditTime: 2025-12-26 17:53:24
 * @FilePath: /mcp/src/browserTools/getTabs.ts
 * @Description: getTabs tool implementation
 */
import * as z from 'zod';
import chrome from 'chrome-remote-interface';
import { BrowserTool, getCdpPort } from './shared';

export const getTabsTool: BrowserTool = {
  name: 'getTabs',
  schema: {
    title: 'Get Tabs',
    description: 'Get information about all open tabs',
    inputSchema: z.object({})
  },
  implementation: async () => {
    try {
      console.log('Getting tabs...');
      const tabs = await chrome.List({ port: parseInt(getCdpPort()) });
      if (tabs.length === 0) {
        return { content: [{ type: 'text', text: 'No Chrome tabs found' }] };
      }

      // Convert tabs to JSON string
      const tabsString = JSON.stringify(tabs, null, 2);
      return { content: [{ type: 'text', text: tabsString }] };
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('Error getting tabs:', errorMessage);
      return {
        content: [{ type: 'text', text: `Failed to get tabs: ${errorMessage}` }]
      };
    }
  }
};
