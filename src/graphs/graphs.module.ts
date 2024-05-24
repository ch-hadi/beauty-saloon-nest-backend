import { Module } from '@nestjs/common';
import { GraphsService } from './graphs.service';
import { GraphsController } from './graphs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Graph } from './entities/graph.entity';
import { Users } from '@/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Graph, Users])],
  controllers: [GraphsController],
  providers: [GraphsService],
})
export class GraphsModule {}
