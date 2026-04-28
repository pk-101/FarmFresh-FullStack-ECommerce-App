using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FarmFresh.Domain.Entities
{
    public class Order
    {
        public int OrderId { get; set; }          // PK

        public string UserId { get; set; } = null!; // FK to Identity user

        public OrderStatus Status { get; set; }

        public DateTime CreatedAt { get; set; }
        public decimal TotalAmount { get; set; }

        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
