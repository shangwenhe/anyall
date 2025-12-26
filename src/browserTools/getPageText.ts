/*
 * @Author: shangwenhe shangwenhe@rongcloud.cn
 * @Date: 2025-12-26 14:16:16
 * @LastEditors: shangwenhe shangwenhe@rongcloud.cn
 * @LastEditTime: 2025-12-26 17:53:24
 * @FilePath: /mcp/src/browserTools/getPageText.ts
 * @Description: getPageText tool implementation
 */
import * as z from 'zod';
import chrome from 'chrome-remote-interface';
import { BrowserTool, getCdpPort } from './shared';

export const getPageTextTool: BrowserTool = {
  name: 'getPageText',
  schema: {
    title: 'Get Page Text',
    description: 'Get the plain text content of the current page',
    inputSchema: z.object({})
  },
  implementation: async () => {
    try {
      console.log('Getting page text...');
      const tabs = await chrome.List({ port: parseInt(getCdpPort()) });
      if (tabs.length === 0) {
        return { content: [{ type: 'text', text: 'No Chrome tabs found' }] };
      }
      const tab = tabs[0];
      const client = await chrome({ target: tab, port: parseInt(getCdpPort()) });
      await client.Page.enable();
      const { result } = await client.Runtime.evaluate({
        expression: 'document.body.innerText',
        returnByValue: true
      });
      await client.close();

      return { content: [{ type: 'text', text: result.value as string }] };
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('Error getting page text:', errorMessage);
      return {
        content: [{ type: 'text', text: `Failed to get page text: ${errorMessage}` }]
      };
    }
  }
};
