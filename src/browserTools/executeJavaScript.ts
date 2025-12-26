/*
 * @Author: shangwenhe shangwenhe@rongcloud.cn
 * @Date: 2025-12-26 14:16:16
 * @LastEditors: shangwenhe shangwenhe@rongcloud.cn
 * @LastEditTime: 2025-12-26 17:53:24
 * @FilePath: /mcp/src/browserTools/executeJavaScript.ts
 * @Description: executeJavaScript tool implementation
 */
import * as z from 'zod';
import chrome from 'chrome-remote-interface';
import { BrowserTool, getCdpPort } from './shared';

export const executeJavaScriptTool: BrowserTool = {
  name: 'executeJavaScript',
  schema: {
    title: 'Execute JavaScript',
    description: 'Execute JavaScript code in the current page context',
    inputSchema: z.object({
      code: z.string().min(1, { message: 'JavaScript code is required' })
    })
  },
  implementation: async ({ code }: { code: string }) => {
    try {
      console.log('Executing JavaScript:', code);
      const tabs = await chrome.List({ port: parseInt(getCdpPort()) });
      if (tabs.length === 0) {
        return { content: [{ type: 'text', text: 'No Chrome tabs found' }] };
      }
      const tab = tabs[0];
      const client = await chrome({ target: tab, port: parseInt(getCdpPort()) });
      await client.Page.enable();
      const { result } = await client.Runtime.evaluate({
        expression: code,
        returnByValue: true
      });
      await client.close();

      const resultString = JSON.stringify(result.value);
      return { content: [{ type: 'text', text: resultString }] };
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('Error executing JavaScript:', errorMessage);
      return {
        content: [{ type: 'text', text: `Failed to execute JavaScript: ${errorMessage}` }]
      };
    }
  }
};
