$envFile = Join-Path $PSScriptRoot '.env'
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith('#') -and $line -match '=') {
            $parts = $line -split '=', 2
            $key = $parts[0].Trim()
            $val = $parts[1].Trim()
            [System.Environment]::SetEnvironmentVariable($key, $val, 'Process')
        }
    }
    Write-Host "Loaded .env variables: $((Get-Content $envFile | Where-Object { $_ -match '^[A-Z_]+=' -and $_ -notmatch 'KEY|SECRET|PASS' } | ForEach-Object { ($_ -split '=',2)[0] }) -join ', ')"
} else {
    Write-Host "WARNING: .env not found - AI features may be disabled"
}

Set-Location (Join-Path $PSScriptRoot 'backend')
mvn spring-boot:run