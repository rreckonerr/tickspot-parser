import * as Sequelize from 'sequelize';

export default class Subscription extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init(
      {
        subscription_id: {
          allowNull: false,
          unique: true,
          type: DataTypes.INTEGER
        },
        company: {
          allowNull: false,
          type: DataTypes.STRING
        },
        api_token: {
          allowNull: false,
          type: DataTypes.STRING
        }
      },
      {
        sequelize,
        modelName: 'subscription'
      }
    );

    return Subscription;
  }
}

// 'use strict';
// module.exports = (sequelize, DataTypes) => {
//   const Subscription = sequelize.define('Subscription', {
//     subscription_id: DataTypes.INTEGER,
//     company: DataTypes.STRING,
//     api_token: DataTypes.STRING
//   }, {});
//   Subscription.associate = function(models) {
//     // associations can be defined here
//   };
//   return Subscription;
// };
