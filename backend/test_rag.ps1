function Base64UrlEncode([byte[]]$bytes) {
    $s = [Convert]::ToBase64String($bytes).Replace('+', '-').Replace('/', '_').TrimEnd('=')
    return $s
}
$utf8 = [System.Text.Encoding]::UTF8
$now = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()

$headerJson = '{"alg":"HS256","typ":"JWT"}'
$payloadJson = "{`"sub`":`"1`",`"role`":`"ADMIN`",`"name`":`"Admin`",`"email`":`"admin@marublog.com`",`"iat`":$now,`"exp`":$($now+604800)}"

$headerB64 = Base64UrlEncode ($utf8.GetBytes($headerJson))
$payloadB64 = Base64UrlEncode ($utf8.GetBytes($payloadJson))
$toSign = "$headerB64.$payloadB64"

$secret = 'dev-secret-change-me-in-production-please-1234567890'
$keyBytes = $utf8.GetBytes($secret)
$hmac = New-Object System.Security.Cryptography.HMACSHA256
$hmac.Key = $keyBytes
$sig = $hmac.ComputeHash($utf8.GetBytes($toSign))
$sigB64 = Base64UrlEncode $sig
$adminToken = "$toSign.$sigB64"

Write-Host "ADMIN_TOKEN=$adminToken"
Write-Host ""

Write-Host "============================================"
Write-Host "  测试 1: 全量重建索引 (POST /api/ai/admin/reindex)"
Write-Host "============================================"
try {
    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    $resp = Invoke-WebRequest -Uri 'http://localhost:8080/api/ai/admin/reindex' -Method Post `
        -Headers @{ Authorization = "Bearer $adminToken" } -UseBasicParsing -TimeoutSec 600
    $sw.Stop()
    $json = $resp.Content | ConvertFrom-Json
    Write-Host "  OK! ${($sw.ElapsedMilliseconds)}ms"
    Write-Host "  chunks=$($json.data.chunks)  elapsed=$($json.data.elapsedMs)ms"
    Write-Host "  msg=$($json.data.message)"
} catch {
    Write-Host "  ERROR: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "  Body: $($reader.ReadToEnd())"
    }
}

Write-Host ""
Write-Host "============================================"
Write-Host "  测试 2: 查 DB 向量数量"
Write-Host "============================================"
mysql -uroot -pz123qweasd -e "USE marublog; SELECT COUNT(*) as chunks FROM ai_post_embedding; SELECT COUNT(DISTINCT post_id) as posts FROM ai_post_embedding;" 2>&1 | Select-String -Pattern "chunks|posts"

Write-Host ""
Write-Host "============================================"
Write-Host "  测试 3: 人设查询 (GET /api/ai/persona)"
Write-Host "============================================"
try {
    $resp = Invoke-WebRequest -Uri 'http://localhost:8080/api/ai/persona' -UseBasicParsing -TimeoutSec 10
    $json = $resp.Content | ConvertFrom-Json
    Write-Host "  人设: $($json.data.name) ($($json.data.avatar))"
    Write-Host "  soulPrompt前100字: $($json.data.soulPrompt.Substring(0, [Math]::Min(100, $json.data.soulPrompt.Length)))"
} catch { Write-Host "  ERROR: $($_.Exception.Message)" }

Write-Host ""
Write-Host "============================================"
Write-Host "  测试 4: RAG + AI 对话 - 强博客意图"
Write-Host "============================================"
try {
    $body = '{"message":"MaruBlog 有哪些功能？你最喜欢哪篇文章？"}'
    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    $resp = Invoke-WebRequest -Uri 'http://localhost:8080/api/ai/chat' -Method Post `
        -Headers @{ 'Content-Type' = 'application/json' } -Body $body -UseBasicParsing -TimeoutSec 120
    $sw.Stop()
    $json = $resp.Content | ConvertFrom-Json
    Write-Host "  OK! ${($sw.ElapsedMilliseconds)}ms"
    Write-Host "  Maru 回复:"
    Write-Host "  $($json.data.reply)"
} catch {
    Write-Host "  ERROR: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "  Body: $($reader.ReadToEnd())"
    }
}

Write-Host ""
Write-Host "============================================"
Write-Host "  测试 5: AI 对话 - 通用知识 (不走 RAG)"
Write-Host "============================================"
try {
    $body = '{"message":"什么是 Spring Boot？"}'
    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    $resp = Invoke-WebRequest -Uri 'http://localhost:8080/api/ai/chat' -Method Post `
        -Headers @{ 'Content-Type' = 'application/json' } -Body $body -UseBasicParsing -TimeoutSec 120
    $sw.Stop()
    $json = $resp.Content | ConvertFrom-Json
    Write-Host "  OK! ${($sw.ElapsedMilliseconds)}ms"
    Write-Host "  Maru 回复:"
    Write-Host "  $($json.data.reply)"
} catch {
    Write-Host "  ERROR: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "  Body: $($reader.ReadToEnd())"
    }
}