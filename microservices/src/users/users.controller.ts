import { Controller ,Get, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getMyUser(@Param() params: { id: string }, @Request() req) {
    return this.usersService.getMyUser(params.id, req);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getUsers(){
   return this.usersService.getUsers();
  }

}