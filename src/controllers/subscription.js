import { Subscription } from '../models';

export default class PropjectCtrl {
  static async fetchAllSubscriptions() {
    return await Subscription.findAll();
  }

  static async createSubscription(role) {
    try {
      const res = await Subscription.create(role);

      return [null, res];
    } catch (error) {
      return [
        `Failed to create subscription for ${role.company} ` + error.message ||
          error
      ];
    }
  }

  static async updateWithTargetSubscription(source_id, { id: target_id }) {
    const toUpdate = {
      target_id,
      synched: true
    };

    return await Subscription.update(toUpdate, { where: source_id });
  }
}
