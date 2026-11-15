# Tiny static file server for the Emergency Guidance Assistant.
# Zero dependencies: uses .NET HttpListener. The app also runs offline by
# double-clicking web/index.html — this server is a convenience for http:// use.
#
#   powershell -NoProfile -ExecutionPolicy Bypass -File serve.ps1 [port]
#
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$port = if ($args.Count -ge 1) { $args[0] } else { "8123" }

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
try { $listener.Prefixes.Add("http://127.0.0.1:$port/") } catch { }

$mime = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".txt"  = "text/plain; charset=utf-8"
  ".svg"  = "image/svg+xml"
  ".png"  = "image/png"
}

Write-Host "Serving $root at http://localhost:$port/web/  (Ctrl+C to stop)"
$listener.Start()

while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  try {
    $path = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath)
    if ($path -eq "/") { $path = "/web/index.html" }
    $file = Join-Path $root ($path -replace "/", "\")
    $full = [IO.Path]::GetFullPath($file)
    if (Test-Path $full -PathType Container) { $full = Join-Path $full "index.html" }
    if (-not $full.StartsWith($root, [StringComparison]::OrdinalIgnoreCase) -or -not (Test-Path $full -PathType Leaf)) {
      $ctx.Response.StatusCode = 404
      $bytes = [Text.Encoding]::UTF8.GetBytes("404 not found: $path")
    } else {
      $ext = [IO.Path]::GetExtension($full).ToLowerInvariant()
      $ctx.Response.ContentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { "application/octet-stream" }
      $ctx.Response.Headers.Add("Cache-Control", "no-cache")
      $bytes = [IO.File]::ReadAllBytes($full)
    }
    $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  } catch {
    try { $ctx.Response.StatusCode = 500 } catch { }
  } finally {
    try { $ctx.Response.Close() } catch { }
  }
}
