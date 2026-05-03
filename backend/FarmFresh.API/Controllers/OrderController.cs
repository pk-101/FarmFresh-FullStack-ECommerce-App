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
            // Basic validation
            if (request.Items == null || request.Items.Count == 0)
                return BadRequest("Order must contain at least one item.");

            if (request.AddressId <= 0)
                return BadRequest("Valid address is required.");

            foreach (var item in request.Items)
            {
                if (item.Quantity <= 0)
                    return BadRequest($"Invalid quantity for product {item.ProductId}");
            }

            try
            {
                var success = await _orderService.CreateOrderAsync(request);

                if (!success)
                {
                    return BadRequest(new CreateOrderResponseDto
                    {
                        Success = false,
                        Message = "Order creation failed. Please try again."
                    });
                }

                return Ok(new CreateOrderResponseDto
                {
                    Success = true,
                    Message = "Order created successfully."
                });
            }
            catch (Exception ex)
            {
                // Optional: log this later with ILogger
                return StatusCode(500, new CreateOrderResponseDto
                {
                    Success = false,
                    Message = ex.Message
                });
            }
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
