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
import { MapsService } from './maps.service';
import { CreateMapFeatureDto } from './dto/create-map-feature.dto';
import { UpdateMapFeatureDto } from './dto/update-map-feature.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('maps')
export class MapsController {
  constructor(private readonly mapsService: MapsService) {}

  @Get('public')
  findAllPublic() {
    return this.mapsService.findAll();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@CurrentUser() user: User) {
    return this.mapsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user?: User) {
    return this.mapsService.findOne(id, user);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createMapFeatureDto: CreateMapFeatureDto, @CurrentUser() user: User) {
    return this.mapsService.create(createMapFeatureDto, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateMapFeatureDto: UpdateMapFeatureDto,
    @CurrentUser() user: User,
  ) {
    return this.mapsService.update(id, updateMapFeatureDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.mapsService.remove(id, user);
  }
}

