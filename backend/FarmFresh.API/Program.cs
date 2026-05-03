using FarmFresh.Application.Interfaces;
using FarmFresh.Infrastructure.Data;
using FarmFresh.Infrastructure.Identity;
using FarmFresh.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter JWT token like: Bearer {your token}"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});
//Db context registration
builder.Services.AddDbContext<FarmFreshDbContext>(options =>
options.UseSqlServer(
    builder.Configuration.GetConnectionString("DefaultConnection"),
    sqlOptions =>
    {
        sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(10),
            errorNumbersToAdd: null);
    }));
//options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
//Identity registration
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<FarmFreshDbContext>()
    .AddDefaultTokenProviders();
//JWT Authentication registration
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("JWT Key is not configured.");

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        NameClaimType = ClaimTypes.NameIdentifier,
        RoleClaimType = ClaimTypes.Role,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtKey)
        )
  
    };
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy
                .WithOrigins("http://localhost:5173", "https://mango-flower-0f8c49300.7.azurestaticapps.net")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

//Registering services in API(DI)
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IInventoryService, InventoryService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
builder.Services.AddScoped<IAddressService, AddressService>();
builder.Services.AddHttpContextAccessor();

var app = builder.Build();

//await AdminUserSeeder.SeedAsync(app.Services);
if (args.Contains("--seed"))
{
    using var scope = app.Services.CreateScope();
    var services = scope.ServiceProvider;

    await AdminUserSeeder.SeedAsync(services);
}

var env = app.Environment;


// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
    app.UseSwagger();
    app.UseSwaggerUI();
//}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Seed roles
//using (var scope = app.Services.CreateScope())
//{
//    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

//    string[] roles = { "Admin", "Seller", "User" };

//    foreach (var role in roles)
//    {
//        if (!await roleManager.RoleExistsAsync(role))
//        {
//            await roleManager.CreateAsync(new IdentityRole(role));
//        }
//    }
//}

app.Run();
