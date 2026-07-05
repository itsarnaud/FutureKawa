import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

/**
 * country-api is a hybrid app (HTTP + MQTT microservice). The base
 * ThrottlerGuard assumes an HTTP request/response pair and throws when
 * applied to the MQTT @EventPattern context, so it must be skipped there.
 */
@Injectable()
export class HttpThrottlerGuard extends ThrottlerGuard {
  protected override async shouldSkip(context: ExecutionContext): Promise<boolean> {
    return context.getType() !== 'http';
  }
}
