import * as Sequelize from 'sequelize';

export default class Client extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init(
      {
        id: {
          allowNull: false,
          unique: true,
          primaryKey: true,
          type: DataTypes.INTEGER
        },
        name: {
          allowNull: false,
          type: DataTypes.STRING
        },
        archive: {
          allowNull: false,
          type: DataTypes.BOOLEAN
        },
        url: {
          allowNull: false,
          type: DataTypes.STRING
        },
        subscription_id: {
          allowNull: false,
          type: DataTypes.INTEGER
        },
        updated_at: {
          allowNull: false,
          type: DataTypes.DATE
        },
        created_at: {
          //   allowNull: false,
          type: DataTypes.DATE
        }
      },
      {
        sequelize,
        underscored: true,
        modelName: 'client'
      }
    );

    return Client;
  }

  static assosiate(models) {
    Client.hasMany(models.Project);
  }
}

// const clientExample = {
//   id: 363380,
//   name: 'digis',
//   archive: false,
//   url: 'http://secure.tickspot.com/110437/api/v2/clients/363380.json',
//   updated_at: '2019-06-25T07:31:39.000-04:00'
// };
