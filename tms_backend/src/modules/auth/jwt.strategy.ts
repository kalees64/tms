import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract Bearer Token
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'topSecret51', // Replace with a secure secret key
    });
  }

  // This method runs when the token is validated
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email }; // Append user info to the request
  }
}
