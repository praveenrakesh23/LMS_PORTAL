const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Grade extends Model {
    static associate(models) {
      Grade.belongsTo(models.User, { foreignKey: 'userId' });
      Grade.belongsTo(models.Course, { foreignKey: 'courseId' });
      Grade.belongsTo(models.Assignment, { foreignKey: 'assignmentId' });
      Grade.belongsTo(models.Quiz, { foreignKey: 'quizId' });
    }
  }

  Grade.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    assignmentId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    quizId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    score: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    maxScore: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    grade: {
      type: DataTypes.STRING
    },
    feedback: {
      type: DataTypes.TEXT
    },
    type: {
      type: DataTypes.ENUM('assignment', 'quiz'),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Grade',
    indexes: [
      { fields: ['userId'] },
      { fields: ['courseId'] },
      { fields: ['assignmentId'] },
      { fields: ['quizId'] }
    ]
  });

  return Grade;
}; 