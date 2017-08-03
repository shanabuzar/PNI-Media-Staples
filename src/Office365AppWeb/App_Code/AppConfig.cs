using System;
using System.Web.Configuration;

namespace Office365AppWeb
{
    public class AppConfig
    {

        public static bool TakeDown
        {
            get
            {
                try
                {
                    return Convert.ToBoolean(WebConfigurationManager.AppSettings["EmergencyTakedown"]);
                }
                catch (FormatException)
                {
                    return false;
                }
            }
        }
        public static string BaseScriptsDirectory
        {
            get
            {
                return WebConfigurationManager.AppSettings["BaseScriptsDirectory"];
            }
        }

        public static int AppContextId
        {
            get
            {
                return int.Parse(WebConfigurationManager.AppSettings["AppContextId"]);
            }
        }
        
        public static string ApiClientKey
        {
            get
            {
                return WebConfigurationManager.AppSettings["ApiKey"];
                
            }
        }
        public static string Environment
        {
            get
            {
                return WebConfigurationManager.AppSettings["Environment"];
            }
        }
        public static string RecommendationServiceUrl
        {
            get
            {
                return WebConfigurationManager.AppSettings["RecommendationServiceUrl"];
            }
        }
        public static string ApiUrl
        {
            get
            {
                return WebConfigurationManager.AppSettings["ApiUrl"];
            }
        }
        public static string UpperLimit
        {
            get
            {
                return WebConfigurationManager.AppSettings["UpperLimit"];
            }
        }
        public static string LowerLimit
        {
            get
            {
                return WebConfigurationManager.AppSettings["LowerLimit"];
            }
        }


        public static string GeocodeUrl
        {
            get
            {
                return WebConfigurationManager.AppSettings["GeocodeUrl"];
            }
        }
        public static string GeocodeApiKey
        {
            get
            {
                return WebConfigurationManager.AppSettings["GeocodeApiKey"];
            }
        }

        public static string TemplateVersion
        {
            get { return WebConfigurationManager.AppSettings["TemplateVersion"]; }
        }

        public static string AppName
        {
            get
            {
                return WebConfigurationManager.AppSettings["AppName"];
            }
        }
        public static string ProductId
        {
            get
            {
                return WebConfigurationManager.AppSettings["ProductId"];
            }
        }
        public static string RetailerId
        {
            get
            {
                return WebConfigurationManager.AppSettings["RetailerId"];
            }
        }
        public static string RetailerCode
        {
            get
            {
                return WebConfigurationManager.AppSettings["RetailerCode"];
            }
        }
        
        /* MAP SETTINGS */
        public static string MapUrl
        {
            get
            {
                return WebConfigurationManager.AppSettings["MapUrl"];
            }
        }
        public static string MapApiKey
        {
            get
            {
                return WebConfigurationManager.AppSettings["MapApiKey"];
            }
        }
        public static string MapWidth
        {
            get
            {
                return WebConfigurationManager.AppSettings["MapWidth"];
            }
        }
        public static string MapHeight
        {
            get
            {
                return WebConfigurationManager.AppSettings["MapHeight"];
            }
        }
        public static string MapZoomLevel
        {
            get
            {
                return WebConfigurationManager.AppSettings["MapZoomLevel"];
            }
        }
        public static string UploadServerBatchEndpoint
        {
            get
            {
                return "depreciated";
            }
        }
        public static string UploadServerEndpoint
        {
            get
            {
                return "depreciated";
            }
        }

    }
}