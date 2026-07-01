import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class CountryApiService {
  private readonly logger = new Logger(CountryApiService.name);
  private readonly baseUrl: string;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    this.baseUrl = this.config.get<string>('COUNTRY_API_URL', 'http://localhost:3000');
  }

  async get<T>(path: string): Promise<T> {
    try {
      const { data } = await firstValueFrom(
        this.http.get<T>(`${this.baseUrl}/api/${path}`),
      );
      return data;
    } catch (err) {
      const axiosErr = err as AxiosError;
      this.logger.error(`country-api call failed: GET ${path} — ${axiosErr.message}`);
      throw new ServiceUnavailableException('Country API unavailable');
    }
  }
}
