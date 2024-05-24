import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { GraphsService } from './graphs.service';
import { CreateGraphDto } from './dto/create-graph.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards/local-auth.guard';
import { Request } from 'express';

@ApiTags('Graphs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('graphs')
export class GraphsController {
  constructor(private readonly graphsService: GraphsService) {}

  @Post()
  create(@Body() createGraphDto: CreateGraphDto) {
    return this.graphsService.create(createGraphDto);
  }

  @Get()
  findAll() {
    return this.graphsService.findAll();
  }

  @Get('users-counts')
  async getRegisteredUsersCount() {
    return this.graphsService.getRegisteredUsersCount();
  }

  // @Get('total-questions-counts')
  // async questionsGraphs() {
  //   return this.graphsService.questionsGraphs();
  // }

  // @Get('question-counts')
  // async getQuestionsCount() {
  //   return this.graphsService.getQuestionsCounts();
  // }

  // @Get('users-total-question-counts')
  // async getUsersQuestionsCount() {
  //   return this.graphsService.getUsersQuestionsCount();
  // }

  // @Get('user-question-counts')
  // async getUserQuestionsCount(@Req() req: Request) {
  //   const user: any = req?.user;
  //   return this.graphsService.getUserQuestionsCount(user?.id);
  // }

  // @Get('agreement-counts')
  // async getAgreementsCount() {
  //   return this.graphsService.getAgreementsCount();
  // }
  // @Get('user/agreement-counts')
  // async getAgreementsCounts(@Req() req: Request) {
  //   const user: any = req?.user;
  //   return this.graphsService.getAgreementsCounts(user?.id);
  // }
  // @Get('admin/agreement-counts')
  // async getAllAgreementsCounts() {
  //   return this.graphsService.getAllAgreementsCounts();
  // }
}
