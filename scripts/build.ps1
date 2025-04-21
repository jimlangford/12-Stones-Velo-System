Write-Host "🛠️ Simulating Windows-safe build..."

# Create dist folder if it doesn't exist
$dist = "frontend\dist"
if (-Not (Test-Path $dist)) {
    New-Item -Path $dist -ItemType Directory | Out-Null
}

# Write HTML content
$html = "<!DOCTYPE html><html><body><h1>12 Stones Velo System</h1></body></html>"
Set-Content -Path "$dist\index.html" -Value $html -Encoding UTF8

Write-Host "✅ Build complete."
