# ARCHEA WORKSPACE 0.2.3 — icone ARCHEA bianche su fondo nero

## Aggiornamento

1. Estrai lo ZIP sul computer.
2. Apri la stessa repository GitHub, scegli Add file → Upload files, seleziona tutti i file e le sottocartelle dentro la cartella estratta e trascinali nell'area di caricamento. `index.html` deve essere direttamente nella radice della repository. Conferma con Commit changes.
3. Mantieni GitHub Pages configurato per pubblicare la radice della repository. L'app è già compilata.
4. Dopo la pubblicazione, ricarica l'app in Safari e verifica `v0.2.3` in fondo. Importa una volta il tuo Excel aggiornato.
5. In alto, sotto l'intestazione, verifica Il tuo Excel, il nome del file e i numeri di progetti e progetti attivi. Il badge deve diventare EXCEL STATICO.

Favicon e icone iPhone sono aggiornate con ARCHEA bianca su fondo nero. I nomi delle icone sono stati aggiornati per evitare di riutilizzare i vecchi file dalla cache. Se l’icona della schermata Home resta quella precedente, aggiungi nuovamente il sito dalla funzione Aggiungi alla schermata Home di Safari.

La copia dell'ultimo Excel ora viene ripristinata alla riapertura nello stesso browser. Per aggiornare i dati importa un nuovo Excel: questo sostituisce i dati precedenti. Il pulsante Rimuovi dati e torna alla demo cancella la copia locale. Se cambi browser, dispositivo o cancelli i dati del sito, serve una nuova importazione. Se il browser non permette il salvataggio, viene mostrata una segnalazione in Persona e dati.

## Verifiche

17 test automatici superati. Provata sul browser l'importazione del file reale fornito, il ripristino dopo un ricaricamento e in una nuova scheda, la sostituzione con un nuovo import e il ritorno alla demo. Nessun errore JavaScript e nessun overflow a 390 × 844. Nessuna prova su un iPhone fisico.

## Sorgenti e dati

La cartella sorgenti contiene il progetto modificabile. Per sviluppare entra in sorgenti, esegui npm ci e npm run dev.

Il pacchetto non contiene il tuo Excel né i suoi dati. L'app salva soltanto il dataset elaborato nel browser dell'utente, senza inviarlo online. La demo contiene dati fittizi. L'importazione resta statica: non è una connessione live a Google Fogli.
