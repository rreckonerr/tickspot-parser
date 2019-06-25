import { Client } from '../models';

export default class ClientCtrl {
  static async fetchAllClients() {
    return await Client.findAll();
  }

  static async createClient(client) {
    return await Client.create(client);
  }

  static async updateWithTargetClient(source_id, { id: target_id }) {
    const toUpdate = {
      target_id,
      synched: true
    };

    return await Client.update(toUpdate, { where: source_id });
  }
}
