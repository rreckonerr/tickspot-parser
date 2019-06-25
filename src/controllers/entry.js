import { Entry } from '../models';

export default class EntryCtrl {
  static async fetchAllEntries() {
    return await Entry.findAll();
  }

  static async createEntry(entry) {
    return await Entry.create(entry);
  }

  static async updateWithTargetEntry(source_id, { id: target_id }) {
    const updatedData = {
      target_id,
      synched: true
    };

    return await Entry.update(updatedData, { where: source_id });
  }
}
