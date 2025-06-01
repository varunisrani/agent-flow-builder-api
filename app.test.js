import request from 'supertest';
import app from './app'; // Assuming your Express app is exported from app.js

// Mock the @e2b/code-interpreter module
jest.mock('@e2b/code-interpreter', () => {
  const mockSandboxInstance = {
    files: {
      write: jest.fn().mockResolvedValue(undefined),
    },
    commands: {
      run: jest.fn().mockResolvedValue({ stdout: 'mock command output', stderr: '', exitCode: 0 }),
    },
    getHost: jest.fn().mockReturnValue('mocked.host.e2b'),
    close: jest.fn().mockResolvedValue(undefined),
    destroy: jest.fn().mockResolvedValue(undefined),
    // Adding a mock for onStdout and onStderr if they are accessed or called
    onStdout: jest.fn(),
    onStderr: jest.fn(),
  };

  return {
    Sandbox: {
      create: jest.fn().mockResolvedValue(mockSandboxInstance),
    },
    // Keep CodeInterpreter mock if it's used elsewhere, or remove if only Sandbox is used
    CodeInterpreter: {
      create: jest.fn().mockResolvedValue({
        notebook: {
          execCell: jest.fn().mockResolvedValue({
            output: { text: 'Mocked execution output' },
            error: null,
          }),
        },
        close: jest.fn().mockResolvedValue(undefined),
      }),
    },
  };
});

// Clear mocks before each test to ensure test isolation
beforeEach(() => {
  jest.clearAllMocks();
});

// Increase Jest timeout
jest.setTimeout(30000);


describe('POST /api/execute', () => {
  it('should return 200 and execution results for successful code execution', async () => {
    console.log('Test: Starting successful execution test');
    const { Sandbox } = require('@e2b/code-interpreter');

    // Ensure the mock is set up correctly BEFORE app is loaded or request is made
    const mockSandboxInstance = {
      files: { write: jest.fn().mockResolvedValue(undefined) },
      commands: {
        run: jest.fn().mockImplementation(async (command) => {
          console.log(`Mock Sandbox command.run called with: ${command}`);
          if (command.includes('check_port.py')) {
            return { stdout: 'Port 8000 is now open!', stderr: '', exitCode: 0 };
          }
          if (command.includes('start_adk.sh')) {
            return { stdout: 'ADK web server started successfully', stderr: '', exitCode: 0 };
          }
          if (command.includes('curl -s -o /dev/null -w "%{http_code}" http://localhost:8000')) {
            return { stdout: '200', stderr: '', exitCode: 0 };
          }
          return { stdout: `mock output for ${command}`, stderr: '', exitCode: 0 };
        }),
      },
      getHost: jest.fn().mockReturnValue('mocked.host.e2b'),
      close: jest.fn().mockResolvedValue(undefined),
      destroy: jest.fn().mockResolvedValue(undefined),
      onStdout: jest.fn(),
      onStderr: jest.fn(),
    };
    Sandbox.create.mockResolvedValue(mockSandboxInstance);

    console.log('Test: Mock for Sandbox.create configured');

    const requestBody = { files: { 'agent.py': 'print("Hello, World!")' } };
    console.log('Test: Sending request to /api/execute with body:', requestBody);

    const response = await request(app)
      .post('/api/execute')
      .send(requestBody);

    console.log('Test: Received response status:', response.status);
    console.log('Test: Received response body:', response.body);

    expect(response.status).toBe(200);
    // Adjust expectations based on the actual response structure from the /api/execute endpoint
    // This will now be the response from the ADK web command part.
    expect(response.body).toHaveProperty('output');
    expect(response.body.output).toContain('Agent started with ADK web command.');
    expect(response.body).toHaveProperty('openUrl');
    expect(response.body.showOpenLink).toBe(true);


    // Ensure Sandbox methods were called
    expect(Sandbox.create).toHaveBeenCalledTimes(1); // Ensure it's called once per test
    // Note: mockSandboxInstance was defined inside the test, not from an outer scope or await.
    // We directly use the mockResolvedValue for Sandbox.create
    const createdSandboxInstance = Sandbox.create.mock.results[0].value;
    expect(createdSandboxInstance.files.write).toHaveBeenCalledWith('workspace/multi_tool_agent/agent.py', 'print("Hello, World!")');
    expect(createdSandboxInstance.commands.run).toHaveBeenCalledWith('mkdir -p workspace/multi_tool_agent');
    // Add more specific checks for other calls if necessary
  });

  it('should return 400 if agent.py is not provided in files', async () => {
    console.log('Test: Starting agent_py missing test');
    const response = await request(app)
      .post('/api/execute')
      .send({ files: { 'other_file.txt': 'content' } }); // Missing agent.py
    console.log('Test: agent_py missing response status:', response.status);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'No agent.py file provided' });
  });

  it('should return 400 if files object is not provided', async () => {
    console.log('Test: Starting files missing test');
    const response = await request(app)
      .post('/api/execute')
      .send({ code: 'print("Hello")' }); // `files` object is missing
    console.log('Test: files missing response status:', response.status);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'No agent.py file provided' });
  });


  it('should return 500 if Sandbox.create() fails', async () => {
    console.log('Test: Starting Sandbox.create failure test');
    const { Sandbox } = require('@e2b/code-interpreter');
    Sandbox.create.mockRejectedValueOnce(new Error('Failed to create sandbox'));

    const response = await request(app)
      .post('/api/execute')
      .send({ files: { 'agent.py': 'content' } });
    console.log('Test: Sandbox.create failure response status:', response.status);
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Failed to create sandbox');
  });

  it('should return 500 if a command run fails critically (e.g., start_adk.sh)', async () => {
    console.log('Test: Starting command run failure test');
    const { Sandbox } = require('@e2b/code-interpreter');
    // Correctly define the mock instance that Sandbox.create will resolve to
    const mockFailedCommandInstance = {
      files: { write: jest.fn().mockResolvedValue(undefined) },
      commands: {
        run: jest.fn().mockImplementation(async (command) => {
          if (command.includes('start_adk.sh')) {
            console.log('Test: Mocking start_adk.sh to throw error');
            throw new Error('ADK script failed');
          }
          return { stdout: `mock output for ${command}`, stderr: '', exitCode: 0 };
        }),
      },
      getHost: jest.fn().mockReturnValue('mocked.host.e2b'),
      close: jest.fn().mockResolvedValue(undefined),
      destroy: jest.fn().mockResolvedValue(undefined),
      onStdout: jest.fn(),
      onStderr: jest.fn(),
    };
    Sandbox.create.mockResolvedValue(mockFailedCommandInstance);


    const response = await request(app)
      .post('/api/execute')
      .send({ files: { 'agent.py': 'agent code' } });
    console.log('Test: command run failure response status:', response.status);
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('ADK script failed');
  });
});

describe('GET /api/health', () => {
  it('should return 200 and status ok', async () => {
    console.log('Test: Starting health check test');
    const response = await request(app).get('/api/health');
    console.log('Test: Health check response status:', response.status);
    console.log('Test: Health check response body:', response.body);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'ok',
      message: 'Server is running',
      timestamp: expect.any(String), // Timestamp will vary
    });
  });
});
