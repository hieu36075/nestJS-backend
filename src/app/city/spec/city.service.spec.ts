// import { Test, TestingModule } from '@nestjs/testing';
// import { ForbiddenException, NotFoundException } from '@nestjs/common';
// import { CityService } from '../city.service';
// import { PrismaService } from '../../../database/prisma/prisma.service';

// describe('CityService', () => {
//   let cityService: CityService;
//   let prismaService: PrismaService;

//   const mockCity = {
//     id: 'cll5b7dhp000008mm7ld4fuj3',
//     name: 'Sample City',
//     population: 100000,
//   };

//   const mockPrismaService = {
//     city: {
//       findMany: jest.fn(),
//       findUnique: jest.fn(),
//       create: jest.fn(),
//       update: jest.fn(),
//     },
//   };

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         CityService,
//         {
//           provide: PrismaService,
//           useValue: mockPrismaService,
//         },
//       ],
//     }).compile();

//     cityService = module.get<CityService>(CityService);
//     prismaService = module.get<PrismaService>(PrismaService);
//   });

//   describe('getCity', () => {
//     it('should return an array of cities', async () => {
//       mockPrismaService.city.findMany.mockResolvedValue([mockCity]);

//       const result = await cityService.getCity();

//       expect(result).toEqual([mockCity]);
//     });
//   });

//   describe('getCityById', () => {
//     it('should return a city by id when it exists', async () => {
//       mockPrismaService.city.findUnique.mockResolvedValue(mockCity);

//       const result = await cityService.getCityById('cll5b7dhp000008mm7ld4fuj3');

//       expect(result).toEqual(mockCity);
//     });
//     // it('should throw NotFoundException if city is not found', async () => {
//     //     mockPrismaService.city.findUnique.mockResolvedValue(null);
    
//     //     await expect(cityService.getCityById('1')).rejects.toThrow(ForbiddenException);
//     //   });
      
      
//   });

//   describe('createCity', () => {
//     it('should create a new city', async () => {
//       mockPrismaService.city.create.mockResolvedValue(mockCity);

//       const createCityDTO = {
//         name: 'New City',
//         population: 200000,
//         countryId: "clgywnc7h000008l33v1ja5g9"
//       };

//       const result = await cityService.createCity(createCityDTO);

//       expect(result).toEqual(mockCity);
//     });
//   });

//   describe('updateCity', () => {
//     it('should update an existing city', async () => {
//       mockPrismaService.city.findUnique.mockResolvedValue(mockCity);
//       mockPrismaService.city.update.mockResolvedValue({ ...mockCity, name: 'Updated City' });

//       const updateCityDTO = {
//         name: 'Updated City',
//       };

//       const result = await cityService.updateCity('cll5b7dhp000008mm7ld4fuj3', updateCityDTO);

//       expect(result.name).toEqual('Updated City');
//     });

//     it('should throw NotFoundException if city is not found', async () => {
//         mockPrismaService.city.findUnique.mockResolvedValue(null);
      
//         await expect(cityService.updateCity('cll5b7dhp000008mm7324fuj3', { name: 'Updated City' })).rejects.toThrow(NotFoundException);
//       });      
//   });
// });
