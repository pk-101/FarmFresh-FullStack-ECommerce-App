using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FarmFresh.Application.DTOs.Products
{
    public class CreateProductRequestDto
    {
        public int SellerId { get; set; }

        public string Name { get; set; }
        public string Description { get; set; }

        public decimal Price { get; set; }
        public string Unit { get; set; }

        public int InitialQuantity { get; set; }
    }
}
