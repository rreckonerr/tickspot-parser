import { User } from '../models';

export default class UserCtrl {
  static async fetchAllUsers() {
    return await User.findAll();
  }

  static async createUser(user) {
    return await User.create(user);
  }

  static async updateWithTargetUser(source_id, { id: target_id }) {
    const toUpdate = {
      target_id,
      synched: true
    };

    return await User.update(toUpdate, { where: source_id });
  }
}
