import * as Sequelize from 'sequelize';

export default class User extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init(
      {
        id: {
          allowNull: false,
          unique: true,
          primaryKey: true,
          type: DataTypes.INTEGER
        },
        target_id: {
          allowNull: false,
          unique: true,
          type: DataTypes.INTEGER
        },
        first_name: {
          allowNull: false,
          type: DataTypes.STRING
        },
        last_name: {
          allowNull: false,
          type: DataTypes.STRING
        },
        email: {
          allowNull: false,
          type: DataTypes.STRING
        },
        timezone: {
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
        },
        billable_rate: {
          allowNull: true,
          type: DataTypes.INTEGER
        },
        subscription_id: {
          allowNull: false,
          type: DataTypes.INTEGER
        }
      },
      {
        sequelize,
        // timestamps are provided by the API
        timestamps: false,
        underscored: true,
        modelName: 'user'
      }
    );

    return User;
  }

  static assosiate(models) {
    User.belongsTo(models.Subscription);
    User.hasMany(models.Entry);
    User.hasMany(models.Project, { foreignKey: 'owner_id' });
    // User.belongsTo(models.Project);
  }
}
