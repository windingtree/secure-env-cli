import path from 'path';
import prompts from 'prompts';
import clear from 'clear';
import { read, write } from './api/fs';
import { encrypt, decrypt } from './api/crypto';
import { parseArguments, parseEnv } from './utils/env';
import { execAsync } from './api/exec';
import { printInfo, printWarn } from './utils/console';

// Prompting utility
const promptForPassword = () => prompts({
  type: 'password',
  name: 'password',
  message: 'Please enter encryption password',
  validate: pin => pin.length < 4
    ? 'At least 4 characters required'
    : true
});

export * as console from './utils/console';

export const cli = async (
  basePath: string,
  argv: string[]
): Promise<void> => {
  const args = parseArguments(
    {
      '--encrypt': String,
      '--decrypt': String,
    },
    argv
  );

  if (args['--encrypt'] && args['--decrypt']) {
    throw new Error('Please choose only one option: --encrypt or --decrypt');
  } else if (args['--encrypt']) {
    const baseFilePath = args['--encrypt'];
    if (baseFilePath === '') {
      throw new Error('File path must be provided with --encrypt');
    }
    const pwdPrompt = await promptForPassword();
    clear();
    const data = await read(
      basePath,
      baseFilePath
    );
    const encData = encrypt(data, pwdPrompt.password);
    const encDirName = path.dirname(baseFilePath);
    const encFileName = `${path.parse(baseFilePath).name}.senv`;
    const savedEncFileName = await write(
      path.resolve(basePath, encDirName),
      encFileName,
      encData
    );
    return printInfo(savedEncFileName);
  } else if (args['--decrypt']) {
    const baseFilePath = args['--decrypt'];
    if (baseFilePath === '') {
      throw new Error('File path must be provided with --decrypt');
    }
    const pwdPrompt = await promptForPassword();
    clear();
    const encData = await read(
      basePath,
      baseFilePath
    );
    const decData = decrypt(encData, pwdPrompt.password);
    const decDirName = path.dirname(baseFilePath);
    const decFileName = `${path.parse(baseFilePath).name}.env`;
    const savedDecFileName = await write(
      path.resolve(basePath, decDirName),
      decFileName,
      decData
    );
    return printInfo(savedDecFileName);
  } else if (args['_'].length > 3) {
    const baseFilePath = args['_'].slice(2)[0];
    if (!baseFilePath) {
      throw new Error('Path to encrypted environment file must be provided');
    }
    const pwdPrompt = await promptForPassword();
    clear();
    const encData = await read(
      basePath,
      baseFilePath
    );
    const decData = decrypt(encData, pwdPrompt.password);
    const parsedEnv = parseEnv(decData);
    const execCommand = args['_'].slice(3).join(' ');
    printInfo(`Executing the command: ${execCommand}`);
    await execAsync(execCommand, parsedEnv);
    return;
  } else {
    printWarn('Path to the encrypted environment and command to exec are must be provided');
    printWarn('Example: senv ./env.senv node ./path/to/script.js');
    return;
  }
};
