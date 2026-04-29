using FarmFresh.Application.DTOs.Orders;
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
    public class OrderService : IOrderService
    {
        private readonly FarmFreshDbContext _dbContext;
        private readonly IInventoryService _inventoryService;
        private readonly ICurrentUserService _currentUserService;
        public OrderService(FarmFreshDbContext dbContext, IInventoryService inventoryService, ICurrentUserService currentUserService)
        {
            _dbContext = dbContext;
            _inventoryService = inventoryService;
            _currentUserService = currentUserService;
        }
        public async Task<bool> CreateOrderAsync(List<CreateOrderItemDto> items)
        {
            if (!_currentUserService.IsAuthenticated)
                throw new UnauthorizedAccessException("User must be logged in to place an order.");

            var existingOrder = await _dbContext.Orders
                .AnyAsync(o =>
                 o.UserId == _currentUserService.UserId &&
                o.Status == OrderStatus.Confirmed &&
                 o.CreatedAt > DateTime.UtcNow.AddMinutes(-2)
                );

            if (existingOrder)
                return true;

            if (items == null || !items.Any())
                return false;

            using var transaction = await _dbContext.Database.BeginTransactionAsync();

            try
            {
                var order = new Order
                {
                    UserId = _currentUserService.UserId!,
                    Status = OrderStatus.Confirmed,
                    CreatedAt = DateTime.UtcNow
                };

                _dbContext.Orders.Add(order);
                await _dbContext.SaveChangesAsync();

                decimal totalAmount = 0;
                foreach (var item in items)
                {
                    if (item.Quantity <= 0)
                        return false;

                    var product = await _dbContext.Products
                        .FirstOrDefaultAsync(p => p.ProductId == item.ProductId && p.IsActive);

                    if (product == null)
                        return false;

                    var reserved = await _inventoryService.ReserveStockAsync(
                        item.ProductId,
                        item.Quantity
                    );

                    if (!reserved)
                        return false;

                    var orderItem = new OrderItem
                    {
                        OrderId = order.OrderId,
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        UnitPrice = product.Price
                    };

                    totalAmount+=item.Quantity * product.Price;
                    _dbContext.OrderItems.Add(orderItem);
                }
                order.TotalAmount = totalAmount;
                await _dbContext.SaveChangesAsync();
                await transaction.CommitAsync();

                return true;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<List<OrderDto>> GetMyOrdersAsync()
        {
            if (!_currentUserService.IsAuthenticated)
                throw new UnauthorizedAccessException();

            var userId = _currentUserService.UserId!;

            var orders = await _dbContext.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            return orders.Select(o => new OrderDto
            {
                OrderId = o.OrderId,
                CreatedAt = o.CreatedAt,
                TotalAmount = o.TotalAmount,
                Status = o.Status.ToString(),
                Items = o.OrderItems.Select(oi => new OrderItemDto
                {
                    ProductId = oi.ProductId,
                    ProductName = oi.Product.Name,
                    Quantity = oi.Quantity,
                    Price = oi.TotalPrice
                }).ToList()
            }).ToList();
        }
    }

}
