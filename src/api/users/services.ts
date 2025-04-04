import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { UserDatabase } from './database.ts';
import { User, RegisterUserRequest, AuthUserRequest, ProfileUserResponse } from './model.ts';
import { SALT_ROUNDS, TOKEN_SECRET_KEY } from '@config/constants.ts';
import jwt, { JwtPayload } from 'jsonwebtoken';

export class UserService {
  constructor(private userDatabase: UserDatabase) { }

  public async createUser(registerUserResponse: RegisterUserRequest) {
    const { firstname, lastname, email, password } = registerUserResponse;

    if (typeof firstname !== 'string' || firstname.length < 1) throw new Error('Invalid firstname');
    if (typeof lastname !== 'string' || lastname.length < 1) throw new Error('Invalid lastname');
    if (typeof email !== 'string' || !email.includes('@')) throw new Error('Invalid email');
    if (typeof password !== 'string' || password.length < 4) throw new Error('Invalid password');

    const existingUser = await this.userDatabase.getUserByEmail(email);
    if (existingUser) throw new Error('User with this email already exists');

    const id = crypto.randomUUID();
    const hashedPassword = await bcrypt.hash(password, parseInt(SALT_ROUNDS));
    const user: User = { id, firstname, lastname, email, password: hashedPassword }

    await this.userDatabase.createUser(user);
    return user;
  }

  public async authUser(authUserResponse: AuthUserRequest) {
    const { email, password } = authUserResponse;

    if (typeof email !== 'string' || !email.includes('@')) throw new Error('Invalid email');
    if (typeof password !== 'string' || password.length < 4) throw new Error('Invalid password');

    const user = await this.userDatabase.getUserByEmail(email);
    if (!user) throw new Error('User with this email does not exist');

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new Error('Invalid password');

    const token = await this.generateToken(user);

    return { token };
  }

  public async getUserLogged(token: string) {
    const decoded = jwt.verify(token, TOKEN_SECRET_KEY) as JwtPayload;
    
    const { id } = decoded;
    const profile:ProfileUserResponse = await this.userDatabase.getUserById(id);

    return profile;
  }

  public async updateUserData(token: string, profile: ProfileUserResponse) {
    const decoded = jwt.verify(token, TOKEN_SECRET_KEY) as JwtPayload;
    
    const { id } = decoded;
    const { firstname, lastname, email } = profile;
    
    if (typeof firstname !== 'string' || firstname.length < 1) throw new Error('Invalid firstname');
    if (typeof lastname !== 'string' || lastname.length < 1) throw new Error('Invalid lastname');
    if (typeof email !== 'string' || !email.includes('@')) throw new Error('Invalid email');

    const user = await this.userDatabase.getUserById(id);
    if (!user) throw new Error('User does not exist');

    const userWithSameEmail = await this.userDatabase.getUserByEmail(email);
    if (userWithSameEmail && userWithSameEmail.id !== id) throw new Error('User with this email already exists');
  
    if (user.firstname !== firstname) await this.userDatabase.updateUser(id, 'firstname', firstname);
    if (user.lastname !== lastname) await this.userDatabase.updateUser(id, 'lastname', lastname);
    if (user.email !== email) await this.userDatabase.updateUser(id, 'email', email);

    return { firstname, lastname, email };
  }

  private async generateToken(user: User) {
    return jwt.sign(
      {
        id: user.id,
        name: user.firstname,
      },
      TOKEN_SECRET_KEY,
      {
        expiresIn: '2h'
      }
    );
  }

}