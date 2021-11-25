using Microsoft.AspNetCore.Builder;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession();
builder.Services.AddControllers().AddNewtonsoftJson();
builder.Services.AddCors(options => options.AddPolicy("MyPolicy", policy => policy.AllowCredentials()
                                                                                  .AllowAnyMethod()
                                                                                  .AllowAnyHeader()
                                                                                  .WithOrigins("http://localhost:3000")));

builder.Services.AddSwaggerGenNewtonsoftSupport();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();

app.UseSession();
app.UseCors("MyPolicy");

app.MapControllers();

app.Run();
