// Import MCP server and necessary modules
import { createMcpExpressApp } from '@modelcontextprotocol/sdk/server/express.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { IncomingMessage, ServerResponse } from 'http';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { browserTools } from './browserTools.js';

function getServer() {
  // Create MCP server instance
  const server = new McpServer({
    name: 'Chrome Browser Controller',
    version: '1.0.1',
    description: 'MCP Service to control Chrome browser'
  });

  // Register all tools from the browserTools array
  browserTools.forEach(tool => {
    server.registerTool(tool.name, tool.schema, tool.implementation as any);
  });

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

