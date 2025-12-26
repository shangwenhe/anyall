/*
 * @Author: shangwenhe shangwenhe@rongcloud.cn
 * @Date: 2025-12-26 14:16:16
 * @LastEditors: shangwenhe shangwenhe@rongcloud.cn
 * @LastEditTime: 2025-12-26 17:53:24
 * @FilePath: /mcp/src/browserTools/getElementText.ts
 * @Description: getElementText tool implementation
 */
import * as z from 'zod';
import chrome from 'chrome-remote-interface';
import { BrowserTool, getCdpPort } from './shared';

export const getElementTextTool: BrowserTool = {
  name: 'getElementText',
  schema: {
    title: 'Get Element Text',
    description: 'Get text from a page element',
    inputSchema: z.object({
      selector: z.string()
    })
  },
  implementation: async ({ selector }) => {
    try {
      console.log('Getting element text:', selector);
      const tabs = await chrome.List({ port: parseInt(getCdpPort()) });
      if (tabs.length === 0) {
        return { content: [{ type: 'text', text: 'No Chrome tabs found' }] };
      }
      // Use the first tab
      const tab = tabs[0];
      const client = await chrome({ target: tab, port: parseInt(getCdpPort()) });
      await client.Page.enable();

      // Get the element text using JavaScript
      const { result } = await client.Runtime.evaluate({
        expression: `document.querySelector('${selector}').textContent`,
        returnByValue: true
      });
      await client.close();

      return { content: [{ type: 'text', text: result.value as string }] };
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('Error getting element text:', errorMessage);
      return {
        content: [{ type: 'text', text: `Failed to get element text: ${errorMessage}` }]
      };
    }
  }
};
