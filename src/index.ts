// Import MCP server and necessary modules
import { createMcpExpressApp } from '@modelcontextprotocol/sdk/server/express.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { spawn, ChildProcess } from 'child_process';
import { IncomingMessage, ServerResponse } from 'http';
import * as z from 'zod';

// Chrome browser path (Canary version)
const CHROME_PATH = '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary';

// Keep track of Chrome processes
let chromeProcess: ChildProcess | null = null;

// Start MCP server
function getServer() {
    // Create MCP server instance
    const server = new McpServer({
        name: 'Chrome Browser Controller',
        version: '1.0.0',
        description: 'MCP Service to control Chrome browser'
    });

    // Register openChrome tool
    server.registerTool(
        'openChrome',
        {
            title: 'Open Chrome Browser',
            description: 'Open Chrome browser to the specified URL',
            inputSchema: z.object({
                url: z.string().url({ message: 'Please provide a valid URL' }).default('about:blank')
            })
        },
        async ({ url }) => {
            try {
                if (chromeProcess) {
                    console.log('Chrome is already running, opening new tab...');
                    const newTabProcess = spawn(CHROME_PATH, ['--new-tab', url], {
                        detached: true,
                        stdio: 'ignore'
                    });
                    newTabProcess.unref();
                    
                    return {
                        content: [{ type: 'text', text: `New tab opened in existing Chrome process: ${url}` }]
                    };
                }

                // Open new Chrome process
                console.log('Opening new Chrome process...');
                chromeProcess = spawn(CHROME_PATH, [url], {
                    detached: true,
                    stdio: 'ignore'
                });

                chromeProcess.unref();

                // Set up exit handler
                chromeProcess.on('exit', () => {
                    console.log('Chrome process exited');
                    chromeProcess = null;
                });

                return {
                    content: [{ type: 'text', text: `Chrome opened successfully to: ${url}` }]
                };
            } catch (error) {
                const errorMessage = (error as Error).message;
                console.error('Error opening Chrome:', errorMessage);
                return {
                    content: [{ type: 'text', text: `Failed to open Chrome: ${errorMessage}` }]
                };
            }
        }
    );

    // Register closeChrome tool
    server.registerTool(
        'closeChrome',
        {
            title: 'Close Chrome Browser',
            description: 'Close all Chrome browser instances',
            inputSchema: z.object({})
        },
        async () => {
            try {
                if (chromeProcess) {
                    console.log('Killing Chrome process...');
                    // On macOS, we need to kill the process differently
                    spawn('pkill', ['-f', 'Google Chrome Canary'], {
                        detached: true,
                        stdio: 'ignore'
                    });
                    chromeProcess = null;
                } else {
                    // Try to close any Chrome Canary instances
                    console.log('Closing all Chrome Canary instances...');
                    spawn('pkill', ['-f', 'Google Chrome Canary'], {
                        detached: true,
                        stdio: 'ignore'
                    });
                }

                return {
                    content: [{ type: 'text', text: 'All Chrome instances closed successfully' }]
                };
            } catch (error) {
                const errorMessage = (error as Error).message;
                console.error('Error closing Chrome:', errorMessage);
                return {
                    content: [{ type: 'text', text: `Failed to close Chrome: ${errorMessage}` }]
                };
            }
        }
    );

    // Register navigateUrl tool
    server.registerTool(
        'navigateUrl',
        {
            title: 'Navigate to URL',
            description: 'Open a new tab in Chrome with the specified URL',
            inputSchema: z.object({
                url: z.string().url({ message: 'Please provide a valid URL' })
            })
        },
        async ({ url }) => {
            try {
                console.log('Navigating to URL:', url);
                
                // Open new tab with the URL (this works reliably on macOS)
                const tabProcess = spawn(CHROME_PATH, ['--new-tab', url], {
                    detached: true,
                    stdio: 'ignore'
                });
                
                tabProcess.unref();
                
                return {
                    content: [{ type: 'text', text: `URL opened in new tab: ${url}` }]
                };
            } catch (error) {
                const errorMessage = (error as Error).message;
                console.error('Error navigating URL:', errorMessage);
                return {
                    content: [{ type: 'text', text: `Failed to navigate URL: ${errorMessage}` }]
                };
            }
        }
    );

    return server;

}

const app = createMcpExpressApp();

app.post('/mcp', async (req: IncomingMessage & Request, res: IncomingMessage & ServerResponse) => {
    const server = getServer();
    try {
        const transport: StreamableHTTPServerTransport = new StreamableHTTPServerTransport({
            sessionIdGenerator: undefined
        });
        // debugger;
        // console.log('Received MCP POST request', server, transport);
        // debugger;
        await server.connect(transport);
        await transport.handleRequest(req, res, req.body);
        res.on('close', () => {
            console.log('Request closed');
            transport.close();
            server.close();
        });
    } catch (error) {
        console.error('Error handling MCP request:', error);
        if (!res.headersSent) {
            res.writeHead(500).end(JSON.stringify({
                jsonrpc: '2.0',
                error: {
                    code: -32603,
                    message: 'Internal server error'
                },
                id: null
            }));
        }
    }
});

app.get('/mcp', async (req: Request, res: ServerResponse) => {
    console.log('Received GET MCP request');
    res.writeHead(405).end(
        JSON.stringify({
            jsonrpc: '2.0',
            error: {
                code: -32000,
                message: 'Method not allowed.'
            },
            id: null
        })
    );
});

app.delete('/mcp', async (req: Request, res: ServerResponse) => {
    console.log('Received DELETE MCP request');
    res.writeHead(405).end(
        JSON.stringify({
            jsonrpc: '2.0',
            error: {
                code: -32000,
                message: 'Method not allowed.'
            },
            id: null
        })
    );
});

// Start the server
const PORT = 3000;
app.listen(PORT, (error: Error | null) => {
    if (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
    console.log(`MCP Stateless Streamable HTTP Server listening on port ${PORT}`);
});

// Handle server shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    process.exit(0);
});

