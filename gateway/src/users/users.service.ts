import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async findOneByTelegramId(telegramId: number | string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { telegramId: telegramId.toString() } });
    }

    async create(userData: Partial<User>): Promise<User> {
        const user = this.usersRepository.create(userData);
        return this.usersRepository.save(user);
    }

    async findOrCreate(telegramId: number, username?: string, firstName?: string, lastName?: string): Promise<User> {
        let user = await this.findOneByTelegramId(telegramId);
        if (!user) {
            user = await this.create({
                telegramId: telegramId.toString(),
                username,
                firstName,
                lastName,
            });
        }
        return user;
    }
}
