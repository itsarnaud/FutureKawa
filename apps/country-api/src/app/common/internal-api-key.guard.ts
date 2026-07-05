import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

const PUBLIC_PATHS = ['/api/health', '/api/docs'];

/**
 * country-api is only ever meant to be called by the gateway, never
 * directly by a browser (it has no CORS headers either). This shared-secret
 * check keeps it from silently accepting traffic from anywhere else on the
 * network. Skipped for the MQTT @EventPattern context, which has no HTTP
 * headers to check, and for /health + /docs (supervision/Swagger).
 */
@Injectable()
export class InternalApiKeyGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    if (context.getType() !== 'http') return true;

    const request = context.switchToHttp().getRequest<Request>();
    if (PUBLIC_PATHS.some((path) => request.path.startsWith(path))) return true;

    const expected = this.config.get<string>('INTERNAL_API_KEY');
    const provided = request.headers['x-internal-api-key'];
    if (!expected || provided !== expected) {
      throw new UnauthorizedException('Missing or invalid internal API key');
    }
    return true;
  }
}
