import {getPageMetadata} from '@/lib/pages';
import PageView from '@/lib/PageView';

// [slug] nel nome della cartella e' una rotta dinamica: corrisponde a qualsiasi
// URL di un solo segmento (/contatti, /chi-siamo, ...). Il valore digitato
// arriva come params.slug.

// Metadati della pagina (<title>, description) calcolati dallo slug dell'URL
export async function generateMetadata({params}) {
    // In questa versione di Next.js params e' una Promise: va atteso con await
    const {slug} = await params;
    // Nei dati di Directus il permalink inizia con "/", quindi si aggiunge
    return getPageMetadata(`/${slug}`);
}

export default async function Page({params}) {
    const {slug} = await params;
    return <PageView permalink={`/${slug}`}/>;
}