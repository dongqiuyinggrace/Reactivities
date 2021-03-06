using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Profiles;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController : BaseController
    {
        [HttpGet("{username}")]
        public async Task<ActionResult<Profile>> GetTask(string username)
        {
            return await Mediator.Send(new Details.Query { UserName = username });
        }

        [HttpPut]
        public async Task<ActionResult<Unit>> EditProfile(Edit.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpGet("{userName}/activities")]
        public async Task<List<UserActivityDto>> GetList(string userName, string predicate)
        {
            return await Mediator.Send(new ListActivities.Query { UserName = userName, Predicate = predicate });
        }
    }
}