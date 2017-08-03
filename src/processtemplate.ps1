#$configurationName = "Debug"
#$sourcePath = "C:\Projects\PNI\src\Office365App\Office365AppManifest\"

Param(
  [string]$configurationName,
  [string]$sourcePath
)

if ($configurationName.StartsWith("Release"))
{
    $appUrl = "https://splus-365.pnimedia.com/"
}

if ($configurationName.StartsWith("Debug")){
    $appUrl = "https://localhost:44306/"
}

if ($configurationName.StartsWith("Test-EBT")){
    $appUrl = "https://staplestest.azurewebsites.net/"
}

if ($configurationName.StartsWith("Test-PNI")){
    $appUrl = "https://office365.pnistaging.com/"
}

$templateFileName = "manifest-template.xml"
$outputFileName  = "Office365App.xml"

(Get-Content "$sourcePath$templateFileName") -replace "{{appUrl}}", $appUrl | Set-Content "$sourcePath$outputFileName"