using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using FarmFresh.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using FarmFresh.Infrastructure.Identity;

namespace FarmFresh.Infrastructure.Data
{

    public class FarmFreshDbContext : IdentityDbContext<ApplicationUser>
    {
            public FarmFreshDbContext(DbContextOptions<FarmFreshDbContext> options)
                : base(options)
            {
            }

            public DbSet<Seller> Sellers { get; set; }
            public DbSet<Product> Products { get; set; }
            public DbSet<Inventory> Inventories { get; set; }
            public DbSet<Order> Orders { get; set; }
            public DbSet<OrderItem> OrderItems { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
            {
                base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Inventory>()
                    .Property(i => i.RowVersion)
                    .IsRowVersion();
                modelBuilder.Entity<Seller>().HasData(
            new Seller
            {
                SellerId = 1,
                Name = "FarmFresh Admin Seller",
                PhoneNumber = "9999999999",
                Address = "Default Admin Address",
                IsActive = true,
            });

            modelBuilder.Entity<OrderItem>()
                 .HasOne(oi => oi.Order)
                 .WithMany(o => o.OrderItems)
                 .HasForeignKey(oi => oi.OrderId);
            }
        }
    }