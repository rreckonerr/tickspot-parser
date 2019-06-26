import { Project } from '../models';

export default class PropjectCtrl {
  static async fetchAllProjects() {
    return await Project.findAll();
  }

  static async createProjects(projects, subscription_id) {
    try {
      let i = 0;
      const res = [];

      while (i < projects.length) {
        for (const project of projects) {
          try {
            const [err, dbProject] = await this.createProject(
              project,
              subscription_id
            );
            if (err) throw new Error(err.message || error);
            if (dbProject) res.push(dbProject);
          } catch (error) {
            logger.error(`Failed to save project ${project.name} to db`, {
              reason: error.message || error
            });
          } finally {
            i++;
          }
        }
      }

      return [null, res];
    } catch (error) {
      logger.error(`Failed to save projects to the db`, {
        reason: error.message || error
      });
      return [error];
    }
  }

  static async createProject(project, subscription_id) {
    try {
      const dbProject = await Project.create({
        ...project,
        subscription_id: +subscription_id
      });

      return [null, dbProject];
    } catch (error) {
      return [error.message || error];
    }
  }

  static async updateWithTargetProject(source_id, { id: target_id }) {
    const toUpdate = {
      target_id,
      synched: true
    };

    return await Project.update(toUpdate, { where: source_id });
  }
}
