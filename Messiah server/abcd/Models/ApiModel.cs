using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace abcd.Models
{
    public class AuthToken
    {
        public string userid { get; set; }
        public string token { get; set; }   
    }

    public class MissingDetails
    {
        public string UserName { get; set; }
        public string Age { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public bool MarkSafe { get; set; }
        public string ImageUrl { get; set; }
        public string UploadedByName { get; set; }
        public DateTime UploadedDate { get; set; }
        public string UploadedByPhnNum { get; set; }
        public bool IsMsgSent { get; set; }
        public string SendPhnNum { get; set; }
        public string SenderName { get; set; }
        public string SafeLocation { get; set; }
    }
    public class QueryJobResponse
    {
        public int commands_count { get; set; }
        public int limit { get; set; }
        public string  id { get; set; }
    }
    public class RegisteredUser
    {
        public string UserName { get; set; }
        public string Location { get; set; }
        public string PhoneNumber { get; set; }
        public string Role { get; set; }
    }
}