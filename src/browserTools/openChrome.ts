/*
 * @Author: shangwenhe shangwenhe@rongcloud.cn
 * @Date: 2025-12-26 14:16:16
 * @LastEditors: shangwenhe shangwenhe@rongcloud.cn
 * @LastEditTime: 2025-12-26 17:53:24
 * @FilePath: /mcp/src/browserTools/openChrome.ts
 * @Description: openChrome tool implementation
 */
import * as z from 'zod';
import { spawn, ChildProcess, exec } from 'child_process';
import { promisify } from 'util';
import fetch from 'node-fetch';
import { BrowserTool, CHROME_PATH, getChromeProcess, setChromeProcess, setCdpPort } from './shared';

const execAsync = promisify(exec);

export const openChromeTool: BrowserTool = {
  name: 'openChrome',
  schema: {
    title: 'Open Chrome Browser',
    description: 'Open Chrome browser with Chrome DevTools Protocol (CDP) enabled. You can specify a custom CDP port.',
    inputSchema: z.object({
      url: z.string().url({ message: 'Please provide a valid URL' }).default('about:blank'),
      port: z.string().default('9222') // Allow custom CDP port
    })
  },
  implementation: async ({ url, port }) => {
    try {
      if (getChromeProcess()) {
        console.log('Chrome is already running, opening new tab...');
        const newTabProcess = spawn(CHROME_PATH, ['--new-tab', url], {
          detached: true,
          stdio: 'ignore'
        }) as ChildProcess;

        newTabProcess.unref();

        return {
          content: [{ type: 'text', text: `New tab opened in existing Chrome process: ${url}` }]
        };
      }

      // Open new Chrome process with debugging enabled
      console.log('Opening new Chrome process with debugging enabled...');

      const process = spawn(CHROME_PATH, [
        `--tags=mcp-chrome-tools`,
        `--user-data-dir=/tmp/chrome_debug`, // Use a temporary user data directory
        `--remote-debugging-port=${port}`, // Enable CDP with custom port
        '--remote-debugging-address=0.0.0.0', // Allow remote connections
        '--no-first-run', // Skip first run prompts
        '--no-default-browser-check', // Skip default browser check
        '--disable-extensions', // Disable extensions for cleaner environment
        url // Initial URL
      ], {
        detached: true,
        stdio: 'ignore'
      }) as ChildProcess;

      process.unref();

      // Set up exit handler
      process.on('exit', () => {
        console.log('Chrome process exited');
        setChromeProcess(null);
      });

      // Update state with new process and port
      setChromeProcess(process);
      setCdpPort(port);

      // 查询所有进程是否有 mcp-chrome-tools 的字样，如果有则把进程号返回。
      try {
        // Wait time sequence: [100ms, 100ms, 50ms, 50ms, 100ms, 200ms, ..., 1000ms, 2000ms, 3000ms] (16 times total)
        const waitTimes: number[] = [200, 100, 50, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 2000, 3000];
        const maxAttempts = waitTimes.length; // 16 attempts
        
        // Command to find Chrome processes with the custom tag
        const psCommand = `ps aux | grep 'mcp-chrome-tools' | grep -v 'grep' | grep -v 'ps aux'`;
        
        // Try to find Chrome process with mcp-chrome-tools tag
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
          // Wait for the current time interval
          await new Promise(resolve => setTimeout(resolve, waitTimes[attempt]));
          
          try {
            const { stdout } = await execAsync(psCommand);
            
            // Extract process ID from the output
            const chromeProcesses = stdout.trim().split('\\n').filter(line =>
              line && line.includes('Google Chrome.app/Contents/MacOS/Google Chrome')
            ); // Only main Chrome process, not helpers
            if (chromeProcesses.length > 0) {
              // Extract PID from ps output - simpler approach
              const pid = chromeProcesses[0].trim().split(/\s+/)[1]; // PID is in the second column

              try {
                // Fetch tab handles from Chrome's CDP endpoint with retry mechanism
                const cdpUrl = `http://localhost:${port}/json`;
                const cdpWaitTimes: number[] = [200, 300, 500, 800, 1000, 1500, 2000];
                const maxCdpAttempts = cdpWaitTimes.length;

                for (let cdpAttempt = 0; cdpAttempt < maxCdpAttempts; cdpAttempt++) {
                  try {
                    await new Promise(resolve => setTimeout(resolve, cdpWaitTimes[cdpAttempt]));
                    const cdpResponse = await fetch(cdpUrl);

                    if (cdpResponse.ok) {
                      const targets: any = await cdpResponse.json();
                      // Filter for actual browser tabs (excludes background processes)
                      const tabs = targets?.filter((target: any) => target.type === 'page');

                      if (tabs.length > 0) {
                        // Extract tab handles
                        const tabHandles = tabs.map((tab: any) => ({
                          targetId: tab.id,
                          url: tab.url,
                          webSocketDebuggerUrl: tab.webSocketDebuggerUrl
                        }));

                        // Return combined message with PID and tab handles
                        return {
                          content: [{
                            type: 'text',
                            text: `Chrome opened successfully to: ${url} (CDP port: ${port}, PID: ${pid})\nTab Handles:\n${JSON.stringify(tabHandles, null, 2)}`
                          }]
                        };
                      }
                    }
                  } catch (cdpAttemptError) {
                    console.error(`Error fetching tab handles on attempt ${cdpAttempt + 1}:`, cdpAttemptError);
                    // Ignore error and continue to next attempt
                  }
                }
              } catch (cdpError) {
                console.error('Error in CDP tab handle fetch loop:', cdpError);
                // Fall back to basic message with PID
              }

              // Fallback response with PID only
              return {
                content: [{
                  type: 'text',
                  text: `Chrome opened successfully to: ${url} (CDP port: ${port}, PID: ${pid})`
                }]
              };
            }
            
            // If process not found, continue to next attempt
            console.log(`Chrome process not found on attempt ${attempt + 1}/${maxAttempts}, waiting...`);
          } catch (execError) {
            // Ignore error and continue to next attempt
            console.error(`Error checking Chrome processes on attempt ${attempt + 1}:`, execError);
          }
        }
        
        // If no process found after all attempts, continue with fallback message
        console.log(`Chrome process with tag 'mcp-chrome-tools' not found after ${maxAttempts} attempts`);
      } catch (error) {
        console.error('Error in Chrome process detection loop:', error);
        // Fallback to basic success message if PID detection fails
      }

      return {
        content: [{ type: 'text', text: `Chrome opened successfully to: ${url} (CDP port: ${port})` }]
      };
      
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('Error opening Chrome:', errorMessage);
      return {
        content: [{ type: 'text', text: `Failed to open Chrome: ${errorMessage}` }]
      };
    }
  }
};
