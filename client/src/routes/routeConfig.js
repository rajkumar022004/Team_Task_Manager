import { ROLES } from '../context/AuthContext';

export const ROUTE_ACCESS = {
  public: null,
  authenticated: [ROLES.ADMIN, ROLES.MEMBER],
  adminOnly: [ROLES.ADMIN],
  memberOnly: [ROLES.MEMBER],
};
