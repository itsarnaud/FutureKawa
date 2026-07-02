import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ServiceUnavailableException } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { CountryApiService } from './country-api.service';

const mockHttpService = { get: jest.fn() };
const mockConfigService = {
  get: jest.fn((key: string, fallback: string) => {
    const map: Record<string, string> = {
      BRAZIL_API_URL: 'http://brazil:3000',
      ECUADOR_API_URL: 'http://ecuador:3000',
      COLOMBIA_API_URL: 'http://colombia:3000',
    };
    return map[key] ?? fallback;
  }),
};

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

  describe('get', () => {
    it('retourne les données du bon endpoint country-api', async () => {
      mockHttpService.get.mockReturnValue(of({ data: [{ id: 'lot-1' }] }));

      const result = await service.get('BR', 'lots');

      expect(mockHttpService.get).toHaveBeenCalledWith('http://brazil:3000/api/lots');
      expect(result).toEqual([{ id: 'lot-1' }]);
    });

    it('lève ServiceUnavailableException si country-api est injoignable', async () => {
      mockHttpService.get.mockReturnValue(throwError(() => new Error('ECONNREFUSED')));

      await expect(service.get('BR', 'lots')).rejects.toThrow(ServiceUnavailableException);
    });
  });

  describe('getAll', () => {
    it('agrège les résultats des 3 pays', async () => {
      mockHttpService.get
        .mockReturnValueOnce(of({ data: [{ id: 'lot-br' }] }))
        .mockReturnValueOnce(of({ data: [{ id: 'lot-ec' }] }))
        .mockReturnValueOnce(of({ data: [{ id: 'lot-co' }] }));

      const result = await service.getAll('lots');

      expect(result).toHaveLength(3);
      expect(result).toEqual(expect.arrayContaining([{ id: 'lot-br' }, { id: 'lot-ec' }, { id: 'lot-co' }]));
    });

    it('retourne les résultats disponibles si un pays est injoignable', async () => {
      mockHttpService.get
        .mockReturnValueOnce(of({ data: [{ id: 'lot-br' }] }))
        .mockReturnValueOnce(throwError(() => new Error('ECONNREFUSED')))
        .mockReturnValueOnce(of({ data: [{ id: 'lot-co' }] }));

      const result = await service.getAll('lots');

      expect(result).toHaveLength(2);
    });
  });

  describe('isValidCountry', () => {
    it('valide BR, EC, CO', () => {
      expect(service.isValidCountry('BR')).toBe(true);
      expect(service.isValidCountry('EC')).toBe(true);
      expect(service.isValidCountry('CO')).toBe(true);
    });

    it('rejette un code invalide', () => {
      expect(service.isValidCountry('FR')).toBe(false);
    });
  });
});
