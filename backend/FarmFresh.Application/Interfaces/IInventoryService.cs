using FarmFresh.Application.DTOs.Inventory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FarmFresh.Application.Interfaces
{
    public interface IInventoryService
    {
        Task UpdateInventoryAsync(UpdateInventoryDto dto);
        Task<InventoryDto?> GetInventoryByProductIdAsync(int productId);
        Task<bool> ReserveStockAsync(int productId, int quantity);
    }
}
