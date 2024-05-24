import { Repository } from 'typeorm';
import { HttpException, Injectable } from '@nestjs/common';

import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { Users } from '@/users/entities/user.entity';
import { UserProfile } from './entities/user-profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UsersService } from '@/users/users.service';
import { UserRoles } from '@/common/constants/enum';
import { FORBIDDEN_RESPONSE } from '@/common/constants/http-responses.types';

@Injectable()
export class UserProfileService {
  constructor(
    private usersService: UsersService,
    @InjectRepository(UserProfile)
    private readonly profileRepo: Repository<UserProfile>,
  ) {}

  async create(user: Users, body: CreateUserProfileDto) {
    const { id } = user;
    const isUser = await this.usersService.getByUserById(id);
    // if (isUser?.userRole === UserRoles.ADMIN)
    //   throw new HttpException(
    //     FORBIDDEN_RESPONSE.message,
    //     FORBIDDEN_RESPONSE.status,
    //   );
    const { userProfile } = isUser;
    if (!userProfile) {
      const profile = this.profileRepo.create({
        ...body,
        birthDate: body.birthDate as string,
        user: isUser,
      });
      const res = await this.profileRepo.save(profile);
      const { user, ...rest } = res;
      return rest;
    }

    const profile = this.profileRepo.merge(userProfile, {
      ...body,
      birthDate: body.birthDate as string,
    });
    return await this.profileRepo.save(profile);
  }

  async update(user: Users, body: UpdateUserProfileDto) {
    const { id } = user;
    const isUser = await this.usersService.getByUserById(id);
    // if (isUser?.userRole === UserRoles.ADMIN)
    //   throw new HttpException(
    //     FORBIDDEN_RESPONSE.message,
    //     FORBIDDEN_RESPONSE.status,
    //   );
    const { userProfile } = isUser;

    const profile = this.profileRepo.merge(userProfile, {
      ...body,
      birthDate: body.birthDate as string,
    });
    return await this.profileRepo.save(profile);
  }

  async findMe(user: Users) {
    const { id } = user;
    const profile = await this.profileRepo.findOne({
      where: {
        user: {
          id,
        },
      },
    });
    return profile;
  }

  async findOne(id: string) {
    const profile = await this.profileRepo.findOne({
      where: {
        user: {
          id,
        },
      },
    });
    return profile;
  }

  remove(id: number) {
    return `This action removes a #${id} userProfile`;
  }
}
