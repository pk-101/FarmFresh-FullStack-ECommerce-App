using FarmFresh.Application.DTOs.Inventory;
using FarmFresh.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FarmFresh.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InventoryController : ControllerBase
    {
        private readonly IInventoryService _inventoryService;

        public InventoryController(IInventoryService inventoryService)
        {
            _inventoryService = inventoryService;
        }

        // POST: api/inventory/update
        [HttpPost("update")]
        public async Task<IActionResult> UpdateInventory([FromBody] UpdateInventoryDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                await _inventoryService.UpdateInventoryAsync(dto);
                return Ok();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // GET: api/inventory/{productId}
        [HttpGet("{productId}")]
        public async Task<IActionResult> GetInventory(int productId)
        {
            var inventory = await _inventoryService.GetInventoryByProductIdAsync(productId);

            if (inventory == null)
                return NotFound();

            return Ok(inventory);
        }
    }
}
