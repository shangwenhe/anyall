/*
 * @Author: shangwenhe shangwenhe@rongcloud.cn
 * @Date: 2025-12-26 14:16:16
 * @LastEditors: shangwenhe shangwenhe@rongcloud.cn
 * @LastEditTime: 2025-12-26 17:53:24
 * @FilePath: /mcp/src/browserTools/getPageScreenshot.ts
 * @Description: getPageScreenshot tool implementation
 */
import * as z from 'zod';
import chrome from 'chrome-remote-interface';
import { BrowserTool, getCdpPort } from './shared';

export const getPageScreenshotTool: BrowserTool = {
  name: 'getPageScreenshot',
  schema: {
    title: 'Get Page Screenshot',
    description: 'Get a screenshot of the current page',
    inputSchema: z.object({})
  },
  implementation: async () => {
    try {
      console.log('Getting page screenshot...');
      const tabs = await chrome.List({ port: parseInt(getCdpPort()) });
      if (tabs.length === 0) {
        return { content: [{ type: 'text', text: 'No Chrome tabs found' }] };
      }
      const tab = tabs[0];
      const client = await chrome({ target: tab, port: parseInt(getCdpPort()) });
      await client.Page.enable();

      // Capture the screenshot
      const { data } = await client.Page.captureScreenshot({
        format: 'png',
        quality: 100
      });

      await client.close();

      return { content: [{ type: 'base64image', text: `data:image/png;base64,${data}` }] };
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('Error getting page screenshot:', errorMessage);
      return {
        content: [{ type: 'text', text: `Failed to get page screenshot: ${errorMessage}` }]
      };
    }
  }
};
