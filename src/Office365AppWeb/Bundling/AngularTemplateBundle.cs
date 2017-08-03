using System.IO;
using System.Text;
using System.Web.Hosting;
using System.Web.Optimization;

namespace Office365AppWeb
{
    public class AngularTemplateBundle : Bundle
    {
        public AngularTemplateBundle(string moduleName, string virtualPath, string version = "")
            : base(virtualPath, null, new[] { new AngularTemplateBundleTransform(moduleName, version) })
        {
        }
    }

    public class AngularTemplateBundleTransform : IBundleTransform
    {
        private readonly string _version;
        private readonly string _moduleName;

        public AngularTemplateBundleTransform(string moduleName, string version)
        {
            _version = version;
            _moduleName = moduleName;
        }

        public void Process(BundleContext context, BundleResponse response)
        {
            var strBundleResponse = new StringBuilder();
            string content;
            strBundleResponse.AppendFormat(
                @"angular.module('{0}').run(['$templateCache',function(t){{",
                _moduleName);

            foreach (var file in response.Files)
            {
                VirtualFile virtualFile = file.VirtualFile;
                string relativePath = GetRelativePath(virtualFile);
                string diskFilePath = context.HttpContext.Server.MapPath(virtualFile.VirtualPath);

                content = File.ReadAllText(diskFilePath).Replace("\r", " ").Replace("\n", " ").Replace("'", "\\'");
                AddTemplateBundleEntry(strBundleResponse, _version, relativePath, virtualFile.Name, content);
            }
            strBundleResponse.Append(@"}]);");

            response.Files = new BundleFile[] { };
            response.Content = strBundleResponse.ToString();
            response.ContentType = "text/javascript";
        }

        private string GetRelativePath(VirtualFile virtualFile)
        {
            string relativePath = virtualFile.VirtualPath;
            if (relativePath.StartsWith("~"))
            {
                relativePath = relativePath.Substring(1);
            }
            if (relativePath.StartsWith("/"))
            {
                relativePath = relativePath.Substring(1);
            }
            relativePath = relativePath.Replace(virtualFile.Name, "");

            return relativePath;
        }

        private void AddTemplateBundleEntry(StringBuilder bundleResponse, string version, string relativePath, string fileName, string content)
        {
            var versionSuffix = string.IsNullOrEmpty(version) ? "" : "?v=" + version;
            bundleResponse.Append($"t.put('{relativePath}{fileName}{versionSuffix}','{content}');");
        }
    }
}