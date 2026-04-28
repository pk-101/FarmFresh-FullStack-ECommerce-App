using FarmFresh.Application.DTOs.Products;
using FarmFresh.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FarmFresh.API.Controllers
{
    [ApiController]
    [Route("api/admin/products")]
    public class AdminProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public AdminProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateProduct(CreateProductRequestDto dto)
        {
            if (dto.InitialQuantity < 0)
                return BadRequest("Initial quantity cannot be negative.");

            var result = await _productService.CreateProductAsync(dto);

            if (!result)
                return BadRequest("Invalid seller or product creation failed.");

            return Ok("Product created successfully.");
        }
    }
}
