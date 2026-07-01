import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ServiceUnavailableException } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { CountryApiService } from './country-api.service';

const mockHttpService = { get: jest.fn() };
const mockConfigService = { get: jest.fn().mockReturnValue('http://localhost:3000') };

describe('CountryApiService', () => {
  let service: CountryApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountryApiService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<CountryApiService>(CountryApiService);
    jest.clearAllMocks();
  });

  it('retourne les données de l\'endpoint country-api', async () => {
    mockHttpService.get.mockReturnValue(of({ data: [{ id: 'lot-1' }] }));

    const result = await service.get('lots');

    expect(mockHttpService.get).toHaveBeenCalledWith('http://localhost:3000/api/lots');
    expect(result).toEqual([{ id: 'lot-1' }]);
  });

  it('lève ServiceUnavailableException si country-api est injoignable', async () => {
    mockHttpService.get.mockReturnValue(throwError(() => new Error('ECONNREFUSED')));

    await expect(service.get('lots')).rejects.toThrow(ServiceUnavailableException);
  });
});
