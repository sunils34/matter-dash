import sequelize from '../sequelize';
import User, { comparePassword } from './User';
import Organization from './Organization';

Organization.belongsToMany(User, {through:'UserOrganizations'});
User.belongsToMany(Organization, {through:'UserOrganizations'});

function sync(...args) {
  return sequelize.sync(...args);
}

export default { sync };
export { User, Organization };
