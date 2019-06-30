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

  writeUserToFile(fileName, user) {
    return new Promise((resolve, reject) => {
      if (!user) reject(new Error(`No user data provided`));

      const { id, first_name, last_name, email } = user;

      if (!id || !email) reject(new Error(`User id and email are required`));

      const lineToAdd = `${id} | ${email} | ${first_name} | ${last_name}\n`;

      fs.appendFile(fileName, lineToAdd, err => {
        if (err) reject(new Error(err));
        resolve(email);
      });
    });
  }

  async *writeUsersToFileGen(fileName, users) {
    try {
      let i = 0;
      while (i < users.length) {
        const user = users[i];
        try {
          const userEmail = await this.writeUserToFile(fileName, user);

          yield [null, userEmail];
        } catch (error) {
          yield [error, user.email];
        } finally {
          i++;
        }
      }
    } catch (error) {
      logger.error(`Failed to write users to a file`, {
        reason: error.message || error
      });
      throw Error(error);
    }
  }

  async writeUsersToFile(fileName, users) {
    try {
      await this.removeFile(fileName);

      for await (const [err, userEmail] of this.writeUsersToFileGen(
        fileName,
        users
      )) {
        if (err) {
          logger.error(`Failed to write user ${userEmail} to "${fileName}"`, {
            reason: err.message || err
          });
        } else {
          logger.info(`User ${userEmail} successfully added to "${fileName}"`);
        }
      }
    } catch (error) {
      logger.error(`Failed to write users to "${fileName}"`, {
        reason: error.message || error
      });
      console.error(error);
      process.exit(1);
    }
  }
}

export default new FileSystem();
