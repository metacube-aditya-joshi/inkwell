import { AccountType } from "./role.js";

export type UserRequest = {
    id: number;
    username: string;
    email: string;
    role: AccountType;
  };