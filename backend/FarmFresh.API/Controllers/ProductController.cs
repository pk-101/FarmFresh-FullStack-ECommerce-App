using FarmFresh.Application.DTOs.Products;
using FarmFresh.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FarmFresh.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        // POST: api/product
        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromBody] CreateProductDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var productId = await _productService.CreateProductAsync(dto);
            return CreatedAtAction(nameof(GetActiveProducts), new { id = productId }, null);
        }

        // GET: api/product
        [HttpGet]
        public async Task<IActionResult> GetActiveProducts()
        {
            var products = await _productService.GetActiveProductsAsync();
            return Ok(products);
        }

        // GET: api/products/available
        [HttpGet("available")]
        public async Task<IActionResult> GetAvailableProducts()
        {
            var products = await _productService.GetAvailableProductsAsync();
            return Ok(products);
        }
    }
}
