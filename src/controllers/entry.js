import { Entry } from '../models';
import { logger } from '../helpers';

export default class EntryCtrl {
  static async fetchAllEntries() {
    return await Entry.findAll();
  }

  static async createEntry(entry) {
    try {
      const dbEntry = await Entry.create(entry);

      return [null, dbEntry];
    } catch (error) {
      return [error.message || error];
    }
  }

  static async createEntries(entries) {
    try {
      let i = 0;
      const res = [];

      while (i < entries.length) {
        for (const entry of entries) {
          try {
            const [err, dbEntry] = await this.createEntry(entry);
            if (err) throw new Error(err.message || err);
            if (dbEntry) res.push(dbEntry);
          } catch (error) {
            logger.error(`Failed to save entry ${entry.notes} to the db.`, {
              reason: error.message || error
            });
          } finally {
            i++;
          }
        }
      }

      return [null, res];
    } catch (error) {
      logger.error(`Failed to save entries to the db`, {
        reason: error.message || error
      });
      return [error.message || error];
    }
  }

  static async updateWithTargetEntry(source_id, { id: target_id }) {
    const updatedData = {
      target_id,
      synched: true
    };

    return await Entry.update(updatedData, { where: source_id });
  }
}
