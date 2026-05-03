using FarmFresh.Application.DTOs.Orders;
using FarmFresh.Application.Interfaces;
using FarmFresh.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FarmFresh.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/addresses")]
    public class AddressController : ControllerBase
    {
        private readonly IAddressService _service;

        public AddressController(IAddressService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var data = await _service.GetUserAddressesAsync();
            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateAddressDto dto)
        {
            var result = await _service.AddAddressAsync(dto);
            return result ? Ok() : BadRequest();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.DeleteAddressAsync(id);
            return result ? Ok() : NotFound();
        }

        [HttpPut("{id}/default")]
        public async Task<IActionResult> SetDefault(int id)
        {
            var result = await _service.SetDefaultAsync(id);
            return result ? Ok() : NotFound();
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, CreateAddressDto dto)
        {
            await _service.UpdateAddressAsync(id, dto);
            return Ok();
        }
    }
}
