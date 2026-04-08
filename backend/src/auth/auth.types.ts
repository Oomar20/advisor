export type AuthSessionUser = {
  id: string;
  name: string;
  email: string;
};

export type AuthenticatedRequest = {
  headers: {
    cookie?: string;
  };
  authUser?: AuthSessionUser;
};
