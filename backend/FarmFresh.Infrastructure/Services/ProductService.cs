using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FarmFresh.Application.DTOs.Products;
using FarmFresh.Application.Interfaces;
using FarmFresh.Domain.Entities;
using FarmFresh.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;

namespace FarmFresh.Infrastructure.Services
{
    public class ProductService : IProductService
    {
        private readonly FarmFreshDbContext _dbContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public ProductService(FarmFreshDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        {
            _dbContext = dbContext;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<int> CreateProductAsync(CreateProductDto dto)
        {
            var product = new Product
            {
                SellerId = dto.SellerId,
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                Unit = dto.Unit,
                ImageUrl = dto.ImageUrl,
                IsActive = true
            };

            _dbContext.Products.Add(product);
            await _dbContext.SaveChangesAsync();

            return product.ProductId;
        }

        public async Task<IEnumerable<ProductDto>> GetActiveProductsAsync()
        {
            return await _dbContext.Products
                .AsNoTracking()
                .Where(p => p.IsActive)
                .Select(p => new ProductDto
                {
                    ProductId = p.ProductId,
                    SellerId = p.SellerId,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    Unit = p.Unit,
                    ImageUrl = p.ImageUrl,
                    IsActive = p.IsActive
                })
                .ToListAsync();
        }

        private string ResolveImageUrl(string? ImageUrl)
        {
            var httpContext = _httpContextAccessor.HttpContext
                ?? throw new InvalidOperationException("HttpContext is not available.");

            var request = httpContext.Request;
            var baseUrl = $"{request.Scheme}://{request.Host}";

            if (string.IsNullOrWhiteSpace(ImageUrl))
            {
                return $"{baseUrl}/images/products/default.png";
            }

            return $"{baseUrl}/{ImageUrl}";
        }
        public async Task<List<AvailableProductDto>> GetAvailableProductsAsync()
        {
            var httpContext = _httpContextAccessor.HttpContext;

            var products= await _dbContext.Products
                .Where(p => p.IsActive)
                .Join(
                    _dbContext.Inventories,
                    product => product.ProductId,
                    inventory => inventory.ProductId,
                    (product, inventory) => new { product, inventory }
                )
                .Where(x => x.inventory.QuantityAvailable > 0)
                .Select(x => new AvailableProductDto
                {
                    ProductId = x.product.ProductId,
                    Name = x.product.Name,
                    Price = x.product.Price,
                    AvailableQuantity = x.inventory.QuantityAvailable,
                    ImageUrl = x.product.ImageUrl
                })
                .ToListAsync();
            foreach (var product in products)
            {
                product.ImageUrl = ResolveImageUrl(product.ImageUrl);
            }

            return products;
        }
        public async Task<bool> CreateProductAsync(CreateProductRequestDto dto)
        {

            // Use EF Core's execution strategy to handle transient failures
            var strategy = _dbContext.Database.CreateExecutionStrategy();

            return await strategy.ExecuteAsync(async () =>
            {
                using var transaction = await _dbContext.Database.BeginTransactionAsync();

            var sellerExists = await _dbContext.Sellers
                .AnyAsync(s => s.SellerId == dto.SellerId && s.IsActive);

            if (!sellerExists)
                return false;

            var product = new Product
            {
                SellerId = dto.SellerId,
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                Unit = dto.Unit,
                IsActive = true
            };

            _dbContext.Products.Add(product);
            await _dbContext.SaveChangesAsync();

            var inventory = new Inventory
            {
                ProductId = product.ProductId,
                QuantityAvailable = dto.InitialQuantity
            };

            _dbContext.Inventories.Add(inventory);
            await _dbContext.SaveChangesAsync();

            await transaction.CommitAsync();
            return true;
                });
        }


    }
}
