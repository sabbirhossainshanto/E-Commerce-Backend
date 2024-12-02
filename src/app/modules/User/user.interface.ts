import { Role, UserStatus } from "@prisma/client";

export interface IUser {
  email: string;
}

export interface IUserRoleStatus {
  role?: Role;
  isDeleted?: boolean;
  status?: UserStatus;
}
