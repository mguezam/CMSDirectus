import { NextResponse } from 'next/server';
import client from '../../../lib/directus';
import { readItems } from '@directus/sdk';

// Endpoint di ricerca: risponde alle richieste GET /api/search?q=testo, usate da
// HeaderSearch. Cerca in piu' collezioni di Directus e restituisce un elenco
// uniforme di risultati { id, title, url, type }.

// Elenco delle collezioni in cui cercare. Per ognuna:
//  - collection: nome della collezione in Directus
//  - fields:     i campi da chiedere (solo quelli necessari)
//  - map:        funzione che trasforma un elemento di Directus nel formato
//                comune usato dall'interfaccia
const SEARCH_TARGETS = [
    {
        collection: 'pages',
        fields: ['id', 'title', 'permalink'],
        // Le pagine usano il permalink come URL
        map: (item) => ({
            // Il prefisso evita che una pagina e un post con lo stesso id abbiano
            // la stessa chiave nell'elenco dei risultati
            id: `page-${item.id}`,
            title: item.title ?? 'Untitled page',
            url: item.permalink ?? '/',
            type: 'Page',
        }),
    },
    {
        collection: 'posts',
        fields: ['id', 'title', 'slug'],
        map: (item) => ({
            id: `post-${item.id}`,
            title: item.title ?? 'Untitled post',
            // I post stanno sotto /posts/ (rotta app/posts/[slug]/page.js)
            url: `/posts/${item.slug}`,
            type: 'Post',
        }),
    },
    // Per cercare in altre collezioni basta aggiungere qui un elemento, ad esempio:
    // {
    //     collection: 'documents',
    //     fields: ['id', 'title', 'slug'],
    //     map: (item) => ({
    //         id: `doc-${item.id}`,
    //         title: item.title,
    //         url: `/documents/${item.slug}`,
    //         type: 'Document',
    //     }),
    // },
];

// Funzione chiamata da Next.js per le richieste GET a /api/search
export async function GET(request) {
    // Legge il parametro "q" dall'URL (la parola cercata)
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    // Ricerca troppo corta o assente: risposta vuota senza interrogare Directus
    if (!query || query.length < 3) {
        return NextResponse.json({ results: [] });
    }

    try {
        // Si interrogano tutte le collezioni insieme. allSettled (a differenza di
        // all) aspetta tutte le richieste anche se qualcuna fallisce, quindi
        // una collezione con problemi non rovina i risultati delle altre.
        const settled = await Promise.allSettled(
            SEARCH_TARGETS.map((target) =>
                client
                    .request(
                        readItems(target.collection, {
                            // "search" cerca il testo in tutti i campi di testo
                            search: query,
                            limit: 5, // massimo 5 risultati per collezione, per restare veloci
                            fields: target.fields,
                        })
                    )
                    // Converte ogni elemento nel formato comune
                    .then((items) => items.map(target.map))
            )
        );

        // Si uniscono i risultati delle richieste riuscite in un unico elenco.
        // Gli errori vengono scritti nel terminale, cosi' se ne accorge chi sviluppa
        // (tipico: permessi di lettura mancanti sulla collezione).
        const results = [];
        settled.forEach((outcome, i) => {
            if (outcome.status === 'fulfilled') {
                results.push(...outcome.value);
            } else {
                console.error(
                    `[RICERCA] Errore nella ricerca di "${SEARCH_TARGETS[i].collection}":`,
                    outcome.reason?.message ?? outcome.reason
                );
            }
        });

        return NextResponse.json({ results });
    } catch (err) {
        // Errore imprevisto: risposta 500, con results vuoto cosi' il frontend
        // non si rompe
        console.error('[RICERCA] Errore imprevisto:', err);
        return NextResponse.json(
            { error: String(err?.message ?? err), results: [] },
            { status: 500 }
        );
    }
}