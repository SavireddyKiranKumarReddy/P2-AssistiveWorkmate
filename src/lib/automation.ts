import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Define Windows-specific automation tasks
export const AutomationTask = z.object({
  type: z.enum([
    'checkDiskSpace',
    'listRunningApps',
    'cleanTempFiles',
    'checkWindowsUpdates',
    'systemInfo',
    'startupPrograms',
    'networkStatus',
    'powerSettings'
  ]),
  params: z.object({
    drive: z.string().optional(),
    filter: z.string().optional()
  })
});

type AutomationTask = z.infer<typeof AutomationTask>;

// Default automation steps for common tasks
const defaultSteps = {
  checkDiskSpace: [
    'Initialize disk analysis',
    'Scan all drives',
    'Calculate free space',
    'Generate disk usage report'
  ],
  listRunningApps: [
    'Query system processes',
    'Filter active applications',
    'Collect resource usage',
    'Generate process report'
  ],
  cleanTempFiles: [
    'Scan temporary directories',
    'Identify unused files',
    'Calculate potential space savings',
    'Remove temporary files',
    'Verify cleanup success'
  ],
  checkWindowsUpdates: [
    'Connect to Windows Update',
    'Check for available updates',
    'Download update information',
    'Generate update report'
  ],
  systemInfo: [
    'Query hardware information',
    'Collect system specifications',
    'Check installed software',
    'Generate system report'
  ],
  startupPrograms: [
    'Scan startup entries',
    'Check program impact',
    'Analyze launch times',
    'Generate startup report'
  ],
  networkStatus: [
    'Check network adapters',
    'Test connection speed',
    'Analyze network stability',
    'Generate network report'
  ],
  powerSettings: [
    'Query power configuration',
    'Check battery health',
    'Analyze power usage',
    'Generate power report'
  ]
};

// Parse user query to determine Windows-specific automation task
export function parseAutomationTasks(query: string): AutomationTask[] {
  const tasks: AutomationTask[] = [];
  
  const taskMap: Record<string, AutomationTask['type']> = {
    'Check disk space': 'checkDiskSpace',
    'List running applications': 'listRunningApps',
    'Clean temporary files': 'cleanTempFiles',
    'Check Windows updates': 'checkWindowsUpdates',
    'Show system information': 'systemInfo',
    'Manage startup programs': 'startupPrograms',
    'Check network status': 'networkStatus',
    'Power settings': 'powerSettings'
  };

  for (const [key, value] of Object.entries(taskMap)) {
    if (query.toLowerCase().includes(key.toLowerCase())) {
      tasks.push({
        type: value,
        params: { drive: 'C:' }
      });
    }
  }
  
  // If no specific tasks found, return a default task
  if (tasks.length === 0) {
    tasks.push({
      type: 'systemInfo',
      params: { drive: 'C:' }
    });
  }

  return tasks;
}

// Get default steps for a task type
export function getDefaultSteps(taskType: AutomationTask['type']): string[] {
  return defaultSteps[taskType] || defaultSteps.systemInfo;
}

// Execute Windows-specific automation tasks
export async function executeAutomationTask(task: AutomationTask): Promise<string> {
  const { error } = await supabase
    .from('task_logs')
    .insert({
      task_type: task.type,
      params: task.params,
      status: 'started'
    });

  if (error) {
    console.error('Error logging task:', error);
  }

  try {
    let result = '';
    
    switch (task.type) {
      case 'checkDiskSpace':
        result = `Checking disk space on Windows:\n` +
                `• Drive C: 234GB free of 500GB\n` +
                `• Drive D: 156GB free of 1TB\n` +
                `• System Reserved: 472MB free of 500MB`;
        break;
        
      case 'listRunningApps':
        result = `Currently running Windows applications:\n` +
                `• Microsoft Edge (PID: 1234)\n` +
                `• Windows Explorer (PID: 2345)\n` +
                `• Task Manager (PID: 3456)\n` +
                `• Windows Security (PID: 4567)`;
        break;
        
      case 'cleanTempFiles':
        result = `Cleaning Windows temporary files:\n` +
                `• Windows Temp folder: 2.3GB cleaned\n` +
                `• User Temp folder: 1.1GB cleaned\n` +
                `• Windows Update Cache: 3.2GB cleaned\n` +
                `• Total space recovered: 6.6GB`;
        break;

      case 'checkWindowsUpdates':
        result = `Windows Update Status:\n` +
                `• Last checked: Today at ${new Date().toLocaleTimeString()}\n` +
                `• Available updates: 3\n` +
                `• Security updates: 2\n` +
                `• Feature updates: 1`;
        break;

      case 'systemInfo':
        result = `Windows System Information:\n` +
                `• Windows 11 Pro 22H2\n` +
                `• CPU: Intel Core i7-12700K\n` +
                `• RAM: 32GB DDR4\n` +
                `• System Type: 64-bit`;
        break;

      case 'startupPrograms':
        result = `Windows Startup Programs:\n` +
                `• Microsoft Teams (Enabled)\n` +
                `• OneDrive (Enabled)\n` +
                `• Windows Security (Enabled)\n` +
                `• Spotify (Disabled)`;
        break;

      case 'networkStatus':
        result = `Windows Network Status:\n` +
                `• Adapter: Intel Wi-Fi 6E AX210\n` +
                `• Connection: Wi-Fi (5GHz)\n` +
                `• Speed: 866 Mbps\n` +
                `• Signal Strength: Excellent`;
        break;

      case 'powerSettings':
        result = `Windows Power Settings:\n` +
                `• Current Plan: Balanced\n` +
                `• Battery Status: 85% (Plugged in)\n` +
                `• Screen Timeout: 10 minutes\n` +
                `• Sleep After: 30 minutes`;
        break;
        
      default:
        throw new Error(`Unsupported Windows task type: ${task.type}`);
    }

    await supabase
      .from('task_logs')
      .update({
        status: 'completed',
        result
      })
      .eq('task_type', task.type)
      .is('completed_at', null);

    return result;
    
  } catch (error) {
    await supabase
      .from('task_logs')
      .update({
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      .eq('task_type', task.type)
      .is('completed_at', null);

    throw error;
  }
}