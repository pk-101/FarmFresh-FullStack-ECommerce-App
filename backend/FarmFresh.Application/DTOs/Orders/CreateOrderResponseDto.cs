using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FarmFresh.Application.DTOs.Orders
{
    public class CreateOrderResponseDto
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
    }
}
