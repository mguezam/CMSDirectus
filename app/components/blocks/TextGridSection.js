"use client";

import Link from "next/link"

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
                            <div key={idx} className="box">
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
                            </div>
                        );
                    })}
                </div>
            </div>

            <style jsx>{`
                .text-grid {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 60px 20px;
                }

                .text-grid-section {
                    background-color: #181A1B;
                }

                h2 {
                    font-size: 36px;
                    margin-bottom: 30px;
                    color: #E8E6E3;
                }

                /* 3 colonne e riempimento per colonna: i riquadri scendono in
                   verticale e poi ripartono dalla colonna successiva. */
                .grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    grid-template-rows: repeat(5, auto);
                    grid-auto-flow: column;
                    gap: 24px;
                }

                .box {
                    padding: 24px;
                    background: #001E3E;
                    border-radius: 8px;
                }

                h3 {
                    margin: 0 0 10px;
                    color: #E8E6E3;
                }

                .box-link {
                    text-decoration: none;
                    color: #E8E6E3;
                    display: inline-block;
                }

                .box-link:hover {
                    text-decoration: underline;
                }
            `}</style>
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