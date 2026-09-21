<#
  build-media.ps1 — prepara i file di /media per il web.

  Cosa fa:
    1. legge le foto in  media/foto/<Progetto>/<sottocartella>/
    2. genera due versioni ottimizzate in assets/media/
         thumbs/<slug>/  lato max  900px, qualita 72  -> griglia
         full/<slug>/    lato max 2000px, qualita 82  -> lightbox
    3. riscrive il blocco "photos: [...]" dentro assets/js/media.js
    4. (con -Video) converte gli .mp4 trovati in 1080p H.264 + poster jpg

  Uso:
    powershell -ExecutionPolicy Bypass -File tools\build-media.ps1
    powershell -ExecutionPolicy Bypass -File tools\build-media.ps1 -Video

  Le foto e i video originali in /media non vengono mai modificati.
  I titoli dei progetti e l'elenco dei video restano a mano in assets/js/media.js.
  Per i video serve ffmpeg: winget install --id Gyan.FFmpeg -e
#>
param(
  [switch]$Video,
  [string]$FfmpegDir = ''
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$root   = Split-Path -Parent $PSScriptRoot
$thumbD = Join-Path $root 'assets\media\thumbs'
$fullD  = Join-Path $root 'assets\media\full'
$videoD = Join-Path $root 'assets\media\video'
New-Item -ItemType Directory -Force -Path $thumbD, $fullD | Out-Null

# Cartelle sorgente -> slug usato nei percorsi e in media.js.
# Aggiungi qui i progetti nuovi; piu cartelle nello stesso progetto vengono unite in ordine.
$projects = @(
  @{ slug = 'modigliana-city-run'; dirs = @('media\foto\Modigliana City Run\Foto - Corsa', 'media\foto\Modigliana City Run\Foto - Evento Generale') },
  @{ slug = 'museo-effimero';      dirs = @('media\foto\Museo Diffuso Granarolo - Effimero\Foto') },
  @{ slug = 'faenza-crescione';    dirs = @('media\foto\FaenzaCrese\Foto - Evento FaenzaCrescione') },
  @{ slug = 'calcio-oratorio';     dirs = @('media\foto\Calcio Oratorio\Foto - partite') }
)

# Le 4 foto di sfondo dell'hero, nell'ordine in cui ruotano.
# Sono <slug-progetto>\<nome-file> come generati qui sotto; cambia questi per cambiare l'apertura del sito.
$heroPicks = @(
  'calcio-oratorio\calcio-oratorio-05.jpg',
  'museo-effimero\museo-effimero-24.jpg',
  'modigliana-city-run\modigliana-city-run-25.jpg',
  'museo-effimero\museo-effimero-23.jpg'
)

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }

function Save-Resized {
  param($img, [string]$dest, [int]$maxSide, [int]$quality)

  $scale = [Math]::Min(1.0, $maxSide / [double]([Math]::Max($img.Width, $img.Height)))
  $nw = [Math]::Max(1, [int][Math]::Round($img.Width * $scale))
  $nh = [Math]::Max(1, [int][Math]::Round($img.Height * $scale))

  $bmp = New-Object System.Drawing.Bitmap($nw, $nh)
  $bmp.SetResolution(72, 72)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.CompositingQuality = 'HighQuality'
  $g.InterpolationMode  = 'HighQualityBicubic'
  $g.SmoothingMode      = 'HighQuality'
  $g.PixelOffsetMode    = 'HighQuality'
  $g.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $nw, $nh)))
  $g.Dispose()

  $p = New-Object System.Drawing.Imaging.EncoderParameters(1)
  $p.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [int64]$quality)
  $bmp.Save($dest, $script:jpegCodec, $p)
  $p.Dispose(); $bmp.Dispose()
  return @($nw, $nh)
}

# ---------- foto ----------
$entries = New-Object System.Collections.Generic.List[object]

foreach ($proj in $projects) {
  New-Item -ItemType Directory -Force -Path (Join-Path $thumbD $proj.slug), (Join-Path $fullD $proj.slug) | Out-Null
  $i = 0
  foreach ($rel in $proj.dirs) {
    $src = Join-Path $root $rel
    if (-not (Test-Path -LiteralPath $src)) { Write-Warning "cartella mancante: $rel"; continue }

    $files = Get-ChildItem -LiteralPath $src -File |
             Where-Object { $_.Extension -match '^\.(jpg|jpeg|png)$' -and $_.Name -notlike '._*' } |
             Sort-Object Name
    foreach ($f in $files) {
      $i++
      $name = '{0}-{1:d2}.jpg' -f $proj.slug, $i
      $img = [System.Drawing.Image]::FromFile($f.FullName)
      try {
        if ($img.PropertyIdList -contains 274) {   # orientamento EXIF
          switch ($img.GetPropertyItem(274).Value[0]) {
            3 { $img.RotateFlip('Rotate180FlipNone') }
            6 { $img.RotateFlip('Rotate90FlipNone') }
            8 { $img.RotateFlip('Rotate270FlipNone') }
          }
        }
        $dim = Save-Resized $img (Join-Path (Join-Path $fullD  $proj.slug) $name) 2000 82
        Save-Resized $img (Join-Path (Join-Path $thumbD $proj.slug) $name) 900 72 | Out-Null
      } finally { $img.Dispose() }

      $entries.Add([pscustomobject]@{ slug = $proj.slug; name = $name; w = $dim[0]; h = $dim[1] })
      Write-Host ("[{0,3}] {1}/{2}  {3}x{4}" -f $entries.Count, $proj.slug, $name, $dim[0], $dim[1])
    }
  }
}

# ---------- riscrive photos: [...] in media.js, alternando i progetti ----------
$bySlug = @{}
foreach ($e in $entries) {
  if (-not $bySlug.ContainsKey($e.slug)) { $bySlug[$e.slug] = New-Object System.Collections.Generic.List[object] }
  $bySlug[$e.slug].Add($e)
}
$slugs = $projects | ForEach-Object { $_.slug } | Where-Object { $bySlug.ContainsKey($_) }
$maxLen = 0; foreach ($s in $slugs) { if ($bySlug[$s].Count -gt $maxLen) { $maxLen = $bySlug[$s].Count } }

$lines = New-Object System.Collections.Generic.List[string]
for ($j = 0; $j -lt $maxLen; $j++) {
  foreach ($s in $slugs) {
    if ($j -lt $bySlug[$s].Count) {
      $e = $bySlug[$s][$j]
      $lines.Add(('    {{ p: "{0}", f: "{1}", w: {2}, h: {3} }}' -f $e.slug, $e.name, $e.w, $e.h))
    }
  }
}

# ---------- sfondi dell'hero: piu leggeri, la prima e la piu pesante che il visitatore scarica ----------
$heroD = Join-Path $root 'assets\media\hero'
New-Item -ItemType Directory -Force -Path $heroD | Out-Null
$n = 0
foreach ($pick in $heroPicks) {
  $n++
  $srcFile = Join-Path $fullD $pick
  if (-not (Test-Path -LiteralPath $srcFile)) { Write-Warning "hero: manca $pick"; continue }
  $img = [System.Drawing.Image]::FromFile($srcFile)
  try {
    # lato lungo max 1920 ma altezza max 1440, cosi i verticali non diventano enormi
    $scale = [Math]::Min([Math]::Min(1.0, 1920 / [double]$img.Width), 1440 / [double]$img.Height)
    $maxSide = [int][Math]::Round([Math]::Max($img.Width, $img.Height) * $scale)
    Save-Resized $img (Join-Path $heroD "hero-$n.jpg") $maxSide 68 | Out-Null
  } finally { $img.Dispose() }
  Write-Host ("hero-{0}.jpg <- {1}  {2} KB" -f $n, $pick, [math]::Round((Get-Item (Join-Path $heroD "hero-$n.jpg")).Length / 1KB))
}

$mediaJs = Join-Path $root 'assets\js\media.js'
$text = [System.IO.File]::ReadAllText($mediaJs)
$block = "photos: [`r`n" + ($lines -join ",`r`n") + "`r`n  ]"
$new = [System.Text.RegularExpressions.Regex]::Replace($text, 'photos:\s*\[[\s\S]*?\n  \]', [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $block })
[System.IO.File]::WriteAllText($mediaJs, $new, (New-Object System.Text.UTF8Encoding($false)))
Write-Host "media.js aggiornato: $($entries.Count) foto"

# ---------- pagine di progetto (progetti/<slug>.html) ----------
# I dati vengono letti da media.js: quello resta l'unico posto dove scrivere titoli e testi.

function Html-Escape([string]$s) {
  if ($null -eq $s) { return '' }
  $s.Replace('&', '&amp;').Replace('<', '&lt;').Replace('>', '&gt;').Replace('"', '&quot;')
}

function Get-Field([string]$body, [string]$name) {
  $m = [regex]::Match($body, ('{0}:\s*"((?:[^"\\]|\\.)*)"' -f $name))
  if ($m.Success) { $m.Groups[1].Value } else { '' }
}

$mediaText = [System.IO.File]::ReadAllText($mediaJs)

# il blocco projects: ogni voce e  "slug": { ... }  senza graffe annidate
$projBlock = [regex]::Match($mediaText, 'projects:\s*\{(?<b>[\s\S]*?)\n  \},\n').Groups['b'].Value
if (-not $projBlock) { throw 'non riesco a leggere il blocco projects da media.js' }
$videoBlock = [regex]::Match($mediaText, 'videos:\s*\[(?<b>[\s\S]*?)\n  \],').Groups['b'].Value

$pagine = @()
foreach ($m in [regex]::Matches($projBlock, '"(?<slug>[a-z0-9-]+)":\s*\{(?<body>[^{}]*)\}')) {
  $slug = $m.Groups['slug'].Value
  $b = $m.Groups['body'].Value
  $nFoto = ($entries | Where-Object { $_.slug -eq $slug }).Count
  $nVideo = ([regex]::Matches($videoBlock, ('p:\s*"{0}"' -f [regex]::Escape($slug)))).Count
  $pagine += [pscustomobject]@{
    slug        = $slug
    title       = Get-Field $b 'title'
    label       = Get-Field $b 'label'
    cat         = Get-Field $b 'cat'
    luogo       = Get-Field $b 'luogo'
    data        = Get-Field $b 'data'
    committente = Get-Field $b 'committente'
    cover       = Get-Field $b 'cover'
    desc        = Get-Field $b 'desc'
    nFoto       = $nFoto
    nVideo      = $nVideo
  }
}
if (-not $pagine.Count) { throw 'nessun progetto trovato in media.js' }

$pagineDir = Join-Path $root 'progetti'
New-Item -ItemType Directory -Force -Path $pagineDir | Out-Null

for ($i = 0; $i -lt $pagine.Count; $i++) {
  $p = $pagine[$i]
  $prev = $pagine[($i - 1 + $pagine.Count) % $pagine.Count]
  $next = $pagine[($i + 1) % $pagine.Count]

  $coverUrl = if ($p.cat -eq 'video') { "../assets/media/video/$($p.cover)" }
              else { "../assets/media/full/$($p.slug)/$($p.cover)" }

  $conteggio = @()
  if ($p.nFoto)  { $conteggio += "$($p.nFoto) foto" }
  if ($p.nVideo) { $conteggio += "$($p.nVideo) video" }
  $meta = (@($p.luogo, $p.data, $p.committente) + $conteggio | Where-Object { $_ }) -join ' · '

  $titleE = Html-Escape $p.title
  $descE  = Html-Escape $p.desc

  $html = @"
<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>$titleE — Luca Montanari</title>
<meta name="description" content="$descE">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/css/style.css">
<link rel="preload" as="image" href="$coverUrl" fetchpriority="high">
</head>
<!-- PAGINA GENERATA da tools/build-media.ps1: non modificarla a mano,
     le modifiche si perdono al prossimo lancio. I testi stanno in assets/js/media.js. -->
<body class="page-project" data-project="$($p.slug)" data-base="../">

<div class="cursor" id="cursor"></div>
<div class="cursor-ring" id="cursorRing"></div>
<div class="grain"></div>
<div class="scroll-progress" id="scrollProgress"></div>

<header class="nav" id="nav">
  <a href="../index.html" class="nav-logo">LM<span class="dot">.</span></a>
  <nav class="nav-links" id="navLinks">
    <a href="../index.html" data-cursor="link">Home</a>
    <a href="../index.html#work" data-cursor="link">Portfolio</a>
    <a href="../index.html#about" data-cursor="link">Chi sono</a>
    <a href="../index.html#services" data-cursor="link">Servizi</a>
    <a href="../index.html#contact" data-cursor="link">Contatti</a>
  </nav>
  <div class="nav-actions">
    <button class="theme-toggle" id="themeToggle" aria-label="Cambia tema">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.4M12 19.6V22M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2 12h2.4M19.6 12H22M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7"/></svg>
    </button>
    <button class="burger" id="burger" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>

<div class="mobile-menu" id="mobileMenu">
  <a href="../index.html">Home</a>
  <a href="../index.html#work">Portfolio</a>
  <a href="../index.html#about">Chi sono</a>
  <a href="../index.html#services">Servizi</a>
  <a href="../index.html#contact">Contatti</a>
</div>

<main>
  <header class="pj-hero">
    <img class="pj-cover" src="$coverUrl" alt="" fetchpriority="high" decoding="async">
    <div class="pj-scrim" aria-hidden="true"></div>
    <div class="container pj-intro">
      <a class="pj-back" href="../index.html#work" data-cursor="link">← Tutti i lavori</a>
      <p class="section-eyebrow">— $(Html-Escape $p.label)</p>
      <h1 class="pj-title">$titleE</h1>
      <p class="pj-meta">$(Html-Escape $meta)</p>
      <p class="pj-desc">$descE</p>
    </div>
  </header>

  <section class="pj-work">
    <div class="container">
      <div class="gallery" id="gallery">
        <!-- riquadri generati da main.js a partire da assets/js/media.js -->
      </div>
    </div>
  </section>

  <nav class="container pj-jump" aria-label="Altri progetti">
    <a class="prev" href="$($prev.slug).html" data-cursor="link">
      <span class="dir">← Precedente</span>
      <span class="name">$(Html-Escape $prev.title)</span>
    </a>
    <a class="next" href="$($next.slug).html" data-cursor="link">
      <span class="dir">Successivo →</span>
      <span class="name">$(Html-Escape $next.title)</span>
    </a>
  </nav>

  <section class="pj-cta">
    <div class="container">
      <h2 class="section-title">Ti serve un servizio così?</h2>
      <p>Raccontami che evento hai in mente e quando: ti rispondo con una proposta.</p>
      <a class="btn btn-primary" href="../index.html#contact" data-cursor="link">Scrivimi<i>→</i></a>
    </div>
  </section>
</main>

<footer class="footer">
  <div class="container footer-grid">
    <div>
      <a href="../index.html" class="nav-logo">LM<span class="dot">.</span></a>
      <p>Fotografia &amp; Video — Romagna</p>
    </div>
    <div class="footer-links">
      <a href="../index.html#work">Portfolio</a>
      <a href="../index.html#about">Chi sono</a>
      <a href="../index.html#services">Servizi</a>
      <a href="../index.html#contact">Contatti</a>
    </div>
    <div class="footer-note">
      <span id="year"></span> © Luca Montanari. Tutti i diritti riservati.
    </div>
  </div>
</footer>

<div class="lightbox" id="lightbox">
  <button class="lb-close" id="lbClose" aria-label="Chiudi">✕</button>
  <button class="lb-nav lb-prev" id="lbPrev" aria-label="Precedente">‹</button>
  <button class="lb-nav lb-next" id="lbNext" aria-label="Successivo">›</button>
  <div class="lb-content" id="lbContent"></div>
  <div class="lb-caption" id="lbCaption"></div>
</div>

<script src="../assets/js/media.js"></script>
<script src="../assets/js/main.js"></script>
</body>
</html>
"@

  $dest = Join-Path $pagineDir "$($p.slug).html"
  [System.IO.File]::WriteAllText($dest, $html, (New-Object System.Text.UTF8Encoding($false)))
  Write-Host ("pagina progetti/{0}.html  ({1})" -f $p.slug, $meta)
}

# ---------- video ----------
if ($Video) {
  if (-not $FfmpegDir) {
    $found = Get-ChildItem -Path "$env:LOCALAPPDATA\Microsoft\WinGet\Packages" -Filter 'ffmpeg.exe' -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($found) { $FfmpegDir = $found.DirectoryName }
    elseif (Get-Command ffmpeg -ErrorAction SilentlyContinue) { $FfmpegDir = Split-Path (Get-Command ffmpeg).Source }
    else { throw 'ffmpeg non trovato: installalo con "winget install --id Gyan.FFmpeg -e" oppure passa -FfmpegDir' }
  }
  New-Item -ItemType Directory -Force -Path $videoD | Out-Null

  $sources = Get-ChildItem -LiteralPath (Join-Path $root 'media') -Filter '*.mp4' -Recurse |
             Where-Object { $_.Name -notlike '._*' -and $_.FullName -notlike "$videoD*" }

  foreach ($v in $sources) {
    # slug dal nome file: minuscolo, senza accenti ne caratteri strani
    $base = [System.IO.Path]::GetFileNameWithoutExtension($v.Name).ToLower().Normalize([Text.NormalizationForm]::FormD)
    $base = -join ($base.ToCharArray() | Where-Object {
      [Globalization.CharUnicodeInfo]::GetUnicodeCategory($_) -ne [Globalization.UnicodeCategory]::NonSpacingMark
    })
    $slug = ($base -replace '[^a-z0-9]+', '-').Trim('-')
    $mp4  = Join-Path $videoD "$slug.mp4"
    $jpg  = Join-Path $videoD "$slug.jpg"
    Write-Host "=== $slug ==="

    & "$FfmpegDir\ffmpeg.exe" -y -v error -stats -i $v.FullName `
      -vf "scale=1080:-2:flags=lanczos,fps=30" `
      -c:v libx264 -preset slow -crf 24 -profile:v high -level 4.1 -pix_fmt yuv420p `
      -c:a aac -b:a 128k -ac 2 -movflags +faststart $mp4
    if ($LASTEXITCODE -ne 0) { throw "encode fallito: $($v.Name)" }

    $d = [double](& "$FfmpegDir\ffprobe.exe" -v error -show_entries format=duration -of csv=p=0 $mp4)
    & "$FfmpegDir\ffmpeg.exe" -y -v error -ss ([math]::Round($d * 0.35, 2)) -i $mp4 -frames:v 1 -vf 'scale=640:-2' -q:v 7 $jpg
    if ($LASTEXITCODE -ne 0) { throw "poster fallito: $slug" }

    Write-Host ("OK {0} -> {1} MB" -f $slug, [math]::Round((Get-Item $mp4).Length / 1MB, 1))
    Write-Host "   aggiungi a mano in media.js:  { p: `"<progetto>`", f: `"$slug.mp4`", title: `"...`", vertical: true }"
  }
}

Write-Host 'Fatto.'
