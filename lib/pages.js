import client from '@/lib/directus';
import {readItems} from '@directus/sdk';
import {findTrail} from '@/lib/navigation';

// Recupera tutto cio' che serve per mostrare una pagina: i dati della pagina, il
// menu e il percorso per il breadcrumb. Viene usata da tutte le rotte
// (home, [slug], category/[slug]), che cambiano solo il permalink.
export async function getPageByPermalink(permalink) {
    // Le due richieste non dipendono l'una dall'altra, quindi partono insieme con
    // Promise.all invece di aspettare una dopo l'altra. Il risultato e' un array
    // nello stesso ordine delle richieste, che si separa con la destrutturazione.
    const [pages, navigationData] = await Promise.all([
        client.request(readItems('pages', {
            // Solo la pagina con questo permalink
            filter: {permalink: {_eq: permalink}},
            // "*" = tutti i campi della pagina. "blocks.*" = i blocchi (quale
            // tipo e' e a quale contenuto puntano). "blocks.item.*.*.*" =
            // il contenuto di ogni blocco, espanso su 3 livelli (altrimenti
            // relazioni come l'immagine arriverebbero come semplici id).
            fields: ["*", "blocks.*", "blocks.item.*.*.*"],
        })),
        // Tutti i menu, espansi su 5 livelli per raggiungere le voci annidate
        getNavigation(),
    ]);

    // readItems restituisce sempre un array: il primo elemento e' la pagina.
    // Se nessuna pagina ha questo permalink l'array e' vuoto e page diventa null.
    const page = pages[0] ?? null;
    // Pagina non trovata: la rotta controlla page === null e mostra il 404.
    // Si restituisce comunque il menu, cosi' il 404 puo' avere header e footer.
    if (!page) return {page: null, navigationData, trail: []};

    // Il breadcrumb si basa sul menu principale, identificato dal titolo
    const mainNav = navigationData.find((nav) => nav.title === 'Main Navigation');
    const trail =
        // Cerca la catena di voci che porta a questa pagina (o null)
        findTrail(mainNav?.items, permalink)?.map((item) => ({
            title: item.title,
            // Solo le voci di tipo "page" hanno un link. I gruppi (titoli di menu a
            // tendina) non hanno una destinazione, quindi href e' null e il
            // Breadcrumb le mostra come semplice testo.
            href: item.type === 'page' ? item.page?.permalink : null,
        })) ?? [{title: page.title}];
    // Fallback: se la pagina non e' nel menu (findTrail ha dato null) il
    // breadcrumb contiene solo il titolo della pagina. Attenzione: "??"
    // scatta solo con null/undefined, non con un array vuoto.

    return {page, navigationData, trail};
}

// Recupera titolo e descrizione per i metadati della pagina (<title> e meta
// description). Viene chiamata dalla funzione generateMetadata delle rotte.
export async function getPageMetadata(permalink) {
    const seoData = await client.request(
        // Si chiedono solo "title" e "seo": la risposta resta piccola
        readItems('pages', {filter: {permalink: {_eq: permalink}}, fields: ["title", "seo"]})
    );

    // ?.[0] = primo risultato, senza errori se seoData fosse undefined
    const page = seoData?.[0];
    // Nessuna pagina con questo permalink: valori generici
    if (!page)
        return {title: 'Default Title', description: 'Default Description'};

    return {
        // "||" prende il primo valore non vuoto: titolo SEO, poi titolo della
        // pagina, poi il testo generico. "?." evita l'errore quando il campo
        // seo e' null (pagina senza dati SEO). Con "||" anche una stringa vuota
        // viene saltata.
        title: page.seo?.title || page.title || 'Default Title',
        description: page.seo?.description || 'Default Description',
    };
}

// Recupera tutti i menu di navigazione (per header e footer). Serve alle rotte
// che non passano da getPageByPermalink, come la pagina di un singolo post.
export async function getNavigation() {
    return client.request(readItems('navigation', {fields: ["*.*.*.*.*"]}));
}

// Recupera un singolo post pubblicato tramite il suo slug (il campo "slug" della
// collezione "posts", non il permalink di una pagina). Restituisce null se non
// esiste.
export async function getPostBySlug(slug) {
    const posts = await client.request(
        readItems('posts', {
            // Piu' condizioni nello stesso oggetto valgono tutte insieme (AND).
            // Il filtro su published_at e' lo stesso del blocco dei post: una bozza
            // non si deve poter aprire scrivendo l'indirizzo.
            filter: {
                slug: {_eq: slug},
                published_at: {_nnull: true},
            },
            limit: 1,
            fields: [
                'id', 'title', 'slug', 'description', 'content', 'published_at',
                {author: ['first_name', 'last_name']},
                'image.id', 'image.title',
                // Le chiavi (maiuscole comprese) devono coincidere con quelle della
                // collezione "categories" in Directus
                'category.Name', 'category.slug', 'background_color', 'text_color'
            ],
        })
    );
    // readItems restituisce sempre un array: il primo elemento e' il post
    return posts?.[0] ?? null;
}