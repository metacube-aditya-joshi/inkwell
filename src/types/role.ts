export const ACCOUNT_ROLES = {
    admin: "ADMIN",
    user: "USER",
    pro: "PRO",
  } as const;
  
  export const AccountRole = Object.values(ACCOUNT_ROLES);
  export type AccountType = (typeof ACCOUNT_ROLES)[keyof typeof ACCOUNT_ROLES];