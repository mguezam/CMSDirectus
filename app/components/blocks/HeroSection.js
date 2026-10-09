"use client";

import Image from 'next/image';
import Link from 'next/link';

// Blocco "Hero": sezione di apertura di una pagina, con immagine di sfondo,
// titolo, descrizione e uno o piu' bottoni.
//
// tagline / headline / description: testi
// image:                          immagine di sfondo (da Directus)
// button_group:                   array di bottoni (o oggetto { buttons: [...] })
export default function HeroSection({tagline, headline, description, image, button_group}) {
    // Directus a volte restituisce button_group come oggetto { buttons: [...] },
    // a volte come array diretto, a volte come null: questa riga normalizza
    // tutti i casi in un array, cosi' il resto del componente e' piu' semplice.
    const buttons = button_group?.buttons ?? button_group ?? [];

    return (
        <section className="hero-section">
            {/* <Image fill> riempie il contenitore (position: relative qui
                sopra). priority dice a Next di caricarla subito, perche' e'
                la prima cosa che l'utente vede. */}
            {image && (
                <Image
                    src={`http://localhost:8055/assets/${image.id}?access_token=${process.env.NEXT_PUBLIC_DIRECTUS_TOKEN}`}
                    alt={image.filename_download || 'Hero Image'}
                    fill
                    priority
                    sizes="100vw"
                    style={{objectFit: 'cover'}}
                />
            )}
            {/* Velo scuro sopra l'immagine per rendere il testo leggibile
                indipendentemente da quanto e' chiara la foto. */}
            <div className="hero-overlay"/>

            <div className="container">
                <div className="hero-content">
                    {tagline && <p className="tagline">{tagline}</p>}
                    {headline && <h1>{headline}</h1>}
                    {description && <p className="description">{description}</p>}

                    {buttons.length > 0 && (
                        <div className="button-group">
                            {buttons.map((button, idx) => (
                                <Link key={idx} href={resolveButtonUrl(button)}>
                                    {/* La variante (outline, soft, ghost...) e'
                                        una classe CSS: il colore di base e'
                                        definito in .cta-button, le varianti
                                        sovrascrivono. */}
                                    <button className={`cta-button ${button.variant || 'default'}`}>
                                        {button.label}
                                    </button>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .hero-section {
                    position: relative;
                    min-height: 500px;
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                }

                .hero-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.4);
                }

                .container {
                    position: relative;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 20px;
                    width: 100%;
                }

                .hero-content {
                    max-width: 600px;
                }

                h1 {
                    font-size: 48px;
                    font-weight: bold;
                    margin-bottom: 20px;
                    color: #ffffff;
                }

                .tagline {
                    font-size: 18px;
                    color: #e2e8f0;
                    margin-bottom: 10px;
                }

                .description {
                    font-size: 20px;
                    line-height: 1.6;
                    color: #e2e8f0;
                    margin-bottom: 30px;
                }

                .button-group {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;
                }

                .cta-button {
                    display: inline-block;
                    background-color: #3182ce;
                    color: white;
                    font-size: 18px;
                    padding: 12px 30px;
                    border-radius: 6px;
                    text-decoration: none;
                    font-weight: 600;
                    transition: background-color 0.3s;
                }

                .cta-button:hover {
                    background-color: #2b6cb0;
                }

                /* Varianti: stesso bottone con stile diverso. */
                .cta-button.outline {
                    background: transparent;
                    border: 2px solid #3182ce;
                    color: #3182ce;
                }

                .cta-button.soft {
                    background: #ebf8ff;
                    color: #3182ce;
                }

                .cta-button.ghost {
                    background: transparent;
                    color: #3182ce;
                }

                .cta-button.link {
                    background: none;
                    color: #3182ce;
                    text-decoration: underline;
                }

                @media (max-width: 768px) {
                    .container {
                        flex-direction: column;
                    }

                    .hero-content {
                        margin: 0 0 30px 0;
                    }
                }
            `}</style>
        </section>
    );
}

// Calcola l'URL del bottone in base al tipo scelto in Directus.
// - page: usa il permalink della pagina collegata (gia' con slash iniziale)
// - post: id del post -> /posts/<id>
// - url:  URL libero scritto dall'editor
// - altrimenti: "#" (link che non porta da nessuna parte)
function resolveButtonUrl(button) {
    if (button.type === 'page' && button.page) return `${button.page.permalink}`;
    if (button.type === 'post' && button.post) return `/posts/${button.post.id}`;
    return button.url || '#';
}