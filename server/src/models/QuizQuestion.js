const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class QuizQuestion extends Model {
    static associate(models) {
      QuizQuestion.belongsTo(models.Quiz, { foreignKey: 'quizId' });
    }
  }

  QuizQuestion.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    quizId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    options: {
      type: DataTypes.JSON,
      allowNull: false
    },
    correctAnswer: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'QuizQuestion',
    indexes: [
      { fields: ['quizId'] }
    ]
  });

  return QuizQuestion;
}; 