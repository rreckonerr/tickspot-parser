import { User } from '../models';
import { logger } from '../helpers';

export default class UserCtrl {
  static async fetchAllUsers() {
    return await User.findAll();
  }

  static async createUser(user, subscription_id) {
    try {
      const dbUser = await User.create({
        ...user,
        subscription_id: +subscription_id
      });

      return [null, dbUser];
    } catch (error) {
      return [error.message || error];
    }
  }

  static async createUsers(users, subscription_id) {
    try {
      let i = 0;
      const res = [];

      while (i < users.length) {
        for (const user of users) {
          try {
            const [err, dbUser] = await this.createUser(user, subscription_id);
            if (err) throw Error(err.message || err);
            if (dbUser) res.push(dbUser);
          } catch (error) {
            logger.error(`Failed to save user ${user.email} to db`, {
              reason: error.message || error
            });
          } finally {
            i++;
          }
        }
      }

      return [null, res];
    } catch (error) {
      logger.error(`Failed to save users to the db.`, {
        reason: error.message || error
      });
      return [error.message || error];
    }
  }

  static async updateWithTargetUser(source_id, { id: target_id }) {
    const toUpdate = {
      target_id,
      synched: true
    };

    return await User.update(toUpdate, { where: source_id });
  }
}
