/*
 * @Author: shangwenhe shangwenhe@rongcloud.cn
 * @Date: 2025-12-26 14:16:16
 * @LastEditors: shangwenhe shangwenhe@rongcloud.cn
 * @LastEditTime: 2025-12-26 17:53:24
 * @FilePath: /mcp/src/browserTools/shared.ts
 * @Description: Shared types and state for Chrome Browser Controller
 */
import { ChildProcess } from 'child_process';
import * as z from 'zod';

// Chrome browser path
export const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

// Keep track of Chrome processes and CDP port (private module-level variables)
let _chromeProcess: ChildProcess | null = null;
let _cdpPort: string = '9222';

// Getter and setter for chrome process
export const getChromeProcess = (): ChildProcess | null => _chromeProcess;
export const setChromeProcess = (process: ChildProcess | null): void => {
  _chromeProcess = process;
};

// Getter and setter for CDP port
export const getCdpPort = (): string => _cdpPort;
export const setCdpPort = (port: string): void => {
  _cdpPort = port;
};


// Define tool type for type safety
export type BrowserTool = {
  name: string;
  schema: {
    title: string;
    description: string;
    inputSchema: z.ZodType<any, any>;
  };
  implementation: (input: any) => Promise<{ content: Array<{ type: string; text: string }> }>;
};
