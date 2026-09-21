/* ==========================================================================
   Luca Montanari — manifesto media (generato da /media)
   Percorsi relativi a assets/media/ — thumbs/ per la griglia, full/ per il lightbox.
   Per aggiungere lavori: rigenera le immagini ottimizzate e aggiungi le voci qui.
   ========================================================================== */
window.LM_MEDIA = {

  /* ---------- progetti ----------
     L'ordine di questa lista e l'ordine delle schede in pagina: metti per primo il lavoro
     che vuoi far vedere per primo. Le date vengono dall'EXIF degli scatti originali.
     `committente` e opzionale: se lo compili compare nella riga sotto al titolo.
     `cover` e il file (dentro thumbs/<slug>/) usato come copertina della scheda. */
  projects: {
    "modigliana-city-run": {
      title: "Modigliana City Run",
      cat: "sport",
      label: "Sport",
      luogo: "Modigliana",
      data: "15 maggio 2026",
      committente: "",
      cover: "modigliana-city-run-25.jpg",
      desc: "Una corsa podistica per le vie del paese, seguita dalla partenza all'arrivo: la gara e la festa che le sta intorno."
    },
    "museo-effimero": {
      title: "Museo Diffuso Granarolo — Effimero",
      cat: "cultura",
      label: "Cultura",
      luogo: "Granarolo",
      data: "5 giugno 2026",
      committente: "",
      cover: "museo-effimero-24.jpg",
      desc: "Una serata di teatro diffuso fra le case: le scene, gli interpreti e il pubblico che si sposta da un cortile all'altro."
    },
    "faenza-crescione": {
      title: "FaenzaCrescione",
      cat: "evento",
      label: "Eventi",
      luogo: "Faenza",
      data: "9 aprile 2026",
      committente: "",
      cover: "faenza-crescione-05.jpg",
      desc: "Evento pubblico in piazza: l'allestimento, i banchi, le persone ai tavoli."
    },
    "calcio-oratorio": {
      title: "Calcio Oratorio",
      cat: "sport",
      label: "Sport",
      luogo: "",
      data: "aprile 2026",
      committente: "",
      cover: "calcio-oratorio-05.jpg",
      desc: "Partite serali sotto i riflettori, con la nebbia sul campo: l'azione e i momenti fra un tempo e l'altro."
    },
    "marco-bianchedi": {
      title: "Marco Bianchedi — Lista civica",
      cat: "video",
      label: "Video",
      luogo: "Faenza",
      data: "2026",
      committente: "",
      cover: "perche-scegliere-la-lista-civica.jpg",
      desc: "Video verticali per la comunicazione social della campagna: ripresa, montaggio e testi a schermo."
    },
    "giogiocaffe": {
      title: "Giogiocaffè — bar",
      cat: "video",
      label: "Video",
      luogo: "Cotignola",
      data: "giugno 2026",
      committente: "",
      cover: "i-nostri-spritz.jpg",
      desc: "Contenuti verticali per i social del bar: il barista al bancone che prepara i drink e racconta cosa c'è sullo scaffale."
    }
  },

  /* ---------- video (assets/media/video/) ---------- */
  videos: [
    { p: "marco-bianchedi", f: "perche-scegliere-la-lista-civica.mp4", title: "Perché scegliere la lista civica", vertical: true },
    { p: "marco-bianchedi", f: "come-funziona-il-voto.mp4",            title: "Come funziona il voto",            vertical: true },
    /* disponibile anche: come-funziona-il-voto-senza-testo.mp4 (stessa clip senza testi a schermo) */

    { p: "giogiocaffe",     f: "facciamo-uno-spritz.mp4", title: "Facciamo uno spritz", vertical: true },
    { p: "giogiocaffe",     f: "i-nostri-spritz.mp4",     title: "I nostri spritz",     vertical: true },
    { p: "giogiocaffe",     f: "gin-vuoti-cadaveri.mp4",  title: "Gin vuoti cadaveri",  vertical: true }
  ],

  /* ---------- foto (assets/media/thumbs|full/<progetto>/) ---------- */
  photos: [
    { p: "modigliana-city-run", f: "modigliana-city-run-01.jpg", w: 2000, h: 1333 },
    { p: "museo-effimero", f: "museo-effimero-01.jpg", w: 1333, h: 2000 },
    { p: "faenza-crescione", f: "faenza-crescione-01.jpg", w: 2000, h: 1333 },
    { p: "calcio-oratorio", f: "calcio-oratorio-01.jpg", w: 2000, h: 1333 },
    { p: "modigliana-city-run", f: "modigliana-city-run-02.jpg", w: 2000, h: 1333 },
    { p: "museo-effimero", f: "museo-effimero-02.jpg", w: 1333, h: 2000 },
    { p: "faenza-crescione", f: "faenza-crescione-02.jpg", w: 2000, h: 2000 },
    { p: "calcio-oratorio", f: "calcio-oratorio-02.jpg", w: 2000, h: 1333 },
    { p: "modigliana-city-run", f: "modigliana-city-run-03.jpg", w: 2000, h: 1333 },
    { p: "museo-effimero", f: "museo-effimero-03.jpg", w: 2000, h: 1333 },
    { p: "faenza-crescione", f: "faenza-crescione-03.jpg", w: 2000, h: 1333 },
    { p: "calcio-oratorio", f: "calcio-oratorio-03.jpg", w: 2000, h: 2000 },
    { p: "modigliana-city-run", f: "modigliana-city-run-04.jpg", w: 2000, h: 1333 },
    { p: "museo-effimero", f: "museo-effimero-04.jpg", w: 2000, h: 1333 },
    { p: "faenza-crescione", f: "faenza-crescione-04.jpg", w: 2000, h: 1333 },
    { p: "calcio-oratorio", f: "calcio-oratorio-04.jpg", w: 2000, h: 1333 },
    { p: "modigliana-city-run", f: "modigliana-city-run-05.jpg", w: 2000, h: 1333 },
    { p: "museo-effimero", f: "museo-effimero-05.jpg", w: 2000, h: 1333 },
    { p: "faenza-crescione", f: "faenza-crescione-05.jpg", w: 2000, h: 1333 },
    { p: "calcio-oratorio", f: "calcio-oratorio-05.jpg", w: 2000, h: 2000 },
    { p: "modigliana-city-run", f: "modigliana-city-run-06.jpg", w: 2000, h: 1333 },
    { p: "museo-effimero", f: "museo-effimero-06.jpg", w: 2000, h: 1333 },
    { p: "faenza-crescione", f: "faenza-crescione-06.jpg", w: 2000, h: 1333 },
    { p: "calcio-oratorio", f: "calcio-oratorio-06.jpg", w: 2000, h: 1333 },
    { p: "modigliana-city-run", f: "modigliana-city-run-07.jpg", w: 2000, h: 1333 },
    { p: "museo-effimero", f: "museo-effimero-07.jpg", w: 2000, h: 1333 },
    { p: "faenza-crescione", f: "faenza-crescione-07.jpg", w: 2000, h: 1333 },
    { p: "calcio-oratorio", f: "calcio-oratorio-07.jpg", w: 2000, h: 1333 },
    { p: "modigliana-city-run", f: "modigliana-city-run-08.jpg", w: 2000, h: 1333 },
    { p: "museo-effimero", f: "museo-effimero-08.jpg", w: 1333, h: 2000 },
    { p: "faenza-crescione", f: "faenza-crescione-08.jpg", w: 2000, h: 2000 },
    { p: "calcio-oratorio", f: "calcio-oratorio-08.jpg", w: 2000, h: 1333 },
    { p: "modigliana-city-run", f: "modigliana-city-run-09.jpg", w: 2000, h: 1333 },
    { p: "museo-effimero", f: "museo-effimero-09.jpg", w: 2000, h: 1333 },
    { p: "faenza-crescione", f: "faenza-crescione-09.jpg", w: 2000, h: 2000 },
    { p: "calcio-oratorio", f: "calcio-oratorio-09.jpg", w: 2000, h: 1333 },
    { p: "modigliana-city-run", f: "modigliana-city-run-10.jpg", w: 2000, h: 1333 },
    { p: "museo-effimero", f: "museo-effimero-10.jpg", w: 2000, h: 1333 },
    { p: "faenza-crescione", f: "faenza-crescione-10.jpg", w: 2000, h: 1333 },
    { p: "calcio-oratorio", f: "calcio-oratorio-10.jpg", w: 2000, h: 1333 },
    { p: "modigliana-city-run", f: "modigliana-city-run-11.jpg", w: 2000, h: 1333 },
    { p: "museo-effimero", f: "museo-effimero-11.jpg", w: 2000, h: 1333 },
    { p: "calcio-oratorio", f: "calcio-oratorio-11.jpg", w: 2000, h: 1333 },
    { p: "modigliana-city-run", f: "modigliana-city-run-12.jpg", w: 2000, h: 1333 },
    { p: "museo-effimero", f: "museo-effimero-12.jpg", w: 2000, h: 1333 },
    { p: "calcio-oratorio", f: "calcio-oratorio-12.jpg", w: 2000, h: 2000 },
    { p: "modigliana-city-run", f: "modigliana-city-run-13.jpg", w: 2000, h: 1333 },
    { p: "museo-effimero", f: "museo-effimero-13.jpg", w: 2000, h: 1333 },
    { p: "calcio-oratorio", f: "calcio-oratorio-13.jpg", w: 2000, h: 1333 },
    { p: "modigliana-city-run", f: "modigliana-city-run-14.jpg", w: 2000, h: 1333 },
    { p: "museo-effimero", f: "museo-effimero-14.jpg", w: 2000, h: 1333 },
    { p: "calcio-oratorio", f: "calcio-oratorio-14.jpg", w: 2000, h: 1333 },
    { p: "modigliana-city-run", f: "modigliana-city-run-15.jpg", w: 2000, h: 1333 },
    { p: "museo-effimero", f: "museo-effimero-15.jpg", w: 2000, h: 1333 },
    { p: "modigliana-city-run", f: "modigliana-city-run-16.jpg", w: 2000, h: 1333 },
    { p: "museo-effimero", f: "museo-effimero-16.jpg", w: 2000, h: 1333 },
    { p: "modigliana-city-run", f: "modigliana-city-run-17.jpg", w: 1333, h: 2000 },
    { p: "museo-effimero", f: "museo-effimero-17.jpg", w: 2000, h: 1333 },
    { p: "modigliana-city-run", f: "modigliana-city-run-18.jpg", w: 2000, h: 1333 },
    { p: "museo-effimero", f: "museo-effimero-18.jpg", w: 1333, h: 2000 },
    { p: "modigliana-city-run", f: "modigliana-city-run-19.jpg", w: 2000, h: 1333 },
    { p: "museo-effimero", f: "museo-effimero-19.jpg", w: 2000, h: 1333 },
    { p: "modigliana-city-run", f: "modigliana-city-run-20.jpg", w: 2000, h: 1333 },
    { p: "museo-effimero", f: "museo-effimero-20.jpg", w: 2000, h: 1333 },
    { p: "modigliana-city-run", f: "modigliana-city-run-21.jpg", w: 2000, h: 1333 },
    { p: "museo-effimero", f: "museo-effimero-21.jpg", w: 2000, h: 1333 },
    { p: "modigliana-city-run", f: "modigliana-city-run-22.jpg", w: 2000, h: 1333 },
    { p: "museo-effimero", f: "museo-effimero-22.jpg", w: 1333, h: 2000 },
    { p: "modigliana-city-run", f: "modigliana-city-run-23.jpg", w: 2000, h: 1333 },
    { p: "museo-effimero", f: "museo-effimero-23.jpg", w: 2000, h: 1333 },
    { p: "modigliana-city-run", f: "modigliana-city-run-24.jpg", w: 2000, h: 1333 },
    { p: "museo-effimero", f: "museo-effimero-24.jpg", w: 1333, h: 2000 },
    { p: "modigliana-city-run", f: "modigliana-city-run-25.jpg", w: 2000, h: 1125 },
    { p: "museo-effimero", f: "museo-effimero-25.jpg", w: 1333, h: 2000 },
    { p: "modigliana-city-run", f: "modigliana-city-run-26.jpg", w: 2000, h: 1333 },
    { p: "museo-effimero", f: "museo-effimero-26.jpg", w: 2000, h: 1333 },
    { p: "modigliana-city-run", f: "modigliana-city-run-27.jpg", w: 2000, h: 1333 },
    { p: "museo-effimero", f: "museo-effimero-27.jpg", w: 2000, h: 1333 },
    { p: "modigliana-city-run", f: "modigliana-city-run-28.jpg", w: 2000, h: 1333 },
    { p: "museo-effimero", f: "museo-effimero-28.jpg", w: 2000, h: 1333 },
    { p: "museo-effimero", f: "museo-effimero-29.jpg", w: 1333, h: 2000 }
  ]
};
