import { Request } from 'express';
import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Req,
  UseGuards,
  Post,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards/local-auth.guard';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('User Profile')
@Controller('user-profile')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/create')
  create(@Req() req: Request, @Body() body: CreateUserProfileDto) {
    const { user }: any = req;
    return this.userProfileService.create(user, body);
  }

  @HttpCode(HttpStatus.OK)
  @Patch('/update')
  update(@Req() req: Request, @Body() body: UpdateUserProfileDto) {
    const { user }: any = req;
    return this.userProfileService.update(user, body);
  }

  @Get()
  myProfile(@Req() req: Request) {
    const { user }: any = req;
    return this.userProfileService.findMe(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userProfileService.findOne(id);
  }
}
