"""
Simple Google ADK Agent for Testing
This is a basic agent to verify that your Google ADK setup is working correctly.
"""

from google.adk import Agent
from google.adk.llm import LlmConfig

# Create the main agent
agent = Agent(
    name="test_agent",
    description="A simple test agent to verify Google ADK functionality",
    instructions="You are a helpful test agent. Respond to user queries and demonstrate basic functionality.",
    llm=LlmConfig(model="gemini-pro")
)

@agent.tool
def hello_world():
    """
    A simple greeting function to test tool functionality.
    
    Returns:
        str: A greeting message
    """
    return "Hello! This is a test message from your Google ADK agent. The setup is working correctly!"

@agent.tool
def get_system_info():
    """
    Get basic system information to verify the environment.
    
    Returns:
        dict: System information
    """
    import sys
    import platform
    
    return {
        "python_version": sys.version,
        "platform": platform.platform(),
        "architecture": platform.architecture(),
        "processor": platform.processor(),
        "agent_status": "running"
    }

@agent.tool
def calculate(expression: str):
    """
    Perform a simple calculation.
    
    Args:
        expression (str): Mathematical expression to evaluate (e.g., "2 + 2")
        
    Returns:
        str: Result of the calculation
    """
    try:
        # Convert JavaScript boolean literals to Python if present
        expression = expression.replace('false', 'False').replace('true', 'True')
        
        # Simple safety check - only allow basic math operations
        allowed_chars = set('0123456789+-*/()., ')
        if not all(c in allowed_chars for c in expression):
            return "Error: Only basic math operations are allowed"
        
        result = eval(expression)
        return f"Result: {expression} = {result}"
    except Exception as e:
        return f"Error calculating '{expression}': {str(e)}"

@agent.tool
def echo_message(message: str):
    """
    Echo back a message to test string handling.
    
    Args:
        message (str): Message to echo back
        
    Returns:
        str: The echoed message
    """
    return f"Echo: {message}"

@agent.tool
def greet():
    """
    Handle simple greetings.
    
    Returns:
        str: A greeting response
    """
    return "Hello! I'm a test agent. How can I help you today?"

# Export the agent (required for ADK to detect it)
root_agent = agent

if __name__ == "__main__":
    print("Test agent loaded successfully!")
    print(f"Agent name: {agent.name}")
    print(f"Agent description: {agent.description}")
    print(f"Available tools: {[tool.name for tool in agent.tools]}") 