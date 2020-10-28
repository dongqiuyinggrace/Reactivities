using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    public class Create
    {
        public class Command : IRequest<CommentDto>
        {
            public string Body { get; set; }
            public string UserName { get; set; }
            public Guid ActivityId { get; set; }
        }

        public class Handler : IRequestHandler<Command, CommentDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<CommentDto> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(u => u.UserName == request.UserName);
                if (user == null)
                {
                    throw new RestException(HttpStatusCode.NotFound, new {User = "Not found"});
                }

                var activity = await _context.Activities.FindAsync(request.ActivityId);
                if (activity == null)
                {
                    throw new RestException(HttpStatusCode.NotFound, new {Activity = "Not found"});
                }

                var comment = new Comment
                {
                    Body = request.Body,
                    Activity = activity,
                    Author = user,
                    CreatedAt = DateTime.Now
                };

                activity.Comments.Add(comment);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return _mapper.Map<CommentDto>(comment);

                throw new Exception("Problem saving changes");
            }
        }
    }
}