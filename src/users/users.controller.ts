import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '@/auth/guards/local-auth.guard';
import { ApiQueryArray } from '@/common/decorators/apiQuery.decorator';
import { ApiPaginationResponseInterceptor } from '@/common/interceptors/api-pagination.response';
import { PaginationDto } from '@/common/dtos/pagination.dto';

import { Request } from 'express';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  findMe(@Req() req: Request) {
    return this.usersService.me(req);
  }

  @Get('one/:userId')
  getUser(@Param('userId') id: string) {
    return this.usersService.findOne(id);
  }

  @Get('/plan')
  userPlan(@Req() req: Request) {
    const { user }: any = req;
    return this.usersService.getUserPlan(user);
  }

  @Put('activeOrInactive/:id')
  activeOrInactive(@Param('id') id: string) {
    return this.usersService.activeOrInactiveUser(id);
  }

  @UseInterceptors(ApiPaginationResponseInterceptor)
  @Get('/all')
  @ApiQueryArray([
    { name: 'limit', type: Number, minimum: 1, default: 10 },
    {
      name: 'page',
      type: Number,
      required: false,
      minimum: 1,
      default: 1,
    },
    { name: 'search', type: 'text', required: false, example: 'abc' },
    {
      name: 'start_date',
      type: 'text',
      required: false,
      example: '2023/09/09',
    },
    {
      name: 'end_date',
      type: 'text',
      required: false,
      example: '2023/10/10',
    },
  ])
  findAll(
    @Req() req: Request,
    @Query('search') search: string,
    @Query('start_date') startDate: string,
    @Query('end_date') endDate: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ) {
    const pagination: PaginationDto = {
      limit,
      page,
      search,
      startDate,
      endDate,
    };
    return this.usersService.findAll(req, pagination);
  }

  @Delete('/delete/:id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
