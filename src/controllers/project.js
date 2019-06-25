import { Project } from '../models';

export default class PropjectCtrl {
  static async fetchAllProjects() {
    return await Project.findAll();
  }

  static async createProject(project, subscription_id) {
    return await Project.create({
      ...project,
      subscription_id: +subscription_id
      //   synched: false,
    });
  }

  static async updateWithTargetProject(source_id, { id: target_id }) {
    const toUpdate = {
      target_id,
      synched: true
    };

    return await Project.update(toUpdate, { where: source_id });
  }
}
