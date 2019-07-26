using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Text;
using System.Net.Http.Headers;
using abcd.Models;
using System.Collections.Generic;
using System;

namespace WebApplication1.Controllers
{
    public class MissingController : ApiController
    {
        // expiry time for auth token is 60mins 

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

        // post request
        [HttpGet]
        public QueryJobResponse AddMissingData(string authToken)
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
            HttpClient client = new HttpClient();
            string api = "https://dashdb-txn-sbox-yp-lon02-01.services.eu-gb.bluemix.net:8443/dashdb-api/v2/sql_jobs";
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, api);
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authToken);
            request = new HttpRequestMessage(HttpMethod.Post, api);
            request.Content = new StringContent("{\"commands\": \"" + @"INSERT INTO MISSINGUSERS(userName,age,address,phoneNumber,markSafe,imageUrl,uploadedByName,uploadedDate,uploadedByPhnNum,isMsgSent,sendPhnNum,senderName,safeLocation)VALUES('Chris Smith', '50', '305, jessore Road, kolkata - 700048', '0987654321', 0, 'C:\\Users\\503322\\Desktop\\Test.jpg', 'Prateek G', CURRENT DATE, '1234567890', 0, '9988776655', 'saby da', 'kolkata')" + "\",\"limit\":\"" + 10 + "\", \"separator\":\"" + ";" + "\", \"stop_on_error\": \"" + "no" + "\"}", Encoding.UTF8, "application/json");
            var response = client.SendAsync(request).Result;
            var responseContent = response.Content.ReadAsAsync<QueryJobResponse>().Result;
            return responseContent;
        }
        [HttpGet]
        public List<MissingDetails> RetrieveMissingData(string authToken)
        {
            List<MissingDetails> lstMissingData = null;
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
            HttpClient client = new HttpClient();
            string api = "https://dashdb-txn-sbox-yp-lon02-01.services.eu-gb.bluemix.net:8443/dashdb-api/v2/sql_query_export";                       
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authToken);
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, api);
            request.Content = new StringContent("{\"command\": \"" + "SELECT * FROM MISSINGUSERS" + "\"}", Encoding.UTF8, "application/json");
            var response = client.SendAsync(request).Result;
            var responseContent = response.Content.ReadAsStringAsync().Result;
            var result = responseContent.Split('\n');
            if (result.Length > 1)
            {
                lstMissingData = new List<MissingDetails>();
                for (int i = 1; i < result.Length - 1; i++)
                {
                    MissingDetails user = new MissingDetails();
                    user.UserName = result[i].Split('\"')[1].ToString();
                    user.Address = result[i].Split('\"')[5].ToString();
                    user.Age = result[i].Split('\"')[3].ToString();
                    user.ImageUrl = result[i].Split('\"')[9].ToString();
                    user.IsMsgSent = result[i].Split('\"')[14].ToString() == "1"? true :false;
                    user.MarkSafe = result[i].Split('\"')[8].ToString().Replace("'",string.Empty) == "1" ? true : false; 
                    user.PhoneNumber = result[i].Split('\"')[7].ToString();
                    user.SafeLocation = result[i].Split('\"')[19].ToString();
                    user.SenderName = result[i].Split('\"')[16].ToString();
                    user.SendPhnNum = result[i].Split('\"')[15].ToString();
                    user.UploadedByName = result[i].Split('\"')[11].ToString();
                    user.UploadedByPhnNum = result[i].Split('\"')[13].ToString();
                    user.UploadedDate = Convert.ToDateTime(result[i].Split('\"')[12].ToString().Replace("'", string.Empty));                    
                    lstMissingData.Add(user);
                }
            }
            return lstMissingData;
        }

        // post request
        [HttpGet]
        public QueryJobResponse UpdateMissingDetails(string authToken)
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
            HttpClient client = new HttpClient();
            string api = "https://dashdb-txn-sbox-yp-lon02-01.services.eu-gb.bluemix.net:8443/dashdb-api/v2/sql_jobs";
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, api);
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authToken);
            request = new HttpRequestMessage(HttpMethod.Post, api);
            request.Content = new StringContent("{\"commands\": \"" + @"UPDATE MISSINGUSERS
                SET markSafe = 1,isMsgSent = 1,sendPhnNum ='9876543210',senderName = 'Ankita Ghosh',safeLocation = 'Kolkata'
                WHERE userName = 'Sam Smith'" + "\",\"limit\":\"" + 10 + "\", \"separator\":\"" + ";" + "\", \"stop_on_error\": \"" + "no" + "\"}", Encoding.UTF8, "application/json");
            var response = client.SendAsync(request).Result;
            var responseContent = response.Content.ReadAsAsync<QueryJobResponse>().Result;
            return responseContent;
        }

        //[HttpGet]
        //public queryJobResponse DropTable(string authToken)
        //{
        //    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
        //    HttpClient client = new HttpClient();
        //    string api = "https://dashdb-txn-sbox-yp-lon02-01.services.eu-gb.bluemix.net:8443/dashdb-api/v2/sql_jobs";
        //    HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, api);
        //    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authToken);
        //    request = new HttpRequestMessage(HttpMethod.Post, api);
        //    request.Content = new StringContent("{\"commands\": \"" + "DROP TABLE  RegisterUsers"+"\",\"limit\":\"" + 10 + "\", \"separator\":\"" + ";" + "\", \"stop_on_error\": \"" + "no" + "\"}", Encoding.UTF8, "application/json");
        //    var response = client.SendAsync(request).Result;
        //    var responseContent = response.Content.ReadAsAsync<queryJobResponse>().Result;
        //    return responseContent;
        //}
        

        
       

    }
}