"use client";

import Image from 'next/image';

// Disegna un singolo post: categoria, titolo, autore e data, immagine e testo.
// E' un componente client perche' usa styled-jsx (<style jsx>), che funziona solo
// nei componenti client. La pagina che lo usa resta un componente server e gli
// passa il post gia' caricato.
//
// post: il post letto da Directus con getPostBySlug
export default function PostArticle({post}) {
    const {title, description, content, published_at, author, image, category} = post;

    // Nome dell'autore: unisce nome e cognome saltando quelli mancanti
    // (filter(Boolean) scarta i valori vuoti, null compreso)
    const authorName = [author?.first_name, author?.last_name].filter(Boolean).join(' ');

    // Data in formato italiano ("12 marzo 2025"). Il fuso orario e' fissato di
    // proposito: senza, server e browser potrebbero formattare la data in modo
    // diverso e React segnalerebbe un errore di "hydration".
    const date = published_at
        ? new Date(published_at).toLocaleDateString('it-IT', {
            day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Rome',
        })
        : null;

    // Riga "Autore - data": mostra solo cio' che c'e'
    const meta = [authorName, date].filter(Boolean).join(' - ');

    return (
        <article className="post">
            {/* La categoria compare solo se il post ne ha una */}
            {category?.Name && <p className="category">{category.Name}</p>}

            <h1>{title}</h1>

            {meta && <p className="meta">{meta}</p>}

            {/* Il token nell'URL serve perche' Next.js scarica l'immagine da Directus
                senza passare dal client (stesso schema usato nel resto del sito).
                width/height sono le dimensioni per cui Next genera il file, la
                dimensione mostrata e' decisa dallo stile. */}
            {image && (
                <Image
                    src={`http://localhost:8055/assets/${image.id}?access_token=${process.env.NEXT_PUBLIC_DIRECTUS_TOKEN}`}
                    alt={image.title || title}
                    width={1200}
                    height={600}
                    style={{width: '100%', height: 'auto'}}
                />
            )}

            {/* Breve introduzione del post, se c'e' */}
            {description && <p className="lead">{description}</p>}

            {/* Il testo e' HTML scritto dall'editor in Directus. dangerouslySetInnerHTML
                lo inserisce cosi' com'e': va bene perche' lo scrivono solo gli editori
                del sito, ma non andrebbe mai usato con testo scritto da visitatori. */}
            {content && <div className="content" dangerouslySetInnerHTML={{__html: content}}/>}

            <style jsx>{`
                /* Il post e' un riquadro con sfondo proprio, cosi' il testo resta
                   leggibile qualunque sia lo sfondo della pagina */
                .post {
                    max-width: 800px;
                    margin: 40px auto;
                    padding: 32px;
                    background: #ffffff;
                    color: #1a202c;
                    border-radius: 8px;
                }

                .category {
                    margin: 0 0 8px;
                    font-size: 14px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: #3182ce;
                }

                h1 {
                    margin: 0 0 12px;
                    font-size: 36px;
                    line-height: 1.2;
                }

                .meta {
                    margin: 0 0 24px;
                    font-size: 14px;
                    color: #718096;
                }

                .lead {
                    margin: 24px 0;
                    font-size: 20px;
                    line-height: 1.6;
                    color: #4a5568;
                }

                /* :global() serve perche' questi elementi (immagini, paragrafi, link...)
                   non sono scritti qui in JSX: li crea il componente Image o arrivano
                   dall'HTML di Directus, e una regola "scoped" non li raggiungerebbe */
                .post :global(img) {
                    max-width: 100%;
                    height: auto;
                    border-radius: 8px;
                }

                .content {
                    line-height: 1.7;
                }

                .content :global(h2),
                .content :global(h3) {
                    margin: 32px 0 12px;
                }

                .content :global(p) {
                    margin: 0 0 16px;
                }

                .content :global(a) {
                    color: #3182ce;
                    text-decoration: underline;
                }

                .content :global(ul),
                .content :global(ol) {
                    margin: 0 0 16px;
                    padding-left: 24px;
                }
            `}</style>
        </article>
    );
}