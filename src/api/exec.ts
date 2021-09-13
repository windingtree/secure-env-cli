import type { CommonExecOptions } from 'child_process';
import { exec } from 'child_process';
import { printError, printInfo, printWarn } from '../utils/console';

// Executes a command
export const execAsync = (
  command: string,
  env: NodeJS.ProcessEnv | undefined
): Promise<number | null> => new Promise((resolve, reject) => {
  const cmd = exec(
    command,
    {
      env,
      stdio: [process.stdout, process.stdin, process.stderr]
    } as CommonExecOptions
  );

  if (cmd !== null) {

    if (cmd.stdout !== null) {
      cmd.stdout.on('data', data => {
        console.log(data.toString().replace(/[\n\r]$/, ''));
      });
    } else {
      printWarn('The executed process does not provide stdout stream');
    }

    if (cmd.stderr !== null) {
      cmd.stderr.on('data', data => {
        printError(data.toString().replace(/[\n\r]$/, ''));
      });
    } else {
      printWarn('The executed process does not provide stderr stream');
    }

    cmd.on('close', code => {
      printInfo(`Execution of the command: ${command} finished with code: ${code}`);
      resolve(code);
    });

    cmd.on('error', error => reject(error));
  } else {
    throw Error(`Unable to exec the command: ${command}`);
  }
});
