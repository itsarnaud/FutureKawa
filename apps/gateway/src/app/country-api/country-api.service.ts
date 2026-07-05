import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

export type CountryCode = 'BR' | 'EC' | 'CO';

const COUNTRY_ENV: Record<CountryCode, string> = {
  BR: 'BRAZIL_API_URL',
  EC: 'ECUADOR_API_URL',
  CO: 'COLOMBIA_API_URL',
};

@Injectable()
export class CountryApiService {
  private readonly logger = new Logger(CountryApiService.name);
  private readonly urls: Record<CountryCode, string>;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    this.urls = {
      BR: this.config.get<string>('BRAZIL_API_URL', 'http://localhost:3000'),
      EC: this.config.get<string>('ECUADOR_API_URL', 'http://localhost:3000'),
      CO: this.config.get<string>('COLOMBIA_API_URL', 'http://localhost:3000'),
    };
  }

  async get<T>(country: CountryCode, path: string): Promise<T> {
    const baseUrl = this.urls[country];
    try {
      const { data } = await firstValueFrom(
        this.http.get<T>(`${baseUrl}/api/${path}`),
      );
      return data;
    } catch (err) {
      const axiosErr = err as AxiosError;
      this.logger.error(`[${country}] country-api call failed: GET ${path} — ${axiosErr.message}`);
      throw new ServiceUnavailableException(`Country API unavailable for ${country}`);
    }
  }

  async patch<T>(country: CountryCode, path: string, body: unknown = {}): Promise<T> {
    const baseUrl = this.urls[country];
    try {
      const { data } = await firstValueFrom(
        this.http.patch<T>(`${baseUrl}/api/${path}`, body),
      );
      return data;
    } catch (err) {
      const axiosErr = err as AxiosError;
      this.logger.error(`[${country}] country-api call failed: PATCH ${path} — ${axiosErr.message}`);
      throw new ServiceUnavailableException(`Country API unavailable for ${country}`);
    }
  }

  async getAll<T>(path: string): Promise<T[]> {
    const results = await Promise.allSettled(
      (Object.keys(COUNTRY_ENV) as CountryCode[]).map(code => this.get<T[]>(code, path)),
    );

    return results
      .filter((r): r is PromiseFulfilledResult<T[]> => r.status === 'fulfilled')
      .flatMap(r => r.value);
  }

  isValidCountry(code: string): code is CountryCode {
    return code in COUNTRY_ENV;
  }
}
