import Link from "next/link"
import {Card} from '@/components/ui/card';
import "./style.css";

// Blocco "Text Grid": griglia di riquadri, ognuno con un titolo cliccabile
// che porta a una pagina interna o a un sito esterno.
//
// headline: titolo della sezione (opzionale)
// items:    array di oggetti { title, url } scritti dall'editor in Directus
export default function TextGridSection({headline, items = []}) {
    return (
        <section className="text-grid-section">
            <div className="text-grid">
                {headline && <h2>{headline}</h2>}

                <div className="grid">
                    {items.map((item, idx) => {
                        // resolveHref restituisce null se l'url e' vuoto:
                        // in quel caso il titolo non diventa un link.
                        const link = resolveHref(item.url);
                        return (
                            <Card key={idx} className="box gap-0 py-6">
                                {link ? (
                                    <Link
                                        href={link.href}
                                        // target e rel servono solo per i link
                                        // esterni: aprono in una scheda nuova
                                        // e impediscono alla pagina originale
                                        // di essere manipolata.
                                        target={link.external ? '_blank' : undefined}
                                        rel={link.external ? 'noopener noreferrer' : undefined}
                                    >
                                        <h3 className="box-link">{item.title}</h3>
                                    </Link>
                                ) : (
                                    <h3 className="box-link">{item.title}</h3>
                                )}
                            </Card>
                        );
                    })}
                </div>
            </div>

            
        </section>
    );

    // Trasforma l'URL scritto dall'editor in un href pronto per <Link>.
    // - Le stringhe che iniziano con http://, https://, mailto: o tel:
    //   vengono considerate esterne e usate cosi' come sono.
    // - Tutto il resto e' un percorso interno: gli spazi diventano trattini
    //   e si aggiunge uno slash iniziale (uno solo, anche se l'editor ne ha
    //   gia' scritto uno).
    function resolveHref(url) {
        const raw = url?.trim();
        if (!raw) return null;

        if (/^(https?:\/\/|mailto:|tel:)/i.test(raw)) {
            return {href: raw, external: true};
        }

        const path = raw.replace(/\s+/g, '-').replace(/^\/+/, '');
        return {href: `/${path}`, external: false};
    }
}