using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FarmFresh.Application.DTOs.Inventory
{
    public class UpdateInventoryDto
    {
        public int ProductId { get; set; }
        public int QuantityChange { get; set; }
        // +ve = stock in, -ve = stock out
    }
}
