/*
 * @Author: shangwenhe shangwenhe@rongcloud.cn
 * @Date: 2025-12-26 14:16:16
 * @LastEditors: shangwenhe shangwenhe@rongcloud.cn
 * @LastEditTime: 2025-12-26 17:53:24
 * @FilePath: /mcp/src/browserTools/getCdpPort.ts
 * @Description: getCdpPort tool implementation
 */
import * as z from 'zod';
import { BrowserTool, getCdpPort } from './shared';

export const getCdpPortTool: BrowserTool = {
  name: 'getCdpPort',
  schema: {
    title: 'Get CDP Port',
    description: 'Get the current Chrome DevTools Protocol (CDP) port',
    inputSchema: z.object({})
  },
  implementation: async () => {
    try {
      return {
        content: [{ type: 'text', text: getCdpPort() }]
      };
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('Error getting CDP port:', errorMessage);
      return {
        content: [{ type: 'text', text: `Failed to get CDP port: ${errorMessage}` }]
      };
    }
  }
};
