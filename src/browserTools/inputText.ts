/*
 * @Author: shangwenhe shangwenhe@rongcloud.cn
 * @Date: 2025-12-26 14:16:16
 * @LastEditors: shangwenhe shangwenhe@rongcloud.cn
 * @LastEditTime: 2025-12-26 17:53:24
 * @FilePath: /mcp/src/browserTools/inputText.ts
 * @Description: inputText tool implementation
 */
import * as z from 'zod';
import chrome from 'chrome-remote-interface';
import { BrowserTool, getCdpPort } from './shared';

export const inputTextTool: BrowserTool = {
  name: 'inputText',
  schema: {
    title: 'Input Text',
    description: 'Input text into a page element',
    inputSchema: z.object({
      selector: z.string(),
      text: z.string()
    })
  },
  implementation: async ({ selector, text }) => {
    try {
      console.log('Inputting text into element:', selector, ' text:', text);
      const tabs = await chrome.List({ port: parseInt(getCdpPort()) });
      if (tabs.length === 0) {
        return { content: [{ type: 'text', text: 'No Chrome tabs found' }] };
      }
      // Use the first tab
      const tab = tabs[0];
      const client = await chrome({ target: tab, port: parseInt(getCdpPort()) });
      await client.Page.enable();

      // Escape the text to prevent JavaScript injection
      const escapedText = JSON.stringify(text);

      // Input the text into the element using JavaScript
      await client.Runtime.evaluate({
        expression: `document.querySelector('${selector}').value = ${escapedText}`,
        returnByValue: false
      });
      await client.close();

      return { content: [{ type: 'text', text: `Input text into element: ${selector}` }] };
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('Error inputting text:', errorMessage);
      return {
        content: [{ type: 'text', text: `Failed to input text: ${errorMessage}` }]
      };
    }
  }
};
