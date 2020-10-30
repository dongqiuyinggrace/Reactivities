using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class ListActivities
    {
        public class Query : IRequest<List<UserActivityDto>> 
        { 
            public string UserName { get; set; }
            public string Predicate { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<UserActivityDto>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<List<UserActivityDto>> Handle(Query request,
                CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.UserName);
                if (user == null)
                {
                    throw new RestException(HttpStatusCode.NotFound, new {user = "Not found"});
                }

                var queryable = user.UserActivities
                    .OrderBy(x => x.Activity.Date)
                    .AsQueryable();

                switch (request.Predicate)
                {
                    case "past":
                        queryable = queryable.Where(x => x.Activity.Date <= DateTime.Now);
                        break;
                    case "hosting":
                        queryable = queryable.Where(x => x.IsHost);
                        break;
                    default:
                        queryable = queryable.Where(x => x.Activity.Date >= DateTime.Now);
                        break;
                }

                var userActivities = queryable.ToList();

                var activitiesToReturn = new List<UserActivityDto>();
                foreach(var useractivity in userActivities)
                {
                    var userActivityToReturn = new UserActivityDto 
                    {
                        Id = useractivity.Activity.Id,
                        Title = useractivity.Activity.Title,
                        Category = useractivity.Activity.Category,
                        Date = useractivity.Activity.Date
                    };

                    activitiesToReturn.Add(userActivityToReturn);
                }
                
                return activitiesToReturn;

            }
        }
    }
}