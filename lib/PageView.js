import {notFound} from 'next/navigation';
import {getPageByPermalink} from '@/lib/pages';
import PageShell from '@/lib/PageShell';

// Componente server che si occupa di tutto il lavoro comune alle rotte:
// carica la pagina da Directus, mostra il 404 se non esiste e, altrimenti, la
// disegna con PageShell. Le rotte devono solo dire quale permalink vogliono.
//
// permalink:          il permalink da cercare in Directus (es. "/", "/contatti",
//                     "/category/news")
// useTitleAsCategory: true solo per le pagine di categoria. In quel caso il
//                     titolo della pagina viene passato come nome della categoria,
//                     e il blocco dei post mostra solo i post di quella categoria.
//                     Il titolo deve coincidere con il nome della categoria
//                     (maiuscole e accenti compresi).
export default async function PageView({permalink, useTitleAsCategory = false}) {
    // Pagina, menu e percorso del breadcrumb in un'unica chiamata
    const {page, navigationData, trail} = await getPageByPermalink(permalink);

    // Nessuna pagina con questo permalink: mostra il 404 di Next.js.
    // notFound() interrompe il rendering, quindi non serve "return".
    if (!page) notFound();

    return (
        <PageShell
            page={page}
            navigationData={navigationData}
            trail={trail}
            // undefined = nessuna categoria: la prop viene ignorata e i post non
            // vengono filtrati
            categoryName={useTitleAsCategory ? page.title : undefined}
        />
    );
}