# Verifica della ricostruzione

## Esito

- Installazione pulita `npm ci`: riuscita.
- `npm test`: 8 test superati.
- `npm run typecheck`: superato per i contratti TypeScript. Il JavaScript recuperato non è verificato staticamente (`checkJs: false`).
- `npm run build`: riuscita.
- Browser Chromium, viewport 390 × 844: quattro sezioni, dettagli task/progetto/nota, cinque periodi ore, selezione membro e importazione XLSX controllati.
- Nessun errore JavaScript durante la prova sul browser.
- Nessuno scorrimento orizzontale nelle quattro sezioni.

## Confronto visivo

Originale e ricostruzione sono stati caricati con la stessa data simulata: 2 ottobre 2026, ore 19:00 Europe/Rome. Gli screenshot di Oggi, Progetti, Note e Ore sono identici pixel per pixel, nella dimensione controllata. Le immagini della ricostruzione sono incluse in `verifica/`.

Questo confronto riguarda gli stati iniziali delle quattro schermate. Non implica la verifica di ogni combinazione possibile di dati o dimensioni del dispositivo.

## Dati

I test confrontano dataset, stati task, date e riepiloghi ore con il codice del bundle originale. L'importazione è stata provata con un workbook sintetico che riproduce le schede previste, sia nel test automatico sia nel browser.

Non sono stati verificati il Google Fogli reale, un iPhone fisico, autenticazione o sincronizzazione live. Queste ultime due funzioni non sono presenti nell'app originale e non sono state aggiunte.

## Identità della versione di partenza

Archivio fornito: `ARCHEA_WORKSPACE-main (1).zip`.
Commit indicato nello ZIP: `8c35836bf98f78e5681431ca909df4cb58142c65`.
Bundle originale conservato in `tests/fixtures/original-bundle.js`, usato soltanto per i test.

## Correzione 0.2.1

13 test superati: gli 8 precedenti e 5 nuovi controlli sull'importazione progetti.

Browser Chromium 390 × 844, stesso workbook sintetico con intervalli non inizializzati in A1 e stati in M: versione originale 0 progetti attivi; versione 0.2.1 5 progetti attivi. Il selettore Note mantiene i progetti attivi in cima. Nessun errore JavaScript.

L'Excel reale dell'utente non è stato fornito: la prova riproduce i difetti identificati nel codice.
