using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using FarmFresh.Application.Interfaces;
using FarmFresh.Application.DTOs.Orders;
using FarmFresh.Domain.Entities;
using FarmFresh.Infrastructure.Data;

namespace FarmFresh.Infrastructure.Services
{
    public class AddressService : IAddressService
    {
        private readonly ICurrentUserService _currentUserService;
        private readonly FarmFreshDbContext _dbContext;

        public AddressService(ICurrentUserService currentUserService, FarmFreshDbContext dbContext)
        {
            _currentUserService = currentUserService ?? throw new ArgumentNullException(nameof(currentUserService));
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        public async Task<List<Address>> GetUserAddressesAsync()
        {
            var userId = _currentUserService.UserId;

            if (string.IsNullOrEmpty(userId))
                throw new UnauthorizedAccessException("User not logged in");

            return await _dbContext.Addresses
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.IsDefault)
                .ToListAsync();
        }

        public async Task<bool> AddAddressAsync(CreateAddressDto dto)
        {
            if (!_currentUserService.IsAuthenticated)
                throw new UnauthorizedAccessException("User not logged in");

            var userId = _currentUserService.UserId!;

            Console.WriteLine($"UserId: {userId}");

            if (dto.IsDefault)
            {
                var existing = await _dbContext.Set<Address>()
                    .Where(a => a.UserId == userId)
                    .ToListAsync();

                foreach (var addr in existing)
                    addr.IsDefault = false;
            }

            var address = new Address
            {
                UserId = userId, 
                FullName = dto.FullName,
                PhoneNumber = dto.PhoneNumber,
                Street = dto.Street,
                City = dto.City,
                State = dto.State,
                PostalCode = dto.PostalCode,
                IsDefault = dto.IsDefault
            };

            _dbContext.Set<Address>().Add(address);
            await _dbContext.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteAddressAsync(int addressId)
        {
            var userId = _currentUserService.UserId;

            var address = await _dbContext.Addresses
                .FirstOrDefaultAsync(a => a.AddressId == addressId && a.UserId == userId);

            if (address == null) return false;

            _dbContext.Addresses.Remove(address);
            await _dbContext.SaveChangesAsync();

            return true;
        }

        public async Task<bool> SetDefaultAsync(int addressId)
        {
            var userId = _currentUserService.UserId;

            var addresses = await _dbContext.Addresses
                .Where(a => a.UserId == userId)
                .ToListAsync();

            foreach (var addr in addresses)
                addr.IsDefault = addr.AddressId == addressId;

            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateAddressAsync(int id, CreateAddressDto dto)
        {
            var userId = _currentUserService.UserId;

            var address = await _dbContext.Addresses
                .FirstOrDefaultAsync(a => a.AddressId == id && a.UserId == userId);

            if (address == null) return false;

            address.FullName = dto.FullName;
            address.PhoneNumber = dto.PhoneNumber;
            address.Street = dto.Street;
            address.City = dto.City;
            address.State = dto.State;
            address.PostalCode = dto.PostalCode;
            address.IsDefault = dto.IsDefault;

            await _dbContext.SaveChangesAsync();
            return true;
        }
    }
}
