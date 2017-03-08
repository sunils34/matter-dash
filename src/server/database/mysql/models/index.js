import sequelize from '../sequelize';
import User from './User';
import Organization from './Organization';
import Report from './Report';
import ReportObject from './ReportObject';

Organization.belongsToMany(User, { through: 'UserOrganizations' });
User.belongsToMany(Organization, { through: 'UserOrganizations' });

Report.hasMany(ReportObject, { as: 'ReportObjects', foreignKey: 'reportId' });
ReportObject.belongsTo(Report, { as: 'Report', foreignKey: 'reportId' });

User.hasMany(Report, { as: 'Reports', foreignKey: 'userId' });
Report.belongsTo(User, { as: 'Owner', foreignKey: 'userId' });


function sync(...args) {
  return sequelize.sync(...args);
}

export default { sync };
export { User, Organization, Report, ReportObject };
