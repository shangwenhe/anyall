/*
 * @Author: shangwenhe shangwenhe@rongcloud.cn
 * @Date: 2025-12-26 14:16:16
 * @LastEditors: shangwenhe shangwenhe@rongcloud.cn
 * @LastEditTime: 2025-12-26 17:53:24
 * @FilePath: /mcp/src/browserTools/navigateUrl.ts
 * @Description: navigateUrl tool implementation
 */
import * as z from 'zod';
import { spawn, ChildProcess } from 'child_process';
import chrome from 'chrome-remote-interface';
import { BrowserTool, CHROME_PATH, getCdpPort } from './shared';

export const navigateUrlTool: BrowserTool = {
  name: 'navigateUrl',
  schema: {
    title: 'Navigate to URL',
    description: 'Open a new tab in Chrome with the specified URL or navigate in existing tab if tabId provided',
    inputSchema: z.object({
      url: z.string().url({ message: 'Please provide a valid URL' }),
      tabId: z.string().optional() // Add tabId parameter, optional for backward compatibility
    })
  },
  implementation: async ({ url, tabId }) => {
    try {
      if (tabId) {
        // Navigate in existing tab using CDP if tabId provided
        console.log('Navigating to URL in existing tab:', url, ' tabId:', tabId);
        const tabs = await chrome.List({ port: parseInt(getCdpPort()) });
        
        // Find the specified tab by tabId
        const tab = tabs.find(t => t.id === tabId || t.id?.includes(tabId));
        
        if (!tab) {
          return { content: [{ type: 'text', text: `Tab with id '${tabId}' not found` }] };
        }

        const client = await chrome({ target: tab, port: parseInt(getCdpPort()) });
        await client.Page.enable();
        await client.Page.navigate({ url });
        await client.close();

        return { content: [{ type: 'text', text: `URL navigated successfully in tab: ${tab.id}` }] };
      } else {
        // Open new tab with the URL (original behavior)
        console.log('Opening URL in new tab:', url);

        const tabProcess = spawn(CHROME_PATH, ['--new-tab', url], {
          detached: true,
          stdio: 'ignore'
        }) as ChildProcess;

        tabProcess.unref();

        return {
          content: [{ type: 'text', text: `URL opened in new tab: ${url}` }]
        };
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('Error navigating URL:', errorMessage);
      return {
        content: [{ type: 'text', text: `Failed to navigate URL: ${errorMessage}` }]
      };
    }
  }
};
