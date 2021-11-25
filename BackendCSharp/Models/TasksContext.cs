using Microsoft.Build.Framework;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace BackendCSharp.Models
{
    public class TasksContext : DbContext
    {
        public string ConnectionString { get; set; } = Environment.GetEnvironmentVariable("DATABASE_FILE") ?? "";

        public DbSet<Task> Tasks { get; set; }
        public DbSet<User> Users { get; set; }
        public TasksContext():base()
        {
            SQLitePCL.raw.SetProvider(new SQLitePCL.SQLite3Provider_winsqlite3());
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder
                .UseSqlite(string.Format("Data Source = {0}", ConnectionString))
                .UseSnakeCaseNamingConvention();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasKey(user => user.Id);

            modelBuilder.Entity<Task>()
                .HasKey(task => task.Id);

            modelBuilder.Entity<Task>()
                .HasOne(task => task.User)
                .WithMany(user => user.Tasks);
        }
    }

    public class User
    {
        public int? Id { get; set; }
        public string Login { get; set; }
        public string Password { get; set; }
        [JsonIgnore]
        public string? Salt { get; set; }
        [JsonIgnore]
        public List<Task>? Tasks { get; set; }

        public bool ShouldSerializePassword()
        {
            return Password != null;
        }
    }

    public class Task
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string Title { get; set; }
        public string Description { get; set; }
        public int? Checked { get; set; }
        [JsonIgnore]
        public User? User { get; set; }
    }
}
