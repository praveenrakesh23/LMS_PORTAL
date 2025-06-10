const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Announcement extends Model {
    static associate(models) {
      Announcement.belongsTo(models.Course, { foreignKey: 'courseId' });
      Announcement.belongsTo(models.User, { as: 'createdBy', foreignKey: 'createdById' });
    }
  }

  Announcement.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    createdById: {
      type: DataTypes.UUID,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Announcement',
    indexes: [
      { fields: ['courseId'] },
      { fields: ['createdById'] }
    ]
  });

  return Announcement;
}; 