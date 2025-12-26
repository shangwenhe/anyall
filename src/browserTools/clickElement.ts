/*
 * @Author: shangwenhe shangwenhe@rongcloud.cn
 * @Date: 2025-12-26 14:16:16
 * @LastEditors: shangwenhe shangwenhe@rongcloud.cn
 * @LastEditTime: 2025-12-26 17:53:24
 * @FilePath: /mcp/src/browserTools/clickElement.ts
 * @Description: clickElement tool implementation
 */
import * as z from 'zod';
import chrome from 'chrome-remote-interface';
import { BrowserTool, getCdpPort } from './shared';

export const clickElementTool: BrowserTool = {
  name: 'clickElement',
  schema: {
    title: 'Click Element',
    description: 'Click a page element',
    inputSchema: z.object({
      selector: z.string()
    })
  },
  implementation: async ({ selector }) => {
    try {
      console.log('Clicking element:', selector);
      const tabs = await chrome.List({ port: parseInt(getCdpPort()) });
      if (tabs.length === 0) {
        return { content: [{ type: 'text', text: 'No Chrome tabs found' }] };
      }
      // Use the first tab
      const tab = tabs[0];
      const client = await chrome({ target: tab, port: parseInt(getCdpPort()) });
      await client.Page.enable();

      // Click the element using JavaScript
      await client.Runtime.evaluate({
        expression: `document.querySelector('${selector}').click()`,
        returnByValue: false
      });
      await client.close();

      return { content: [{ type: 'text', text: `Clicked element: ${selector}` }] };
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('Error clicking element:', errorMessage);
      return {
        content: [{ type: 'text', text: `Failed to click element: ${errorMessage}` }]
      };
    }
  }
};
