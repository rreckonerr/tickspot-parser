import * as Sequelize from 'sequelize';

export default class Project extends Sequelize.Model {
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
        budget: {
          type: DataTypes.INTEGER
        },
        date_closed: {
          allowNull: true,
          type: DataTypes.DATE
        },
        notifications: {
          type: DataTypes.BOOLEAN
        },
        billable: {
          type: DataTypes.BOOLEAN
        },
        recurring: {
          type: DataTypes.BOOLEAN
        },
        client_id: {
          type: DataTypes.INTEGER
        },
        subscription_id: {
          type: DataTypes.INTEGER
        },
        owner_id: {
          allowNull: false,
          type: DataTypes.INTEGER
        },
        url: {
          type: DataTypes.STRING
        },
        created_at: {
          type: DataTypes.DATE
        },
        updated_at: {
          type: DataTypes.DATE
        }
      },
      {
        sequelize,
        // timestamps are provided by the API
        timestamps: false,
        undescored: true,
        modelName: 'project'
      }
    );

    return Project;
  }

  static assosiate(models) {
    Project.belongsTo(models.Subscription);
    Project.hasMany(model.Task);
  }
}

//   const projectStruct = {
//     id: 1830355,
//     name: 'Simply The Best',
//     budget: 100,
//     date_closed: null,
//     notifications: false,
//     billable: true,
//     recurring: false,
//     client_id: 374721,
//     owner_id: 339348,
//     url: 'http://secure.tickspot.com/126919/api/v2/projects/1830355.json',
//     created_at: '2019-06-20T05:11:29.000-04:00',
//     updated_at: '2019-06-20T05:30:31.000-04:00'
//   };
