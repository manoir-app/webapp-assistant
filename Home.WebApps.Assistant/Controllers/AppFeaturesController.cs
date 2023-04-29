using Home.Graph.Common;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Home.WebApps.Assistant.Controllers
{
    [Route("api")]
    [ApiController]
    public class AppFeaturesController : ControllerBase
    {

        private string GetDeviceId()
        {
            if (Request.Cookies.TryGetValue("ManoirDeviceAuth", out string cookie))
            {
                var tmp = JsonConvert.DeserializeObject<AuthenticationCookie>(cookie);
                if (tmp != null && !string.IsNullOrEmpty(tmp.DeviceId))
                    return tmp.DeviceId;

            }

            return null;
        }


        private class AuthenticationCookie
        {
            public string DeviceId { get; set; }
        }


        public class Presence
        {
            public bool PrivacyModeActivated { get; set; }
        }

        [Route("presence"), HttpGet]
        public Presence GetPresence()
        {
            Presence presence = new Presence();

            string devId = GetDeviceId();
            if (devId == null)
                return null;

            using (var cli = new MainApiDeviceWebClient(devId))
            {                
                presence.PrivacyModeActivated = cli.DownloadData<bool>("v1.0/system/mesh/local/privacymode/isenabled");
            }
            
            return presence;
        }


    }
}
