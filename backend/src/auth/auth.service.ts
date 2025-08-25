import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User, UserRole, UserStatus } from '../users/user.entity';

export interface RegisterDto {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { name, email, phone, password } = registerDto;

    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await this.usersService.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
    });

    // Generate JWT token
    const token = this.generateToken(user);

    return {
      success: true,
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        status: user.status,
        role: user.role,
      },
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const token = this.generateToken(user);

    return {
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        status: user.status,
        role: user.role,
      },
      token,
    };
  }

  async validateUser(payload: JwtPayload) {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async createDeveloperUser() {
    const devEmail = 'developer@applyai.com';
    const devPassword = 'dev123456';

    // Check if developer user already exists
    const existingDev = await this.usersService.findByEmail(devEmail);
    if (existingDev) {
      return {
        success: true,
        message: 'Developer user already exists',
        credentials: {
          email: devEmail,
          password: devPassword,
          role: existingDev.role
        }
      };
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(devPassword, saltRounds);

    // Create developer user with admin privileges
    const devUser = await this.usersService.create({
      name: 'Developer Admin',
      email: devEmail,
      phone: '+91-9999999999',
      password: hashedPassword,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      isEmailVerified: true,
      isPhoneVerified: true,
    });

    return {
      success: true,
      message: 'Developer user created successfully',
      credentials: {
        email: devEmail,
        password: devPassword,
        role: devUser.role,
        userId: devUser.id
      }
    };
  }

  private generateToken(user: User) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }
}
