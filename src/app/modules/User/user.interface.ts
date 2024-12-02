import { Role, UserStatus } from "@prisma/client";

export interface IUser {
  email: string;
  role: Role;
  iat: number;
  exp: number;
}

export interface IUserRoleStatus {
  role?: Role;
  isDeleted?: boolean;
  status?: UserStatus;
}
