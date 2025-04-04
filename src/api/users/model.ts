export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export type RegisterUserRequest = Omit<User, 'id'>;

export type AuthUserRequest = Pick<User, 'email' | 'password'>;

export type ProfileUserResponse = Omit<User, 'id' | 'password'>;