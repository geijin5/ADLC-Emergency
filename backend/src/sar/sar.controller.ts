import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SarService } from './sar.service';
import { CreateSarOperationDto } from './dto/create-sar-operation.dto';
import { UpdateSarOperationDto } from './dto/update-sar-operation.dto';
import { CreateSarRouteDto } from './dto/create-sar-route.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('sar')
export class SarController {
  constructor(private readonly sarService: SarService) {}

  @Get('public')
  findAllPublic() {
    return this.sarService.findAll();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@CurrentUser() user: User) {
    return this.sarService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user?: User) {
    return this.sarService.findOne(id, user);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createSarOperationDto: CreateSarOperationDto, @CurrentUser() user: User) {
    return this.sarService.create(createSarOperationDto, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateSarOperationDto: UpdateSarOperationDto,
    @CurrentUser() user: User,
  ) {
    return this.sarService.update(id, updateSarOperationDto, user);
  }

  @Post(':id/routes')
  @UseGuards(JwtAuthGuard)
  addRoute(
    @Param('id') id: string,
    @Body() createSarRouteDto: CreateSarRouteDto,
    @CurrentUser() user: User,
  ) {
    return this.sarService.addRoute(id, createSarRouteDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.sarService.remove(id, user);
  }
}

