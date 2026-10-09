import {createDirectus, rest, staticToken} from '@directus/sdk';

// Client condiviso per parlare con Directus. Si crea una volta sola e tutti i
// file lo importano (import client from '@/lib/directus'), quindi usano la
// stessa istanza.
const client = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL)
    // Token statico: ogni richiesta lo invia, quindi Directus ci tratta come
    // l'utente a cui appartiene il token e applica i suoi permessi.
    // Il prefisso NEXT_PUBLIC_ lo rende visibile anche nel browser, perche' alcuni
    // componenti client (come Posts) fanno richieste direttamente dal browser.
    // Va bene per sviluppo locale, ma in produzione il token sarebbe leggibile da
    // chiunque: serve un token di sola lettura o spostare le richieste sul server.
    .with(staticToken(process.env.NEXT_PUBLIC_DIRECTUS_TOKEN))
    // Abilita le richieste REST (readItems, ecc.)
    .with(rest())

export default client;