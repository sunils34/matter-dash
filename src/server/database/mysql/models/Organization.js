import shortid from 'shortid';

export default (Model, DataTypes) => {
  const Organization = Model.define('organizations', {
    id: {
      type: DataTypes.STRING,
      defaultValue: shortid.generate,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
  }, {
    indexes: [],
    classMethods: {
      associate: (models) => {
        // Associate the organization and user
        Organization.belongsToMany(models.User, { through: 'UserOrganizations' });
      },
    },
  }, { tableName: 'organizations' });

  return Organization;
};

