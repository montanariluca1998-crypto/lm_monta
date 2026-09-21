# Portfolio Luca Montanari — Foto & Video

Sito statico (HTML/CSS/JS puro, nessuna build necessaria).

## Come vederlo
Serve un piccolo server locale, perché il browser blocca alcune risorse se apri il file
con doppio click. Esempi: estensione "Live Server" di VS Code, oppure da PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File tools\serve.ps1
```

poi apri http://localhost:8099.

## Struttura
- `index.html` — struttura e contenuti della pagina
- `assets/css/style.css` — stile, tema chiaro/scuro, animazioni
- `assets/js/main.js` — interazioni: cursore, portfolio a due livelli, lightbox, hero, form
- `assets/js/media.js` — **elenco dei lavori mostrati in galleria** (progetti, foto, video)
- `assets/media/` — versioni web di foto e video, generate da `/media` (~111 MB)
  - `thumbs/<progetto>/` — lato max 900px, per i riquadri della griglia
  - `full/<progetto>/` — lato max 2000px, per il lightbox
  - `hero/` — i 4 scatti di sfondo della prima schermata
  - `video/` — mp4 1080p + poster `.jpg`
- `progetti/<slug>.html` — **una pagina per lavoro, generate dallo script** (non modificarle a mano)
- `media/` — **archivio originali** (~2 GB): non viene mai pubblicato né letto dal sito
- `tools/build-media.ps1` — rigenera `assets/media/` e le pagine in `progetti/`

## Come aggiungere nuovi lavori

1. Metti le foto in `media/foto/<Nome Progetto>/<sottocartella>/` e i video in una
   qualunque sottocartella di `media/`.
2. Se il progetto è nuovo, aprilo in `tools/build-media.ps1` e aggiungilo alla lista
   `$projects` (slug + cartelle sorgente).
3. Lancia lo script:
   ```powershell
   powershell -ExecutionPolicy Bypass -File tools\build-media.ps1          # solo foto
   powershell -ExecutionPolicy Bypass -File tools\build-media.ps1 -Video   # foto + video
   ```
   Genera le versioni ottimizzate e riscrive da solo il blocco `photos: [...]` in `media.js`.
   Gli originali in `/media` non vengono toccati.
4. In `assets/js/media.js` aggiungi il progetto nuovo dentro `projects`. I video vanno
   elencati a mano in `videos` — lo script stampa la riga già pronta da incollare.

Lo script rigenera anche le pagine in `progetti/`, quindi dopo averlo lanciato il sito è già
allineato.

Per i video serve ffmpeg: `winget install --id Gyan.FFmpeg -e`.

> **Se modifichi `tools/build-media.ps1`, salvalo in UTF-8 *con BOM*.** Windows PowerShell 5.1
> legge gli script senza BOM come ANSI: accenti, trattini lunghi e frecce finiscono storti nelle
> pagine generate (`cosÃ¬` invece di `così`). Ci sono già cascato.

### Come è fatto il portfolio
Due livelli, con **pagine vere**: la home mostra una **scheda per progetto**, e ogni scheda è un
link a `progetti/<slug>.html`. Quella pagina ha una copertina a tutta larghezza, i dati del
lavoro, tutte le foto e il lightbox, più i salti al progetto precedente e successivo.

Il vantaggio pratico: ogni lavoro ha un indirizzo suo, quindi puoi mandare a un cliente il link
del singolo servizio, il tasto "indietro" del browser funziona, e Google indicizza i progetti uno
per uno. Le frecce del lightbox restano dentro il progetto, non saltano agli altri.

**Le pagine in `progetti/` sono generate**: le riscrive `tools/build-media.ps1` leggendo i dati da
`media.js`. Non modificarle a mano — le modifiche si perdono al lancio successivo. Per cambiare
un titolo o una descrizione, tocca `media.js` e rilancia lo script.

Ogni progetto in `media.js` ha questi campi:

| campo | a cosa serve |
|---|---|
| `title` | titolo della scheda e dell'album |
| `label` | etichetta breve (Sport, Eventi, Cultura, Video) |
| `cat` | categoria interna; per i video deve essere `video` |
| `luogo`, `data` | riga di contesto sotto al titolo — le date vengono dall'EXIF degli originali |
| `committente` | opzionale: se lo compili compare nella stessa riga |
| `cover` | il file (in `thumbs/<slug>/`) usato come copertina della scheda |
| `desc` | una o due righe che si leggono quando l'album è aperto |

**L'ordine dei progetti in `media.js` è l'ordine in pagina**: il primo occupa la scheda grande,
quindi mettici il lavoro che vuoi far vedere per primo. Il conteggio di foto e video è calcolato
da solo, non va aggiornato a mano.

### Le foto della prima schermata
Dietro al titolo ruotano 4 scatti (`assets/media/hero/hero-1..4.jpg`, cambio ogni 6,5 secondi).
Per cambiarli modifica l'array `$heroPicks` in cima a `tools/build-media.ps1` e rilancia lo script:
sono percorsi `<slug-progetto>\<file>` presi da `assets/media/full/`. L'ordine dell'array è
l'ordine in cui compaiono, quindi metti per prima la foto più forte — è quella che si vede
all'apertura ed è precaricata nell'`<head>` di `index.html`.

Scegli scatti che reggano il testo bianco al centro: quelli scuri o con poco contrasto nella zona
centrale funzionano meglio. Sopra le foto c'è un velo scuro (`.hero-scrim` in `style.css`):
se una foto risulta poco leggibile, alza il primo valore del `radial-gradient`.

### Il form contatti
Oggi funziona **senza servizi esterni**: alla conferma apre il programma di posta del visitatore
con destinatario, oggetto e messaggio già compilati; a lui resta solo da premere invia. Non
promette niente che non succeda davvero.

Se preferisci ricevere i messaggi direttamente, senza passare dal client di posta:

1. crea un form gratuito su [formspree.io](https://formspree.io) (fino a 50 messaggi al mese);
2. copia l'URL che ti danno, tipo `https://formspree.io/f/abcdwxyz`;
3. incollalo in `FORM_ENDPOINT` in cima alla sezione "contact form" di `assets/js/main.js`.

Da quel momento l'invio avviene in background. Se fallisce, il sito lo dice apertamente e mostra
l'indirizzo email, **senza cancellare quello che il visitatore aveva scritto**. L'indirizzo di
destinazione è in `CONTACT_EMAIL`, nella riga sotto.

### I social
Il blocco `.socials` in `index.html` contiene un link per profilo. Ora c'è solo Instagram
([@lm_monta](https://www.instagram.com/lm_monta/)). Per aggiungerne altri copia la riga e cambia
`href` e testo; per toglierli tutti elimina il blocco. Niente link a `#`: un link che non porta
da nessuna parte è peggio che non averlo.

## Cosa resta da personalizzare
- **Foto profilo**: `.about-photo` in `index.html` usa per ora uno scatto del progetto
  Museo Effimero — sostituiscilo con una tua foto.
- **Committenti**: il campo `committente` dei progetti in `media.js` è vuoto. Se compili chi
  ha commissionato ogni lavoro, compare nella riga sotto al titolo — è l'informazione che manca
  di più a chi guarda il portfolio.
- **Testi**: la bio in "Chi sono" e le descrizioni dei progetti le ho scritte io partendo da
  quello che si vede nelle foto e dalle date EXIF. Rileggile e rendile tue.
- **Invio vero del form** (opzionale): vedi "Il form contatti" qui sopra.
- **Colori**: variabili CSS in cima a `style.css` (`--accent`, `--bg`, ecc.).

## Funzionalità incluse
Preloader animato, cursore personalizzato, prima schermata con scatti reali a rotazione (velati
da gradiente e particelle canvas), menu che si nasconde allo scroll, tema chiaro/scuro con
salvataggio della preferenza, portfolio su pagine separate (una per progetto, con salto al
precedente e successivo), lightbox con foto ad alta risoluzione e video, navigazione da tastiera
e swipe, form contatti funzionante, layout completamente responsive.
