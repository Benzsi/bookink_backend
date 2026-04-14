$basePath = "c:\Users\Lenovo\Documents\back\bookink_backend"

# List of files to process (recursive search)
$files = Get-ChildItem -Path $basePath -Include *.ts,*.json,*.md,*.env,*.prisma -Recurse

foreach ($file in $files) {
    if ($file.FullName -match "node_modules") { continue }
    if ($file.FullName -match "dist") { continue }
    
    $content = Get-Content $file.FullName -Raw
    $original = $content
    
    # Case-sensitive sequential replacements (-creplace)
    $content = $content -creplace "bookink", "indiebackseat"
    $content = $content -creplace "Bookink", "IndieBackseat"
    $content = $content -creplace "book", "game"
    $content = $content -creplace "Book", "Game"
    $content = $content -creplace "könyv", "játék"
    $content = $content -creplace "Könyv", "Játék"
    
    if ($content -ne $original) {
        Write-Host "Updating $($file.FullName)"
        $content | Set-Content $file.FullName
    }
}
