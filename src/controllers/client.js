import { Client } from '../models';
import { logger } from '../helpers';

export default class ClientCtrl {
  static async fetchAllClients() {
    try {
      const allDbClients = await Client.findAll();

      return [null, allDbClients];
    } catch (error) {
      return [error.message || error];
    }
  }

  static async createClient(client, subscription_id) {
    try {
      const dbClient = await Client.create({
        ...client,
        subscription_id: +subscription_id
      });

      return [null, dbClient];
    } catch (error) {
      return [error.message || error];
    }
  }

  static async createClients(clients, subscription_id) {
    try {
      let i = 0;
      const res = [];

      while (i < clients.length) {
        for (const client of clients) {
          try {
            const [err, dbClient] = await this.createClient(
              client,
              subscription_id
            );
            if (err) throw new Error(err.message || error);
            if (dbClient) res.push(dbClient);
          } catch (error) {
            logger.error(`Failed to save client ${client.name} to db`, {
              reason: error.message || error
            });
          } finally {
            i++;
          }
        }
      }

      return [null, res];
    } catch (error) {
      logger.error(`Failed to save clients to the db`, {
        reason: error.message || error
      });
      return [error];
    }
  }

  static async updateWithTargetClient(source_id, { id: target_id }) {
    const toUpdate = {
      target_id,
      synched: true
    };

    return await Client.update(toUpdate, { where: source_id });
  }
}
