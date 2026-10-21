# Set env
Get-Content .env | Where-Object { $_ -match '=' -and $_ -notmatch '^#' } | ForEach-Object { $name, $value = $_ -split '=', 2; [Environment]::SetEnvironmentVariable($name, $value, 'Process') }

# Start backend in background
Write-Host "Starting Spring Boot..."
$process = Start-Process -FilePath "C:\Users\Dell\maven\apache-maven-3.9.9\bin\mvn.cmd" -ArgumentList "spring-boot:run" -NoNewWindow -PassThru
Start-Sleep -Seconds 25

Write-Host "`n========== ML END TO END VERIFICATION START =========="
try {
    # Login to get token
    $loginResponse = Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/auth/login" -ContentType "application/json" -Body '{"email":"admin@smartstock.ai","password":"Admin123!"}'
    $token = $loginResponse.token
    $headers = @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" }

    Write-Host "Target Product: Smart Hub Pro (ID 1)"

    # Generate prediction BEFORE
    Write-Host "Generating BEFORE prediction..."
    Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/predictions/generate-all" -Headers $headers | Out-Null
    $predBefore = Invoke-RestMethod -Method Get -Uri "http://localhost:8080/api/predictions/product/1/latest" -Headers $headers
    Write-Host "BEFORE - Predicted Qty: $($predBefore.predictedQuantity)"
    Write-Host "BEFORE - Timestamp: $($predBefore.predictionDate)"

    # POST new sale
    Write-Host "Adding a huge sale (Quantity 500) to Aiven MySQL via API..."
    $saleBody = '{"customerReference":"CUST-VERIFY","productId":1,"quantity":500,"unitPrice":19.99}'
    try {
        Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/sales" -Headers $headers -Body $saleBody | Out-Null
    } catch {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        Write-Host "API Error Response: $($reader.ReadToEnd())"
        throw $_
    }

    # Generate prediction AFTER
    Write-Host "Generating AFTER prediction..."
    Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/predictions/generate-all" -Headers $headers | Out-Null
    $predAfter = Invoke-RestMethod -Method Get -Uri "http://localhost:8080/api/predictions/product/1/latest" -Headers $headers
    Write-Host "AFTER - Predicted Qty: $($predAfter.predictedQuantity)"
    Write-Host "AFTER - Timestamp: $($predAfter.predictionDate)"

} catch {
    Write-Host "An error occurred: $_"
} finally {
    Write-Host "========== ML END TO END VERIFICATION END ==========`n"
    Write-Host "Stopping Spring Boot..."
    if ($process) { Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue }
}
