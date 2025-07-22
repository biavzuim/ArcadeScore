using Backend.Services.Abstracts;
using Backend.Services.Concretes;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using Backend.Data;

var builder = WebApplication.CreateBuilder(args);

// Configurar CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("Angular", policy =>
    {
        policy
            .WithOrigins("http://localhost:4200") // ajuste para a URL do seu Angular
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Adicionar DbContext antes do builder.Build()
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseInMemoryDatabase("ScoreDatabase"));

// Services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Injeção do  serviço de pontuação
builder.Services.AddScoped<IScoreService, ScoreService>();

var app = builder.Build();

// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("Angular"); // Aplica a política CORS

app.UseAuthorization();

app.MapControllers();

app.Run();
