const WebSocket = require('ws');
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

const wss = new WebSocket.Server({ port: 3001 });

console.log('Automation server listening on port 3001');

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', async (message) => {
    const task = JSON.parse(message);
    console.log('Received task:', task);

    try {
      let result;

      switch (task.type) {
        case 'openFile':
          result = await handleFileOpen(task.params.path);
          break;
        
        case 'createFile':
          result = await handleFileCreate(task.params.path, task.params.content);
          break;
        
        case 'deleteFile':
          result = await handleFileDelete(task.params.path);
          break;
        
        case 'searchFiles':
          result = await handleFileSearch(task.params.pattern);
          break;
        
        case 'runCommand':
          result = await handleCommandExecution(task.params.command);
          break;
        
        default:
          throw new Error(`Unsupported task type: ${task.type}`);
      }

      ws.send(JSON.stringify({
        taskId: task.taskId,
        success: true,
        result
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        taskId: task.taskId,
        success: false,
        error: error.message
      }));
    }
  });
});

async function handleFileOpen(filePath) {
  const normalizedPath = path.normalize(filePath);
  const content = await fs.readFile(normalizedPath, 'utf8');
  return `File opened: ${content.length} bytes read`;
}

async function handleFileCreate(filePath, content) {
  const normalizedPath = path.normalize(filePath);
  await fs.writeFile(normalizedPath, content);
  return `File created: ${normalizedPath}`;
}

async function handleFileDelete(filePath) {
  const normalizedPath = path.normalize(filePath);
  await fs.unlink(normalizedPath);
  return `File deleted: ${normalizedPath}`;
}

async function handleFileSearch(pattern) {
  const { stdout } = await execAsync(`find . -name "${pattern}"`);
  const files = stdout.split('\n').filter(Boolean);
  return `Found files: ${files.join(', ')}`;
}

async function handleCommandExecution(command) {
  // Add security checks here
  const { stdout } = await execAsync(command);
  return stdout;
}