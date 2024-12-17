import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { ProfileModule } from './modules/profile/profile.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketModule } from './modules/ticket/ticket.module';
import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';
import { UserProfile } from './entities/user-profile.entity';
import { Ticket } from './entities/ticket.entity';
import { TicketUser } from './entities/ticket-user.entity';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    UserModule,
    ProfileModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'ticket_management',
      entities: [User, Profile, UserProfile, Ticket, TicketUser],
      synchronize: true,
    }),
    TicketModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
