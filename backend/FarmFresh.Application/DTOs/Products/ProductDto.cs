using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FarmFresh.Application.DTOs.Products
{
    public class ProductDto
    {
        public int ProductId { get; set; }
        public int SellerId { get; set; }
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        public decimal Price { get; set; }
        public string Unit { get; set; } = null!;
        public string? ImageUrl { get; set; }
        public bool IsActive { get; set; }
    }
}
