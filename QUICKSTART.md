# 🚀 Quick Start Guide

Get your Google ADK agent running in under 5 minutes!

## 📋 Prerequisites

1. **Node.js** (v16 or higher)
2. **E2B Account** - Sign up at [e2b.dev](https://e2b.dev)
3. **Google Cloud Account** with API access

## ⚡ 5-Minute Setup

### Step 1: Clone and Install
```bash
git clone <your-repo-url>
cd express-hello-world
npm install
```

### Step 2: Get Your API Keys

#### E2B API Key
1. Go to [E2B Dashboard](https://e2b.dev)
2. Sign up/login
3. Copy your API key from the dashboard

#### Google API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable these APIs:
   - **Gemini API**
   - **Google AI Platform API**
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy your API key

### Step 3: Configure Environment
Create a `.env` file:
```bash
E2B_API_KEY=your_e2b_api_key_here
ADK_API_KEY=your_google_api_key_here
```

### Step 4: Start the Server
```bash
npm start
```

You should see:
```
🚀 Google ADK Agent Runner listening on port 3001
📋 Health check: http://localhost:3001/api/health
📖 API info: http://localhost:3001/
```

## 🧪 Test Your Setup

### Option 1: Use the Test Agent
We've included a test agent file (`test-agent.py`). Test it by sending a POST request:

```bash
curl -X POST http://localhost:3001/api/execute \
  -H "Content-Type: application/json" \
  -d '{
    "files": {
      "agent.py": "'"$(cat test-agent.py)"'"
    }
  }'
```

### Option 2: Use a Simple Agent
Create a minimal agent and test:

```bash
curl -X POST http://localhost:3001/api/execute \
  -H "Content-Type: application/json" \
  -d '{
    "files": {
      "agent.py": "from google.adk import Agent\n\nagent = Agent(name=\"hello_agent\", description=\"A simple hello agent\")\n\n@agent.tool\ndef say_hello():\n    return \"Hello from Google ADK!\"\n\nroot_agent = agent"
    }
  }'
```

## ✅ Expected Response

If everything is working, you'll get a response like:

```json
{
  "output": "Google ADK agent started successfully! Access the web interface at: https://8000-xyz.e2b.dev",
  "error": null,
  "executionTime": 25000,
  "openUrl": "https://8000-xyz.e2b.dev",
  "showOpenLink": true,
  "linkText": "Open ADK Agent Interface"
}
```

Click the `openUrl` to interact with your agent!

## 🐛 Common Issues & Quick Fixes

### Issue: "E2B_API_KEY environment variable is required"
**Fix:** Make sure your `.env` file exists and contains the correct E2B API key.

### Issue: "Google ADK installation verification failed"
**Fix:** 
1. Check your Google API key has the right permissions
2. Ensure Gemini API is enabled in Google Cloud Console
3. Wait a few minutes and try again (sometimes API activation takes time)

### Issue: "ADK web server failed to start"
**Fix:** 
1. Check the detailed logs in the console
2. Verify your Google API key is valid
3. Try again - sometimes it takes a moment for all services to initialize

### Issue: Timeout errors
**Fix:** The system has a 10-minute timeout for setup. If it's still timing out:
1. Check your internet connection
2. Verify both API keys are correct
3. Try during off-peak hours

## 🎯 Next Steps

1. **Customize Your Agent**: Modify the agent code to add your own tools and functionality
2. **Deploy**: Deploy to Render, Railway, or Vercel for production use
3. **Scale**: Use the API to build web interfaces or integrate with other systems

## 📞 Need Help?

- Check the full [README.md](README.md) for detailed documentation
- Review the troubleshooting section
- Ensure all APIs are enabled in Google Cloud Console
- Verify your API keys have the necessary permissions

## 🎉 Success!

If you see the agent interface URL, congratulations! Your Google ADK agent runner is working perfectly. You can now build and deploy sophisticated AI agents with ease. 