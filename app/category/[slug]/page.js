import {getPageMetadata} from '@/lib/pages';
import PageView from '@/lib/PageView';

// Rotta per le pagine di categoria: /category/news, /category/altro, ...
// La cartella "category" e' un segmento fisso dell'URL, [slug] e' la parte
// variabile. Ogni categoria ha bisogno di una pagina in Directus con permalink
// "/category/<slug>".

// Metadati: stessa logica della rotta [slug], con il prefisso /category/
export async function generateMetadata({params}) {
    const {slug} = await params;
    return getPageMetadata(`/category/${slug}`);
}

export default async function Page({params}) {
    const {slug} = await params;
    // useTitleAsCategory attiva il filtro dei post per categoria
    return <PageView permalink={`/category/${slug}`} useTitleAsCategory/>;
}