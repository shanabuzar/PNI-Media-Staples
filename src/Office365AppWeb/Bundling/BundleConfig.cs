using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Optimization;

namespace Office365AppWeb
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            var TemplatesVersion = AppConfig.TemplateVersion;
            var BaseDir = AppConfig.BaseScriptsDirectory;
            bundles.Add(new AngularTemplateBundle("Archon", "~/bundles/partials", TemplatesVersion)
                .IncludeDirectory($"~/{BaseDir}partials", "*.html", true));

            bundles.Add(new StyleBundle("~/bundles/css")
                .Include($"~/{BaseDir}style/bootstrap.min.css")
                .Include($"~/{BaseDir}style/Archon.css"));

            bundles.Add(new ScriptBundle("~/bundles/frameworks")
                .Include("~/App/scripts/frameworks/jquery-1.11.3.min.js")
                .Include("~/App/scripts/frameworks/angular.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/archon")
                .Include("~/App/App.js")
                .Include($"~/{BaseDir}implementations/office365Service.js")
                .Include($"~/{BaseDir}controllers/LocationSelectionController.js")
                .Include($"~/{BaseDir}controllers/MasterController.js")
                .Include($"~/{BaseDir}controllers/OrderCompleteController.js")
                .Include($"~/{BaseDir}controllers/ProductOptionsController.js")
                .Include($"~/{BaseDir}controllers/SubmitOrderController.js")
                .Include($"~/{BaseDir}controllers/OrderPreviewController.js")

                .Include($"~/{BaseDir}services/messagePopupService.js")
                .Include($"~/{BaseDir}services/accountService.js")
                .Include($"~/{BaseDir}services/businessLogicService.js")
                .Include($"~/{BaseDir}services/pdfUtils.js")
                .Include($"~/{BaseDir}services/documentService.js")
                .Include($"~/{BaseDir}services/productSizeService.js")
                .Include($"~/{BaseDir}services/errorService.js")
                .Include($"~/{BaseDir}services/locationService.js")
                .Include($"~/{BaseDir}services/httpService.js")
                .Include($"~/{BaseDir}services/pniApiService.js")
                .Include($"~/{BaseDir}services/storageService.js")

                .Include($"~/{BaseDir}directives/MainDirective.js")
                .Include($"~/{BaseDir}directives/MessagePopupDirective.js")
                .Include($"~/{BaseDir}directives/PrintOptionsDirective.js")
                .Include($"~/{BaseDir}directives/PricingDirective.js")
                .Include($"~/{BaseDir}directives/PickupInformationDirective.js")
                .Include($"~/{BaseDir}directives/LocationSelectionDirective.js")
                .Include($"~/{BaseDir}directives/OrderCompleteDirective.js")
                .Include($"~/{BaseDir}directives/OrderPreviewDirective.js"));

        }
    }
}