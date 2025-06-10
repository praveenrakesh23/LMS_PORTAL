const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Lesson extends Model {
    static associate(models) {
      Lesson.belongsTo(models.Module, {
        as: 'Module',
        foreignKey: 'moduleId'
      });
    }
  }

  Lesson.init({
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
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Lesson',
    indexes: [
      { fields: ['moduleId'] },
      { fields: ['order'] }
    ]
  });

  return Lesson;
}; 