import {getPageMetadata} from '@/lib/pages';
import PageView from '@/lib/PageView';

// Funzione speciale di Next.js: fornisce <title> e meta description.
// Deve restare esportata da ogni rotta, perche' Next.js la cerca solo nel
// file page.js della pagina che sta mostrando. Il permalink della home e' "/".
export async function generateMetadata() {
    return getPageMetadata('/');
}

// La home page: tutto il lavoro e' in PageView
export default function Home() {
    return <PageView permalink="/"/>;
}