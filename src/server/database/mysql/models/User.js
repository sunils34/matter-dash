import bcrypt from 'bcryptjs';
import shortid from 'shortid';

const SALT_WORK_FACTOR = 10;
const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
  const hash = bcrypt.hashSync(password || '', salt);
  return hash;
};


const comparePassword = (password, hash) => (
  bcrypt.compareSync(password, hash) // true
);

export default (Model, DataTypes) => {
  const User = Model.define('users', {
    id: {
      type: DataTypes.STRING,
      defaultValue: () => (
        `u_${shortid.generate()}`
      ),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING(255),
      validate: { isEmail: true },
    },
    emailConfirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    picture: {
      type: DataTypes.STRING(255),
    },

    gender: {
      type: DataTypes.STRING(50),
    },

    location: {
      type: DataTypes.STRING(100),
    },

    profileId: {
      type: DataTypes.STRING(100),
    },
    profileType: {
      type: DataTypes.STRING(100),
    },
    website: {
      type: DataTypes.STRING(255),
    },
    passwordHash: DataTypes.STRING,
    password: {
      type: DataTypes.VIRTUAL,
      set: (val) => {
        this.setDataValue('password', val); // Remember to set the data value, otherwise it won't be validated
        const hash = hashPassword(val);
        this.setDataValue('passwordHash', hash);
      },
      validate: {
        /* isLongEnough: function (val) {
      if (val.length < 7) {
      throw new Error("Please choose a longer password")
      }
      }*/
      },
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user',
    },
  }, {
    classMethods: {
      associate: (models) => {
        // Associate the organization and user
        User.belongsTo(models.Organization);
      },
    },
    indexes: [
      { fields: ['email'] },
      { fields: ['profileId'] },
    ],
  }, { tableName: 'users' });

  return User;
};

export { comparePassword };
