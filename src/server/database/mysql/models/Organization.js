import shortid from 'shortid';

export default (Model, DataTypes) => {
  const Organization = Model.define('organizations', {
    id: {
      type: DataTypes.STRING,
      defaultValue: shortid.generate,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING },
    subdomain: { type: DataTypes.STRING, unique: 'compositeIndex' },
    logoUrl: {
      type: DataTypes.STRING,
    },
  }, {
    indexes: [],
    classMethods: {
      associate: (models) => {
      },
    },
  }, { tableName: 'organizations' });

  return Organization;
};

