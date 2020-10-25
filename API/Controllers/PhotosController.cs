using System.Threading.Tasks;
using Application.Photos;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class PhotosController : BaseController
    {
        [HttpPost]
        public async Task<ActionResult<Photo>> Add([FromForm]Add.Command command)
        {
            return await Mediator.Send(command);
        } 

        [HttpDelete("{photoId}")]
        public async Task<ActionResult<Unit>> Delete(string photoId)
        {
            return await Mediator.Send(new Delete.Command {PublicId = photoId});
        } 

        [HttpPost("{id}/setMain")]
        public async Task<ActionResult<Unit>> setMain(string id)
        {
            return await Mediator.Send(new SetMain.Command {Id = id});
        }
    }
}