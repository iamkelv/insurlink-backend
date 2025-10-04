import { Role } from '../enums/user-type.enum';

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
}

