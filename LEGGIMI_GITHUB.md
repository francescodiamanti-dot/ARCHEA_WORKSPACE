# ARCHEA WORKSPACE 0.2.1 — correzione importazione Excel

## Caricamento su GitHub

1. Estrai lo ZIP sul computer.
2. Carica il contenuto estratto nella radice della stessa repository: `index.html`, cartelle `assets/` e `icons/`, `manifest.webmanifest` e gli altri file. Sovrascrivi i file con lo stesso nome. Non caricare il solo ZIP e non racchiudere questi file in un'altra cartella.
3. Mantieni GitHub Pages configurato per pubblicare la radice della repository. L'app è già compilata; non occorre compilare i sorgenti per questo aggiornamento.
4. Dopo la pubblicazione, riapri l'indirizzo dell'app in Safari e ricarica la pagina. In fondo deve comparire `v0.2.1`. Quindi importa nuovamente l'Excel aggiornato.

Se dalla schermata Home compare ancora la vecchia versione, chiudi l'app, ricarica il sito in Safari e riaprila.

La cartella `sorgenti/` conserva il progetto modificabile. Per sviluppare: entra in questa cartella, esegui `npm ci`, poi `npm run dev`.

## Correzioni

- Le schede Excel vengono lette da A1, conservando righe e colonne vuote iniziali.
- Gli stati progetto vengono cercati in N oppure M, anche oltre la riga 57. La precedenza di N resta compatibile con la versione precedente; eventuali contraddizioni sono segnalate.
- `Insight Data` e `#InsightData` vengono riconosciuti, così come `Attivo` con spazi, maiuscole o emoji.
- Quando gli stati non sono disponibili, la schermata propone Mostra tutti i progetti e indica dove consultare le segnalazioni. Nessun progetto viene automaticamente dichiarato attivo senza uno stato riconosciuto.

13 test superati. Nel browser, lo stesso Excel di prova passa da 0 a 5 progetti attivi con la correzione. Il tuo Excel reale non è stato fornito: se il problema persiste dopo aver verificato `v0.2.1`, serve il file per verificarne il layout.

L'importazione resta statica e in memoria: dopo un ricaricamento della pagina occorre reimportare l'Excel.
