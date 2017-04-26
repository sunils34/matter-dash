import controller from './controller';
import { isAuthenticated, isNotAuthenticated, isUserAuthenticatedWithoutOrg, isSuperAdmin } from './middleware';

export default (app) => {
  app.post('/create', isUserAuthenticatedWithoutOrg, controller.create);
  app.get('/create', isUserAuthenticatedWithoutOrg, controller.create);
};
