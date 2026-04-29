using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FarmFresh.Application.DTOs.Products
{
    public class CreateProductDto
    {
        [Required]
        public int SellerId { get; set; }
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = null!;
        [Required]
        [MaxLength(500)]
        public string Description { get; set; } = null!;
        [Range(1, 100000)]
        public decimal Price { get; set; }
        [Required]
        [MaxLength(20)]
        public string Unit { get; set; } = null!;
        public string? ImageUrl { get; set; }
    }
}