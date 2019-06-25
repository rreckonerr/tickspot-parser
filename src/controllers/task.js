import { Task } from '../models';

export default class TaskCtrl {
  static async fetchAllTasks() {
    return await Task.findAll();
  }

  static async createTask(user) {
    return await Task.create(user);
  }

  static async updateWithTargetTask(source_id, { id: target_id }) {
    const updatedData = {
      target_id,
      synched: true
    };

    return await Task.update(updatedData, { where: source_id });
  }
}
