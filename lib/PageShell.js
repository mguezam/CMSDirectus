import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import Breadcrumb from "@/app/components/layout/Breadcrumb";
import BlockRenderer from "@/app/components/BlockRenderer";

// Struttura comune di ogni pagina: header, breadcrumb (opzionale), blocchi, footer.
// Le rotte chiamano getPageByPermalink e passano qui il risultato.
//
// page:           la pagina letta da Directus (con i suoi blocchi)
// navigationData: tutti i menu (servono a Header e Footer)
// trail:          il percorso del breadcrumb, calcolato in getPageByPermalink
// categoryName:   usato solo nelle pagine di categoria, per filtrare i post
export default function PageShell({page, navigationData, trail, categoryName}) {
    return (
        // Sfondo della pagina impostabile da Directus: il colore viene assegnato alla
        // variabile CSS --page-background (di solito usata dal CSS globale per
        // dipingere lo sfondo). minHeight a 100vh fa coprire sempre tutto lo schermo,
        // anche con poco contenuto, cosi' non compare una fascia bianca in fondo.
        <main style={{"--page-background": page.background_color, minHeight: "100vh"}}>
            <Header navigation={navigationData}/>

            {/* Il breadcrumb si mostra solo se l'editor ha attivato "show_breadcrumb"
                in Directus. Colore e dimensione del testo sono campi della pagina. */}
            {page.show_breadcrumb && (
                <Breadcrumb
                    trail={trail}
                    breadcrumb_color={page.breadcrumb_color}
                    breadcrumb_font_size={page.breadcrumb_font_size}
                />
            )}

            {/* Disegna i blocchi della pagina nell'ordine impostato in Directus */}
            <BlockRenderer blocks={page.blocks} categoryName={categoryName}/>

            <Footer navigation={navigationData}/>
        </main>
    );
}