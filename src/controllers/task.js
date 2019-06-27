import { Task } from '../models';
import { logger } from '../helpers';

export default class TaskCtrl {
  static async fetchAllTasks() {
    try {
      const allDbTasks = await Task.findAll();

      return [null, allDbTasks];
    } catch (error) {
      return [error.message || error];
    }
  }

  static async createTask(task) {
    try {
      const dbTask = await Task.create(task);

      return [null, dbTask];
    } catch (error) {
      return [error.message || error];
    }
  }

  static async createTasks(tasks) {
    try {
      let i = 0;
      const res = [];

      while (i < tasks.length) {
        for (const task of tasks) {
          try {
            const [err, dbTask] = await this.createTask(task);
            if (err) throw new Error(err.message || err);
            if (dbTask) res.push(dbTask);
          } catch (error) {
            logger.error(`Failed to save task ${task.name} to db`, {
              reason: error.message || error
            });
          } finally {
            i++;
          }
        }
      }

      return [null, res];
    } catch (error) {
      logger.error(`Failed to save tasks to the db`, {
        reason: error.message || error
      });
      return [error];
    }
  }

  static async updateWithTargetTask(source_id, { id: target_id }) {
    const updatedData = {
      target_id,
      synched: true
    };

    return await Task.update(updatedData, { where: source_id });
  }
}
