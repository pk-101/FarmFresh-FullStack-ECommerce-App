using FarmFresh.Application.DTOs.Orders;
using FarmFresh.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FarmFresh.API.Controllers
{
    [ApiController]
    [Route("api/orders")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateOrder(
            [FromBody] CreateOrderRequestDto request)
        {
            if (request.Items == null || request.Items.Count == 0)
                return BadRequest("Order must contain at least one item.");

            foreach (var item in request.Items)
            {
                if (item.Quantity <= 0)
                    return BadRequest("Quantity must be greater than zero.");

                var success = await _orderService.CreateOrderAsync(request.Items);

                if (!success)
                {
                    return BadRequest(new CreateOrderResponseDto
                    {
                        Success = false,
                        Message = $"Unable to create order for product {item.ProductId}"
                    });
                }
            }

            return Ok(new CreateOrderResponseDto
            {
                Success = true,
                Message = "Order created successfully."
            });
        }
        [Authorize]
        [HttpGet("my")]
        public async Task<IActionResult> GetMyOrders()
        {
            var orders = await _orderService.GetMyOrdersAsync();
            return Ok(orders);
        }
    }

}
