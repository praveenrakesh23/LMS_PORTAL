const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Quiz extends Model {
    static associate(models) {
      Quiz.belongsTo(models.Course, { foreignKey: 'courseId' });
      Quiz.belongsTo(models.Module, {
        as: 'Module',
        foreignKey: 'moduleId'
      });
      Quiz.hasMany(models.QuizQuestion, { as: 'questions', foreignKey: 'quizId' });
      Quiz.hasMany(models.Grade, {
        as: 'Grades',
        foreignKey: 'quizId'
      });
    }
  }

  Quiz.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    moduleId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: 'Quiz'
    },
    duration: {
      type: DataTypes.INTEGER // in minutes
    },
    totalPoints: {
      type: DataTypes.INTEGER
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'archived'),
      defaultValue: 'published'
    }
  }, {
    sequelize,
    modelName: 'Quiz',
    indexes: [
      { fields: ['courseId'] },
      { fields: ['moduleId'] }
    ]
  });

  return Quiz;
}; 