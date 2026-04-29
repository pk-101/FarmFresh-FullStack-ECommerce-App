using FarmFresh.Application.DTOs.Inventory;
using FarmFresh.Application.Interfaces;
using FarmFresh.Domain.Entities;
using FarmFresh.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FarmFresh.Infrastructure.Services
{
    public class InventoryService : IInventoryService
    {
        private readonly FarmFreshDbContext _dbContext;

        public InventoryService(FarmFreshDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task UpdateInventoryAsync(UpdateInventoryDto dto)
        {
            var inventory = await _dbContext.Inventories
                .FirstOrDefaultAsync(i => i.ProductId == dto.ProductId);

            if (inventory == null)
            {
                inventory = new Inventory
                {
                    ProductId = dto.ProductId,
                    QuantityAvailable = 0,
                    LastUpdated = DateTime.UtcNow
                };

                _dbContext.Inventories.Add(inventory);
            }

            var newQuantity = inventory.QuantityAvailable + dto.QuantityChange;

            if (newQuantity < 0)
                throw new InvalidOperationException("Insufficient stock.");

            inventory.QuantityAvailable = newQuantity;
            inventory.LastUpdated = DateTime.UtcNow;

            await _dbContext.SaveChangesAsync();
        }

        public async Task<InventoryDto?> GetInventoryByProductIdAsync(int productId)
        {
            return await _dbContext.Inventories
                .AsNoTracking()
                .Where(i => i.ProductId == productId)
                .Select(i => new InventoryDto
                {
                    ProductId = i.ProductId,
                    QuantityAvailable = i.QuantityAvailable,
                    LastUpdated = i.LastUpdated
                })
                .FirstOrDefaultAsync();
        }
        public async Task<bool> ReserveStockAsync(int productId, int quantity)
        {
            var inventory = await _dbContext.Inventories
                .FirstOrDefaultAsync(i => i.ProductId == productId);

            if (inventory == null || inventory.QuantityAvailable < quantity)
                return false;

            inventory.QuantityAvailable -= quantity;

            try
            {
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
                return false;
            }
        }
    }
}
