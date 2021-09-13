import fs from 'fs';
import path from 'path';

// Reads file
export const read = (
  basePath: string,
  baseFilePath: string
): Promise<string> => new Promise((resolve, reject) => {
  fs.readFile(
    path.resolve(basePath, baseFilePath),
    {
      encoding: 'utf8',
      flag: 'r'
    },
    (error, data) => {
      if (error) {
        return reject(error);
      }
      resolve(data.trim());
    }
  );
});

// Writes file
export const write = (
  filePath: string,
  fileName: string,
  fileContent: string
): Promise<string> => new Promise((resolve, reject) => {
  const savedFilePath = path.resolve(filePath, fileName);
  fs.writeFile(
    savedFilePath,
    fileContent,
    {
      encoding: 'utf8',
      flag: 'w'
    },
    error => {
      if (error) {
        return reject(error);
      }
      resolve(savedFilePath);
    }
  );
});
