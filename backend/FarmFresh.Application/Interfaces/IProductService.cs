using FarmFresh.Application.DTOs.Products;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FarmFresh.Application.Interfaces
{
    public interface IProductService
    {
        Task<int> CreateProductAsync(CreateProductDto dto);
        Task<IEnumerable<ProductDto>> GetActiveProductsAsync();
        Task<List<AvailableProductDto>> GetAvailableProductsAsync();
        Task<bool> CreateProductAsync(CreateProductRequestDto dto);
    }
}
