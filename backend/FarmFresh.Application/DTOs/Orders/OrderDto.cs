using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FarmFresh.Application.DTOs.Orders
{
    public class OrderDto
    {
        public int OrderId { get; set; }
        public DateTime CreatedAt { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public string ShippingAddress { get; set; }
        public List<OrderItemDto> Items { get; set; } = new();
    }
}
