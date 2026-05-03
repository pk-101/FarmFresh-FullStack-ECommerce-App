using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FarmFresh.Domain.Entities
{
    public class Address
    {
        public int AddressId { get; set; }

        public string UserId { get; set; } = null!;

        public string FullName { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;

        public string Street { get; set; } = null!;
        public string City { get; set; } = null!;
        public string State { get; set; } = null!;
        public string PostalCode { get; set; } = null!;

        public bool IsDefault { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
