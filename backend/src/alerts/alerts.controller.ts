import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { AcknowledgmentStatus } from './entities/alert-acknowledgment.entity';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get('public')
  findAllPublic() {
    return this.alertsService.findActivePublicAlerts();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@CurrentUser() user: User) {
    return this.alertsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user?: User) {
    return this.alertsService.findOne(id, user);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createAlertDto: CreateAlertDto, @CurrentUser() user: User) {
    return this.alertsService.create(createAlertDto, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateAlertDto: UpdateAlertDto,
    @CurrentUser() user: User,
  ) {
    return this.alertsService.update(id, updateAlertDto, user);
  }

  @Post(':id/publish')
  @UseGuards(JwtAuthGuard)
  publish(@Param('id') id: string, @CurrentUser() user: User) {
    return this.alertsService.publish(id, user);
  }

  @Post(':id/acknowledge')
  @UseGuards(JwtAuthGuard)
  acknowledge(
    @Param('id') id: string,
    @Query('status') status: AcknowledgmentStatus,
    @CurrentUser() user: User,
  ) {
    return this.alertsService.acknowledge(id, user.id, status);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.alertsService.remove(id, user);
  }
}

