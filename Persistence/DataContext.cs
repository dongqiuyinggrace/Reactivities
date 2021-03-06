﻿using System;
using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        { }

        public DbSet<Value> Values { get; set; }
        public DbSet<Activity> Activities { get; set; }
        public DbSet<UserActivity> UserActivities { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<UserFollowing> Followings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            modelBuilder.Entity<Value>()
                    .HasData(
                        new Value { Id = 1, Name = "Value101" },
                        new Value { Id = 2, Name = "Value102" },
                        new Value { Id = 3, Name = "Value103" }
                    );

            modelBuilder.Entity<UserActivity>()
                    .HasKey(ua => new {ua.AppUserId, ua.ActivityId});

            modelBuilder.Entity<UserActivity>()
                    .HasOne(u => u.AppUser)
                    .WithMany(a => a.UserActivities)
                    .HasForeignKey(u => u.AppUserId);

            modelBuilder.Entity<UserActivity>()
                    .HasOne(a => a.Activity)
                    .WithMany(u => u.UserActivities)
                    .HasForeignKey(a => a.ActivityId);

            modelBuilder.Entity<UserFollowing>(b => 
            {
                b.HasKey(o => new {o.ObserverId, o.TargetId});

                b.HasOne(o => o.Observer)
                 .WithMany(u => u.Followings)
                 .HasForeignKey(o => o.ObserverId)
                 .OnDelete(DeleteBehavior.Restrict);


                b.HasOne(o => o.Target)
                 .WithMany(u => u.Followers)
                 .HasForeignKey(o => o.TargetId)
                 .OnDelete(DeleteBehavior.Restrict);


            });
        }
    }
}
