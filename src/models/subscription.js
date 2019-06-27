import * as Sequelize from 'sequelize';

export default class Subscription extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init(
      {
        // subscription_id: {
        //   allowNull: false,
        //   primaryKey: true,
        //   unique: true,
        //   type: DataTypes.INTEGER
        // },
        company: {
          allowNull: false,
          type: DataTypes.STRING
        },
        api_token: {
          allowNull: false,
          type: DataTypes.STRING
        },
        target_id: {
          allowNull: false,
          type: DataTypes.INTEGER
        }
      },
      {
        sequelize,
        underscored: true,
        modelName: 'subscription'
      }
    );

    return Subscription;
  }

  static assosiate(model) {
    Subscription.hasMany(model.Project);
    Subscription.hasMany(model.User);
  }
}
