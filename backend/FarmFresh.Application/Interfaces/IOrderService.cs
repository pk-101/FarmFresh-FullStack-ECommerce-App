using FarmFresh.Application.DTOs.Orders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FarmFresh.Application.Interfaces
{
    public interface IOrderService
    {
        Task<bool> CreateOrderAsync(List<CreateOrderItemDto> items);
        Task<List<OrderDto>> GetMyOrdersAsync();
    }
}
