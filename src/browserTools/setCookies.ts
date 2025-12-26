/*
 * @Author: shangwenhe shangwenhe@rongcloud.cn
 * @Date: 2025-12-26 14:16:16
 * @LastEditors: shangwenhe shangwenhe@rongcloud.cn
 * @LastEditTime: 2025-12-26 17:53:24
 * @FilePath: /mcp/src/browserTools/setCookies.ts
 * @Description: setCookies tool implementation
 */
import * as z from 'zod';
import chrome from 'chrome-remote-interface';
import { BrowserTool, getCdpPort } from './shared';

export const setCookiesTool: BrowserTool = {
  name: 'setCookies',
  schema: {
    title: 'Set Cookies',
    description: 'Set cookies for the current page',
    inputSchema: z.object({
      cookies: z.array(z.object({
        name: z.string(),
        value: z.string(),
        domain: z.string().optional(),
        path: z.string().optional()
      }))
    })
  },
  implementation: async ({ cookies }: { cookies: Array<{ name: string; value: string; domain?: string; path?: string }> }) => {
    try {
      console.log('Setting cookies:', cookies);
      const tabs = await chrome.List({ port: parseInt(getCdpPort()) });
      if (tabs.length === 0) {
        return { content: [{ type: 'text', text: 'No Chrome tabs found' }] };
      }
      const tab = tabs[0];
      const client = await chrome({ target: tab, port: parseInt(getCdpPort()) });
      await client.Page.enable();

      // Set each cookie
      for (const cookie of cookies) {
        await client.Network.setCookie(cookie);
      }

      await client.close();

      return { content: [{ type: 'text', text: 'Cookies set successfully' }] };
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('Error setting cookies:', errorMessage);
      return {
        content: [{ type: 'text', text: `Failed to set cookies: ${errorMessage}` }]
      };
    }
  }
};
