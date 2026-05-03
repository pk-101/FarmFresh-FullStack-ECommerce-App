using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FarmFresh.Application.DTOs.Orders
{
    public class CreateOrderRequestDto
    {
        public List<CreateOrderItemDto> Items { get; set; } = new();

        public int AddressId { get; set; } 
        public string PaymentMethod { get; set; } = "COD";
    }

}
