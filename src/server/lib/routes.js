import controller from './controller';
import { isAuthenticated, isNotAuthenticated, isUserAuthenticatedWithoutOrg, isSuperAdmin } from './middleware';

export default (app) => {
  app.post('/signup', isUserAuthenticatedWithoutOrg, controller.signup);
  app.get('/signup', isUserAuthenticatedWithoutOrg, controller.signup);
};
