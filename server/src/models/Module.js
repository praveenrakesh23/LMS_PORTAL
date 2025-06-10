const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Module extends Model {
    static associate(models) {
      Module.belongsTo(models.Course, { foreignKey: 'courseId' });
      Module.hasMany(models.Lesson, { as: 'Lessons' });
      Module.hasMany(models.Assignment, { as: 'Assignments' });
      Module.hasMany(models.Quiz, { as: 'Quizzes' });
    }
  }

  Module.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Courses',
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
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    publishedAt: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Module',
    indexes: [
      {
        fields: ['courseId']
      },
      {
        fields: ['order']
      }
    ]
  });

  return Module;
}; 