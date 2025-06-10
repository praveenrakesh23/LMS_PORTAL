const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Assignment extends Model {
    static associate(models) {
      Assignment.belongsTo(models.Module, {
        as: 'Module',
        foreignKey: 'moduleId'
      });
      Assignment.hasMany(models.Grade, {
        as: 'Grades',
        foreignKey: 'assignmentId'
      });
    }
  }

  Assignment.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    moduleId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Modules',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Assignment',
    indexes: [
      { fields: ['moduleId'] },
      { fields: ['order'] }
    ]
  });

  return Assignment;
}; 