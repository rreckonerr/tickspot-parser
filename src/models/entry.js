import * as Sequelize from 'sequelize';

export default class Entry extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init(
      {
        id: {
          allowNull: false,
          unique: true,
          primaryKey: true,
          type: DataTypes.INTEGER
        },
        date: {
          allowNull: false,
          type: DataTypes.STRING
        },
        hours: {
          type: DataTypes.FLOAT
        },
        notes: {
          type: DataTypes.STRING
        },
        task_id: {
          allowNull: false,
          type: DataTypes.INTEGER
        },
        user_id: {
          allowNull: false,
          type: DataTypes.INTEGER
        },
        url: {
          allowNull: false,
          type: DataTypes.STRING
        },
        created_at: {
          allowNull: false,
          type: DataTypes.DATE
        },
        updated_at: {
          allowNull: false,
          type: DataTypes.DATE
        }
      },
      {
        sequelize,
        // timestamps are provided by the API
        timestamps: false,
        undescored: true,
        modelName: 'entry',
        name: {
          singular: 'entry',
          plural: 'entries'
        }
      }
    );

    return Entry;
  }

  static assosiate(models) {
    Entry.belongsTo(models.User);
  }
}
