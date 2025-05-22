# Agent Flow Builder API

Express server with E2B Code Interpreter for running Google ADK agents in sandboxed environments.

## Features

- 🚀 Execute Google ADK agents in secure E2B sandboxes
- 🔧 Automatic Python environment setup with virtual environments
- 📦 Google ADK package installation and configuration
- 🌐 Web interface for agent interaction
- 🛡️ CORS enabled for cross-origin requests
- 📊 Detailed execution logging and error handling

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# E2B API Key - Get from https://e2b.dev/docs/getting-started/api-key
E2B_API_KEY=your_e2b_api_key_here

# Google API Key for ADK - Get from Google Cloud Console
GOOGLE_API_KEY=your_google_api_key_here

# ADK API Key (usually same as GOOGLE_API_KEY)
ADK_API_KEY=your_google_api_key_here

# Port for the server (optional, defaults to 3001)
PORT=3001
```

### 3. Get API Keys

#### E2B API Key
1. Sign up at [E2B Dashboard](https://e2b.dev)
2. Navigate to the API Keys section
3. Copy your API key

#### Google API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the required APIs (Gemini API, etc.)
4. Create credentials (API Key)
5. Copy the API key

### 4. Start the Server

```bash
npm start
```

The server will start on `http://localhost:3001` (or your specified PORT).

## API Endpoints

### POST `/api/execute`

Execute Google ADK agent code in a sandboxed environment.

**Request Body:**
```json
{
  "files": {
    "agent.py": "# Your agent code here\nfrom google.adk import Agent\n..."
  }
}
```

**Response:**
```json
{
  "output": "Agent started with ADK web command. Access the UI at https://...",
  "error": null,
  "executionTime": 15000,
  "memoryUsage": 45.2,
  "executionDetails": {
    "stdout": ["Agent started with ADK web command"],
    "stderr": [],
    "exitCode": 0,
    "status": "running",
    "duration": 15000,
    "serverUrl": "https://8000-xyz.e2b.dev"
  },
  "openUrl": "https://8000-xyz.e2b.dev",
  "showOpenLink": true,
  "linkText": "Open Agent UI"
}
```

### GET `/api/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### GET `/`

API information and available endpoints.

## How It Works

1. **Sandbox Creation**: Creates an E2B sandbox with Python 3 environment
2. **File Setup**: Writes your agent files to the sandbox with proper directory structure
3. **Environment Setup**: Creates virtual environment and installs Google ADK
4. **Agent Execution**: Runs the ADK web command to start your agent
5. **Public Access**: Provides a public URL to access your running agent

## Error Handling

The API includes comprehensive error handling with:
- Detailed error messages and stack traces
- Execution time tracking
- Memory usage monitoring
- Automatic sandbox cleanup on errors

## Development

For development, you can use:

```bash
npm run dev
```

## Deployment

This app is compatible with:
- Render
- Vercel (serverless functions)
- Railway
- Any Node.js hosting platform

Make sure to set your environment variables in your deployment platform.

## Troubleshooting

### Common Issues

1. **E2B API Key Invalid**: Make sure you have a valid E2B API key and sufficient credits
2. **Google API Key Issues**: Ensure your Google API key has the necessary permissions
3. **Timeout Errors**: Large agent installations may take time; the timeout is set to 5 minutes
4. **Module Not Found**: The system automatically handles Google ADK installation

### Logs

The server provides detailed logs for debugging:
- 🚀 Request start
- 📝 File creation
- 🔧 Sandbox setup
- 🐍 Python environment
- 📦 Package installation
- ⚡ Agent startup
- 📊 Execution results

## License

MIT
