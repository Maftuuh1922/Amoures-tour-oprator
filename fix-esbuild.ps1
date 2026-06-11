Add-Type -AssemblyName System.IO.Compression.FileSystem

$tgz = 'C:\Users\Administrator\MOURES\esbuild-pkg.tgz'
$tar = 'C:\Users\Administrator\MOURES\esbuild-pkg.tar'
$dest = 'C:\Users\Administrator\MOURES\esbuild-extract'

# Decompress .tgz to .tar
$gz = [System.IO.File]::OpenRead($tgz)
$gzStream = New-Object System.IO.Compression.GZipStream($gz, [System.IO.Compression.CompressionMode]::Decompress)
$out = [System.IO.File]::OpenWrite($tar)
$gzStream.CopyTo($out)
$gzStream.Close()
$out.Close()
$gz.Close()
Write-Host "Decompressed to .tar"

# Parse tar to find esbuild.exe
$tarBytes = [System.IO.File]::ReadAllBytes($tar)
$pos = 0
$found = $false

while ($pos + 512 -lt $tarBytes.Length) {
    # Read header block (512 bytes)
    $nameBytes = $tarBytes[$pos..($pos+99)]
    $name = [System.Text.Encoding]::UTF8.GetString($nameBytes).TrimEnd([char]0)

    # Get file size from octal string at offset 124, length 12
    $sizeOctal = [System.Text.Encoding]::ASCII.GetString($tarBytes[($pos+124)..($pos+135)]).Trim().TrimEnd([char]0)
    if ($sizeOctal -eq '') { $pos += 512; continue }

    try { $size = [Convert]::ToInt64($sizeOctal, 8) } catch { $pos += 512; continue }

    Write-Host "Entry: $name (size: $size)"

    if ($name -like "*/esbuild.exe" -or $name -eq "package/esbuild.exe") {
        $fileStart = $pos + 512
        $exeBytes = $tarBytes[$fileStart..($fileStart + $size - 1)]
        $exeDest = 'C:\Users\Administrator\MOURES\node_modules\@esbuild\win32-x64\esbuild.exe'
        [System.IO.File]::WriteAllBytes($exeDest, $exeBytes)
        Write-Host "Extracted esbuild.exe to $exeDest (size: $($exeBytes.Length))"
        $found = $true
        break
    }

    # Skip to next block (align to 512 bytes)
    $blocks = [Math]::Ceiling($size / 512)
    $pos += 512 + ($blocks * 512)
}

if (-not $found) {
    Write-Host "esbuild.exe not found in archive. Listing all entries:"
}

Write-Host "Done"
