using Microsoft.EntityFrameworkCore;

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
        public int Id { get; set; }
        public string Login { get; set; }
        public string Password { get; set; }
        public string Salt { get; set; }

        public IList<Task> Tasks { get; set; }
    }

    public class Task
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int Checked { get; set; }
        public User User { get; set; }
    }
}
