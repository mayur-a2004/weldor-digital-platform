Add-Type -AssemblyName System.Drawing
[Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime] | Out-Null
[Windows.Media.Ocr.OcrEngine, Windows.Foundation.Diagnostics, ContentType = WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.BitmapDecoder, Windows.Graphics.Imaging, ContentType = WindowsRuntime] | Out-Null

$ocrEngine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
if ($null -eq $ocrEngine) {
    $ocrEngine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage([Windows.Globalization.Language]::new("en-US"))
}

New-Item -ItemType Directory -Force -Path "scripts/ocr_results" | Out-Null

1..12 | ForEach-Object {
    $pageNum = $_
    $imgPath = (Resolve-Path "public/catalog_pages/page_$pageNum.png").Path
    $fileTask = [Windows.Storage.StorageFile]::GetFileFromPathAsync($imgPath)
    $file = $fileTask.GetAwaiter().GetResult()
    
    $streamTask = $file.OpenAsync([Windows.Storage.FileAccessMode]::Read)
    $stream = $streamTask.GetAwaiter().GetResult()
    
    $decoderTask = [Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)
    $decoder = $decoderTask.GetAwaiter().GetResult()
    
    $bitmapTask = $decoder.GetSoftwareBitmapAsync()
    $bitmap = $bitmapTask.GetAwaiter().GetResult()
    
    $ocrTask = $ocrEngine.RecognizeAsync($bitmap)
    $ocrResult = $ocrTask.GetAwaiter().GetResult()
    
    $text = $ocrResult.Text
    $outPath = "scripts/ocr_results/page_$pageNum.txt"
    $text | Set-Content -Path $outPath -Encoding UTF8
    
    Write-Host "=== PAGE $pageNum ==="
    Write-Host $text.Substring(0, [Math]::Min(300, $text.Length))
    Write-Host "----------------------------------"
}
