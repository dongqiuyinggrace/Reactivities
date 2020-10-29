using System.Linq;
using AutoMapper;
using Domain;

namespace Application.Comments
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Comment, CommentDto>()
                .ForMember(d => d.UserName, o => o.MapFrom(c => c.Author.UserName))
                .ForMember(d => d.DisplayName, o => o.MapFrom(c => c.Author.DisplayName))
                .ForMember(d => d.Image, o => o.MapFrom(c => c.Author.Photos.FirstOrDefault(x => x.IsMain).Url));
        }
    }
}