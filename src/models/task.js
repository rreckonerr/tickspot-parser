import * as Sequelize from 'sequelize';

export default class Task extends Sequelize.Model {
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
          type: DataTypes.STRING
        },
        budget: {
          type: DataTypes.FLOAT
        },
        position: {
          allowNull: false,
          type: DataTypes.INTEGER
        },
        project_id: {
          allowNull: false,
          type: DataTypes.INTEGER
        },
        dateClosed: {
          allowNull: true,
          type: DataTypes.DATE
        },
        billable: {
          allowNull: false,
          type: DataTypes.BOOLEAN
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
        modelName: 'task'
      }
    );

    return Task;
  }

  static assosiate(models) {
    Task.belongsTo(models.Project);
  }
}
