import fs from 'fs';
import rimraf from 'rimraf';
import logger from './winston';

class FileSystem {
  removeFile(fileName) {
    return new Promise((resolve, reject) => {
      rimraf(fileName, err => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  readFile(fileName) {
    return new Promise((resolve, reject) => {
      fs.readFile(fileName, (err, data) => {
        if (err) reject(err);
        resolve(data.toString());
      });
    });
  }

  exists(fileName) {
    return new Promise((resolve, reject) => {
      fs.access(fileName, fs.constants.F_OK, err => {
        if (err) resolve(false);
        resolve(true);
      });
    });
  }

  writeLineToFile(fileName, data) {
    return new Promise((resolve, reject) => {
      if (!data) reject(new Error(`No data provided`));

      fs.appendFile(fileName, data, err => {
        if (err) reject(new Error(err));
        resolve(data);
      });
    });
  }

  async *writeLinesToFileGen(fileName, lines) {
    try {
      let i = 0;
      while (i < lines.length) {
        const line = lines[i];
        try {
          const res = await this.writeLineToFile(fileName, line);

          yield [null, res];
        } catch (error) {
          yield [error, line];
        } finally {
          i++;
        }
      }
    } catch (error) {
      logger.error(`Failed to write lines to a file`, {
        reason: error.message || error
      });
      throw Error(error);
    }
  }

  async writeLinesToFile(fileName, data_arr) {
    try {
      for await (const [err, res] of this.writeLinesToFileGen(
        fileName,
        data_arr
      )) {
        if (err) {
          logger.error(`Failed to write ${res} to "${fileName}"`, {
            reason: err.message || err
          });
        } else {
          logger.info(`${res} successfully added to "${fileName}"`);
        }
      }
    } catch (error) {
      logger.error(`Failed to write data to file ${fileName}`, {
        reason: error.message || error
      });
      throw Error(error);
    }
  }

  async getLinkedUsers() {
    try {
      const fileName = `link-users.txt`;
      const users = await this.readFile(fileName);

      const usersKeyVal = users
        .trim()
        .split('\n')
        .reduce((acc, line) => {
          const [sourceId, targetId] = line.split('=>');
          acc[sourceId] = targetId;
          return acc;
        }, {});

      return [null, usersKeyVal];
    } catch (error) {
      return [error];
    }
  }
}

export default new FileSystem();
