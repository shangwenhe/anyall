// Import MCP server and necessary modules
import { createMcpExpressApp } from '@modelcontextprotocol/sdk/server/express.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { browserTools } from './browserTools';
import { Request, Response } from 'express';

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

const app = createMcpExpressApp();

app.post('/mcp', async (req: Request, res: Response) => {
    try {
        const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: undefined
        });
        
        await server.connect(transport);
        await transport.handleRequest(req, res, req.body);
        
        res.on('close', () => {
            transport.close();
            server.close();
        });
    } catch (error) {
        console.error('Error handling MCP request:', error);
        
        if (!res.headersSent) {
            res.status(500).json({
                jsonrpc: '2.0',
                error: {
                    code: -32603,
                    message: 'Internal server error'
                },
                id: null
            });
        }
    }
});

app.get('/mcp', async (req: Request, res: Response) => {
    res.status(405).json({
        jsonrpc: '2.0',
        error: {
            code: -32000,
            message: 'Method not allowed.'
        },
        id: null
    });
});

app.delete('/mcp', async (req: Request, res: Response) => {
    res.status(405).json({
        jsonrpc: '2.0',
        error: {
            code: -32000,
            message: 'Method not allowed.'
        },
        id: null
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, (error?: Error) => {
    if (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
    console.log(`MCP Chrome Controller Server listening on port ${PORT}`);
    console.log('Chrome will be started with debugging enabled on port 9222');
});

// Handle server shutdown
process.on('SIGINT', () => {
    console.log('Shutting down MCP Chrome Controller Server...');
    process.exit(0);
});


  
