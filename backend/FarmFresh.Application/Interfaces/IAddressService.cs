using FarmFresh.Application.DTOs.Orders;
using FarmFresh.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FarmFresh.Application.Interfaces
{
    public interface IAddressService
    {
        Task<List<Address>> GetUserAddressesAsync();
        Task<bool> AddAddressAsync(CreateAddressDto dto);
        Task<bool> DeleteAddressAsync(int addressId);
        Task<bool> SetDefaultAsync(int addressId);
        Task<bool> UpdateAddressAsync(int id, CreateAddressDto dto);
    }
}
