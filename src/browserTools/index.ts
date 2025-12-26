/*
 * @Author: shangwenhe shangwenhe@rongcloud.cn
 * @Date: 2025-12-26 14:16:16
 * @LastEditors: shangwenhe shangwenhe@rongcloud.cn
 * @LastEditTime: 2025-12-26 17:53:24
 * @FilePath: /mcp/src/browserTools/index.ts
 * @Description: Chrome Browser Controller MCP Service - Combined Tools
 */
import { openChromeTool } from './openChrome';
import { getCdpPortTool } from './getCdpPort';
import { closeChromeTool } from './closeChrome';
import { navigateUrlTool } from './navigateUrl';
import { reloadTool } from './reload';
import { backTool } from './back';
import { forwardTool } from './forward';
import { getPageHtmlTool } from './getPageHtml';
import { getPageTextTool } from './getPageText';
import { executeJavaScriptTool } from './executeJavaScript';
import { resetSessionTool } from './resetSession';
import { setCookiesTool } from './setCookies';
import { deleteCookiesTool } from './deleteCookies';
import { getBrowserStatusTool } from './getBrowserStatus';
import { getPageScreenshotTool } from './getPageScreenshot';
import { getTabsTool } from './getTabs';
import { switchTabTool } from './switchTab';
import { closeTabTool } from './closeTab';
import { clickElementTool } from './clickElement';
import { inputTextTool } from './inputText';
import { getElementTextTool } from './getElementText';
import { getElementAttributeTool } from './getElementAttribute';

// Export all browser tools as an array
export const browserTools = [
  openChromeTool,
  getCdpPortTool,
  closeChromeTool,
  navigateUrlTool,
  reloadTool,
  backTool,
  forwardTool,
  getPageHtmlTool,
  getPageTextTool,
  executeJavaScriptTool,
  resetSessionTool,
  setCookiesTool,
  deleteCookiesTool,
  getBrowserStatusTool,
  getPageScreenshotTool,
  getTabsTool,
  switchTabTool,
  closeTabTool,
  clickElementTool,
  inputTextTool,
  getElementTextTool,
  getElementAttributeTool
];
