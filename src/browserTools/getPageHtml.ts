/*
 * @Author: shangwenhe shangwenhe@rongcloud.cn
 * @Date: 2025-12-26 14:16:16
 * @LastEditors: shangwenhe shangwenhe@rongcloud.cn
 * @LastEditTime: 2025-12-26 17:53:24
 * @FilePath: /mcp/src/browserTools/getPageHtml.ts
 * @Description: getPageHtml tool implementation
 */
import * as z from 'zod';
import chrome from 'chrome-remote-interface';
import { BrowserTool, getCdpPort } from './shared';

export const getPageHtmlTool: BrowserTool = {
  name: 'getPageHtml',
  schema: {
    title: 'Get Page HTML',
    description: 'Get the complete HTML of the current page',
    inputSchema: z.object({})
  },
  implementation: async () => {
    try {
      console.log('Getting page HTML...');
      const tabs = await chrome.List({ port: parseInt(getCdpPort()) });
      if (tabs.length === 0) {
        return { content: [{ type: 'text', text: 'No Chrome tabs found' }] };
      }
      const tab = tabs[0];
      const client = await chrome({ target: tab, port: parseInt(getCdpPort()) });
      await client.Page.enable();
      const { root } = await client.DOM.getDocument();
      const { outerHTML } = await client.DOM.getOuterHTML({ nodeId: root.nodeId });
      await client.close();

      return { content: [{ type: 'text', text: outerHTML }] };
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('Error getting page HTML:', errorMessage);
      return {
        content: [{ type: 'text', text: `Failed to get page HTML: ${errorMessage}` }]
      };
    }
  }
};
