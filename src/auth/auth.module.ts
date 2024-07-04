import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module'
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';



@Module({
  imports:[UserModule,PassportModule.register({defaultStrategy:'jwt'}),
    JwtModule.register({
      secret: 'no secret',
      signOptions: { expiresIn: 120 },
    })],
  controllers: [AuthController],
  providers: [AuthService,
    JwtStrategy,LocalStrategy],
  exports: [AuthService, JwtModule,JwtStrategy,PassportModule],
})
export class AuthModule {}
