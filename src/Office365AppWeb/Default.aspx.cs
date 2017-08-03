using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;

namespace Office365AppWeb
{
    public partial class Default : System.Web.UI.Page
    {
        protected string BaseDir;
#if VORLON 
        public bool VorlonEnabled = true;
#else
        public bool VorlonEnabled = false;
#endif
        protected void Page_Load(object sender, EventArgs e)
        {
            BaseDir = AppConfig.BaseScriptsDirectory;
            if (AppConfig.TakeDown)
            {
                Response.Redirect("SiteDown.aspx");
            }

            const string csName = "AppConfig";
            Type csType = this.GetType();
            ClientScriptManager clientScript = Page.ClientScript;

            if (!clientScript.IsStartupScriptRegistered(csType, csName))
            {
                StringBuilder csText = new StringBuilder();
                csText.Append("<script>var appSettings = {");
                csText.Append($"TemplateVersion: \"{AppConfig.TemplateVersion}\",");
                csText.AppendFormat("AppName: \"{0}\", ", AppConfig.AppName);
                csText.AppendFormat("AppContextId: \"{0}\", ", AppConfig.AppContextId);
                csText.AppendFormat("ApiClientKey: \"{0}\", ", AppConfig.ApiClientKey);
                csText.AppendFormat("ApiUrl: \"{0}\", ", AppConfig.ApiUrl);
                csText.AppendFormat("Environment: \"{0}\", ", AppConfig.Environment);
                csText.AppendFormat("ProductId: \"{0}\", ", AppConfig.ProductId);
                csText.AppendFormat("GeocodeUrl: \"{0}\", ", AppConfig.GeocodeUrl);
                csText.AppendFormat("GeocodeApiKey: \"{0}\", ", AppConfig.GeocodeApiKey);
                csText.AppendFormat("RetailerId: \"{0}\", ", AppConfig.RetailerId);
                csText.AppendFormat("RetailerCode: \"{0}\", ", AppConfig.RetailerCode);
                csText.AppendFormat("UpperLimit: \"{0}\", ", AppConfig.UpperLimit);
                csText.AppendFormat("LowerLimit: \"{0}\", ", AppConfig.LowerLimit);
                csText.AppendFormat("MapHeight: \"{0}\", ", AppConfig.MapHeight);
                csText.AppendFormat("MapWidth: \"{0}\", ", AppConfig.MapWidth);
                csText.AppendFormat("MapZoomLevel: \"{0}\", ", AppConfig.MapZoomLevel);
                csText.AppendFormat("MapUrl: \"{0}\", ", AppConfig.MapUrl);
                csText.AppendFormat("MapApiKey: \"{0}\", ", AppConfig.MapApiKey);
                csText.AppendFormat("BaseScriptsDirectory: \"{0}\", ", AppConfig.BaseScriptsDirectory);
                csText.AppendFormat("RecommendationServiceUrl: \"{0}\", ", AppConfig.RecommendationServiceUrl);


                csText.Append("}; </script>");
                clientScript.RegisterStartupScript(csType, csName, csText.ToString());
            }
        }
        public string GetScriptDir()
        {
            return AppConfig.BaseScriptsDirectory;
        }
    }
}