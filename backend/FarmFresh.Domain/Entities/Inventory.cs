using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FarmFresh.Domain.Entities
{
    public class Inventory
    {
        public int InventoryId { get; set; }

        public int ProductId { get; set; }
        public int QuantityAvailable { get; set; }
        public DateTime LastUpdated { get; set; }
        public byte[] RowVersion { get; set; }
    }
}
