# Google ADK Agent Runner

Express server with E2B Code Interpreter for running Google ADK agents in sandboxed environments with Python 3.9 compatibility.

## 🚀 Features

- ✅ **Python 3.9 Compatibility**: Automatically installs Python 3.9 for Google ADK compatibility
- 🔧 **Automatic Environment Setup**: Creates virtual environments and installs dependencies
- 📦 **Google ADK Integration**: Full Google ADK package installation and configuration
- 🌐 **Web Interface**: Provides public URLs for agent interaction
- 🛡️ **Secure Sandboxing**: Runs agents in isolated E2B environments
- 📊 **Detailed Logging**: Comprehensive execution tracking and error handling
- 🔄 **Auto-Recovery**: Intelligent startup scripts with multiple fallback options

## 🛠️ Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```bash
# E2B API Key - Get from https://e2b.dev/docs/getting-started/api-key
E2B_API_KEY=your_e2b_api_key_here

# Google API Key for ADK - Get from Google Cloud Console
ADK_API_KEY=your_google_api_key_here

# Alternative to ADK_API_KEY (same value usually)
GOOGLE_API_KEY=your_google_api_key_here

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
3. Enable the required APIs:
   - Gemini API
   - Google AI Platform API
   - Any other APIs your agent needs
4. Create credentials (API Key)
5. Copy the API key

### 4. Start the Server

```bash
npm start
```

The server will start on `http://localhost:3001` (or your specified PORT).

## 📡 API Endpoints

### POST `/api/execute`

Execute Google ADK agent code in a sandboxed environment with Python 3.9.

**Request Body:**
```json
{
  "files": {
    "agent.py": "# Your Google ADK agent code here\nfrom google.adk import Agent\n..."
  }
}
```

**Response:**
```json
{
  "output": "Google ADK agent started successfully! Access the web interface at: https://...",
  "error": null,
  "executionTime": 25000,
  "memoryUsage": 67.3,
  "executionDetails": {
    "stdout": ["ADK web server started successfully"],
    "stderr": [],
    "exitCode": 0,
    "status": "running",
    "duration": 25000,
    "serverUrl": "https://8000-xyz.e2b.dev"
  },
  "openUrl": "https://8000-xyz.e2b.dev",
  "showOpenLink": true,
  "linkText": "Open ADK Agent Interface"
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

API information and requirements.

## 🔧 How It Works

1. **Sandbox Creation**: Creates an E2B sandbox with extended timeout for ADK setup
2. **Python 3.9 Installation**: Installs Python 3.9 for Google ADK compatibility (requires Python < 3.10)
3. **Virtual Environment**: Creates isolated Python environment with proper dependencies
4. **Google ADK Installation**: Installs and verifies Google ADK package
5. **Project Initialization**: Sets up ADK project structure and configuration
6. **Agent Deployment**: Writes your agent files and starts the ADK web server
7. **Public Access**: Provides a public URL to access your running agent interface

## 🐛 Troubleshooting

### Common Issues

1. **Python Version Compatibility**: 
   - Google ADK requires Python < 3.10
   - The system automatically installs Python 3.9

2. **E2B API Key Invalid**: 
   - Make sure you have a valid E2B API key
   - Check that you have sufficient credits

3. **Google API Key Issues**: 
   - Ensure your Google API key has the necessary permissions
   - Enable required APIs in Google Cloud Console

4. **ADK Installation Failures**:
   - The system includes multiple retry mechanisms
   - Check logs for specific error messages

5. **Server Startup Issues**:
   - The startup script tries multiple ADK commands (`adk web`, `adk serve`, `adk run`)
   - Includes comprehensive port and process verification

### Debug Information

The server provides detailed logs for debugging:
- 🚀 Request initialization
- 📁 Directory and file creation
- 🐍 Python environment setup
- 📦 Package installation progress
- ⚡ ADK project initialization
- 🌐 Server startup and verification
- 📊 Final execution results

### Error Recovery

The system includes several recovery mechanisms:
- Automatic Python 3.9 installation if not available
- Multiple ADK command attempts
- Process and port verification with fallbacks
- Detailed error diagnostics and logging
- Automatic cleanup on failures

## 🚀 Deployment

This app is compatible with:
- **Render** ✅
- **Railway** ✅
- **Vercel** ✅ (serverless functions)
- **Any Node.js hosting platform** ✅

Make sure to set your environment variables in your deployment platform.

## 🔍 Development

For development with auto-restart:

```bash
npm run dev
```

## 📝 Example Agent Code

Here's a simple example of a Google ADK agent:

```python
from google.adk import Agent

# Create your ADK agent
agent = Agent(
    name="my_agent",
    description="A simple Google ADK agent"
)

@agent.tool
def hello_world():
    """A simple greeting function."""
    return "Hello from Google ADK!"

# Export the agent
root_agent = agent
```

## 🔒 Security

- All code execution happens in isolated E2B sandboxes
- No access to host system or other user data
- Automatic cleanup of resources after execution
- Secure API key handling

## 📄 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the detailed logs in the console
3. Ensure all API keys are properly configured
4. Verify your Google Cloud project has the required APIs enabled
