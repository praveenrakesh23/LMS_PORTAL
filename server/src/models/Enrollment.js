const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Enrollment extends Model {
    static associate(models) {
      Enrollment.belongsTo(models.User, { foreignKey: 'userId' });
      Enrollment.belongsTo(models.Course, { foreignKey: 'courseId' });
    }
  }

  Enrollment.init({
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
    status: {
      type: DataTypes.ENUM('active', 'completed', 'dropped'),
      defaultValue: 'active'
    },
    progress: {
      type: DataTypes.FLOAT, // percentage
      defaultValue: 0
    },
    enrolledAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    completedAt: {
      type: DataTypes.DATE
    },
    lastAccessed: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Enrollment',
    indexes: [
      { fields: ['userId'] },
      { fields: ['courseId'] }
    ],
    hooks: {
      afterCreate: async (enrollment) => {
        const course = await enrollment.getCourse();
        await course.updateEnrollmentCount();
      },
      afterUpdate: async (enrollment) => {
        const course = await enrollment.getCourse();
        await course.updateEnrollmentCount();
      },
      afterDestroy: async (enrollment) => {
        const course = await enrollment.getCourse();
        await course.updateEnrollmentCount();
      }
    }
  });

  return Enrollment;
}; 