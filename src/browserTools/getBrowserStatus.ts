/*
 * @Author: shangwenhe shangwenhe@rongcloud.cn
 * @Date: 2025-12-26 14:16:16
 * @LastEditors: shangwenhe shangwenhe@rongcloud.cn
 * @LastEditTime: 2025-12-26 17:53:24
 * @FilePath: /mcp/src/browserTools/getBrowserStatus.ts
 * @Description: getBrowserStatus tool implementation
 */
import * as z from 'zod';
import { spawnSync } from 'child_process';
import { BrowserTool, getCdpPort, getChromeProcess } from './shared';

export const getBrowserStatusTool: BrowserTool = {
  name: 'getBrowserStatus',
  schema: {
    title: 'Get Browser Status',
    description: 'Get the current status of the Chrome browser',
    inputSchema: z.object({})
  },
  implementation: async () => {
    try {
      console.log('Getting browser status...');

      // 查询所有进程是否有  mcp-chrome-tools 的字样，如果有则把进程号返回。
      const psResult = spawnSync('ps', ['aux']);
      const output = psResult.stdout.toString();
      const chromePids: string[] = [];

      // 解析输出，提取进程号
      output.split('\n').forEach((line: string) => {
        if (line.includes('mcp-chrome-tools') && !line.includes('grep')) {
          const parts = line.split(/\s+/);
          if (parts[1]) {
            chromePids.push(parts[1]);
          }
        }
      });

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            running: chromePids.length > 0,
            processIds: chromePids,
            mainProcessId: getChromeProcess()?.pid || null
          }, null, 2)
        }]
      };
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('Error getting browser status:', errorMessage);
      return {
        content: [{ type: 'text', text: `Failed to get browser status: ${errorMessage}` }]
      };
    }
  }
};
