import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  findByPhone(phone: string): Promise<User> {
    return this.usersRepository.findOne({ where: { phone } });
  }

  findById(id: string): Promise<User> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async updateProfile(id: string, profileData: any): Promise<User> {
    await this.usersRepository.update(id, { profile: profileData });
    return this.findById(id);
  }
}
