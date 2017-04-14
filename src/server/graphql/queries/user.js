import UserType from '../types/UserType';

const user = {
  type: UserType,
  args: {},
  resolve(parent) {
    if (parent.request.user) {
      const u = parent.request.user;
      return {
        id: u.id,
        email: u.email,
        name: u.name,
        createdAt: u.created_at,
        impersonating: u.impersonating,
      };
    }
    return null;
  },
};

export default user;
