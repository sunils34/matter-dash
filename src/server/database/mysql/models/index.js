import fs from 'fs';
import path from 'path';
import sequelize from '../sequelize';

const db = {};

fs.readdirSync(__dirname)
  .filter(file => (
    (file.indexOf('.') !== 0) && (file !== 'index.js')
  ))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    const modelName = file.replace('.js', '');
    db[modelName] = model;
  });

Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});


function sync(...args) {
  return sequelize.sync(...args);
}

db.sync = sync;
db.sequelize = sequelize;

export default db;

