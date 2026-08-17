import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import type { AuthenticatedUser, JwtPayload } from './types';

export type { AuthenticatedUser, JwtPayload } from './types';

function readCookieValue(cookies: unknown, name: string): string | null {
  if (typeof cookies !== 'object' || cookies === null) {
    return null;
  }

  const value = (cookies as Record<string, unknown>)[name];
  return typeof value === 'string' ? value : null;
}

function cookieExtractor(request: Request): string | null {
  return readCookieValue(request.cookies, 'qualti_auth');
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET', 'dev-only-change-me'),
    });
  }

  validate(payload: JwtPayload): AuthenticatedUser {
    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
