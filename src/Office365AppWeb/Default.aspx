<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Office365AppWeb.Default" %>
<%@ Import Namespace="System.Web.Optimization" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Print to Staples Angular</title>
    <%=Styles.Render("~/bundles/css") %>
</head>
<body data-ng-app="Archon">
    <form id="form1" runat="server">
    </form>
    <div id="container">
        <div id="Archon">
            <main></main>
        </div>
    </div>
    <% if (VorlonEnabled)
       { %>
    <script src="https://staplesvorlon.azurewebsites.net/vorlon.js"></script>
    <% } %>
    <%=Scripts.Render("~/bundles/frameworks") %>
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.5.0-beta.2/angular-animate.js"></script>
    <script src="https://appsforoffice.microsoft.com/lib/1/hosted/Office.js" type="text/javascript"></script>


   <%--     <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>--%>

    <script>
        angular.module('Archon', ['ngAnimate']);
    </script>
    <%=Scripts.Render("~/bundles/partials") %>
    <%=Scripts.Render("~/bundles/archon") %>

    <script>
        (function (i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
                (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * new Date(); a = s.createElement(o),
                m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
        })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

        ga('create', 'UA-758595-60', 'auto', {
            'appName': 'Office365Addon'
        });
        ga('set', 'page', "/" + appSettings.Environment + '/print-options');
        ga('send', 'pageview');
    </script>
</body>
</html>
