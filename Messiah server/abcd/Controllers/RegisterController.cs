using abcd.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Web;
using System.Web.Http;

namespace abcd.Controllers
{
    public class RegisterController
    {
        [HttpGet]
        public AuthToken RetrieveAuthToken()
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
            HttpClient client = new HttpClient();
            string api = "https://dashdb-txn-sbox-yp-lon02-01.services.eu-gb.bluemix.net:8443/dashdb-api/v2/auth";
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, api);
            request.Content = new StringContent("{\"userid\": \"" + "vqm82881" + "\",\"password\":\"" + "6fh0shkzh+hhdq46" + "\"}", Encoding.UTF8, "application/json");
            var response = client.SendAsync(request).Result;
            var responseContent = response.Content.ReadAsAsync<AuthToken>().Result;
            return responseContent;
        }

        [HttpGet]
        public List<RegisteredUser> RetrieveRegisterUsers(string authToken)
        {
            List<RegisteredUser> lstRegisterUser = null;
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
            HttpClient client = new HttpClient();
            string api = "https://dashdb-txn-sbox-yp-lon02-01.services.eu-gb.bluemix.net:8443/dashdb-api/v2/sql_query_export";
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authToken);
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, api);
            request.Content = new StringContent("{\"command\": \"" + "SELECT * FROM RegisterUsers" + "\"}", Encoding.UTF8, "application/json");
            var response = client.SendAsync(request).Result;
            var responseContent = response.Content.ReadAsStringAsync().Result;
            var result = responseContent.Split('\n');
            if (result.Length > 1)
            {
                lstRegisterUser = new List<RegisteredUser>();
                for (int i = 1; i < result.Length - 1; i++)
                {
                    RegisteredUser user = new RegisteredUser();
                    user.UserName = result[i].Split('\"')[1].ToString();
                    user.Location = result[i].Split('\"')[3].ToString();
                    user.PhoneNumber = result[i].Split('\"')[5].ToString();
                    user.Role = result[i].Split('\"')[7].ToString();
                    lstRegisterUser.Add(user);
                }
            }
            return lstRegisterUser;
        }

        // post request
        [HttpGet]
        public QueryJobResponse AddRegisterUser(string authToken)
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
            HttpClient client = new HttpClient();
            string api = "https://dashdb-txn-sbox-yp-lon02-01.services.eu-gb.bluemix.net:8443/dashdb-api/v2/sql_jobs";
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, api);
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authToken);
            request = new HttpRequestMessage(HttpMethod.Post, api);
            request.Content = new StringContent("{\"commands\": \"" + @"INSERT INTO RegisterUsers(userName,location,phoneNumber,role)VALUES('Prateek G', '48.38,-96.23','0987654321','Volunteer'),('Khushboo J', '48.38,-96.23','0987654321','Volunteer'),('Saby C', '48.38,-96.23','0987654321','Volunteer'),('Ankita G', '48.38,-96.23','0987654321','Volunteer')" + "\",\"limit\":\"" + 10 + "\", \"separator\":\"" + ";" + "\", \"stop_on_error\": \"" + "no" + "\"}", Encoding.UTF8, "application/json");
            var response = client.SendAsync(request).Result;
            var responseContent = response.Content.ReadAsAsync<QueryJobResponse>().Result;
            return responseContent;
        }
        //[HttpGet]
        //public queryJobResponse Createtable(string authToken)
        //{
        //    queryJobResponse queryResponse = new queryJobResponse();
        //    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
        //    HttpClient client = new HttpClient();
        //    string api = "https://dashdb-txn-sbox-yp-lon02-01.services.eu-gb.bluemix.net:8443/dashdb-api/v2/sql_jobs";
        //    HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, api);
        //    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authToken);
        //    request = new HttpRequestMessage(HttpMethod.Post, api);
        //    request.Content = new StringContent("{\"commands\": \"" + @"CREATE TABLE RegisterUsers(userName varchar (500) NOT NULL,
        //                                                                              location varchar (500) NULL,                                                                          
        //                                                                              phoneNumber varchar (10) NULL,
        //                                                                              role varchar (100) NULL)" + "\",\"limit\":\"" + 10 + "\", \"separator\":\"" + ";" + "\", \"stop_on_error\": \"" + "no" + "\"}", Encoding.UTF8, "application/json");
        //    var response = client.SendAsync(request).Result;
        //    var responseContent = response.Content.ReadAsStringAsync().Result;
        //    queryResponse.id = responseContent.ToString().Split(':')[3].Replace("}", string.Empty).Replace("\"", string.Empty);
        //    return queryResponse;
        //}

    }
}