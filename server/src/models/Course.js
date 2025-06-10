const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Course extends Model {
    static associate(models) {
      Course.belongsTo(models.User, {
        as: 'instructor',
        foreignKey: 'instructorId'
      });
      Course.hasMany(models.Module, {
        as: 'modules',
        foreignKey: 'courseId'
      });
      Course.belongsToMany(models.User, {
        through: models.Enrollment,
        as: 'students',
        foreignKey: 'courseId'
      });
    }

    // Method to update enrollment count
    async updateEnrollmentCount() {
      const count = await this.countStudents();
      await this.update({ studentsEnrolled: count });
    }
  }

  Course.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subtitle: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    instructorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'archived'),
      defaultValue: 'draft'
    },
    startDate: {
      type: DataTypes.DATE
    },
    endDate: {
      type: DataTypes.DATE
    },
    maxStudents: {
      type: DataTypes.INTEGER
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    ratingCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    level: {
      type: DataTypes.STRING,
      allowNull: false
    },
    levelDesc: {
      type: DataTypes.STRING,
      allowNull: false
    },
    studentsEnrolled: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    lastUpdated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    skills: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    learningObjectives: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    }
  }, {
    sequelize,
    modelName: 'Course',
    indexes: [
      {
        fields: ['instructorId']
      },
      {
        fields: ['status']
      }
    ]
  });

  return Course;
}; 