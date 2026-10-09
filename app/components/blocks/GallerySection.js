"use client";

import Image from 'next/image';

// Blocco "Gallery": griglia di immagini caricate nella libreria file di
// Directus. Le immagini sono referenziate tramite la relazione "items" del
// blocco (una lista di file).
//
// tagline / headline: testi introduttivi
// items:              array di oggetti { directus_file: { id, filename } }
export default function GallerySection({ tagline, headline, items = [] }) {
    // Nessuna immagine, nessuna sezione
    if (!items || items.length === 0) {
        return null;
    }

    return (
        <section className="gallery-section">
            <div className="container">
                {tagline && <p className="tagline">{tagline}</p>}
                {headline && <h2>{headline}</h2>}

                <div className="gallery-grid">
                    {/* key={index} e' ok: le immagini non vengono riordinate
                        qui, l'ordine viene da Directus. */}
                    {items.map((item, index) => (
                        <div className="gallery-item" key={index}>
                            {/* Si controlla che il file esista prima di
                                renderizzare <Image>: cosi' un item senza file
                                non fa crashare il componente. */}
                            {item.directus_file?.id && (
                                <Image
                                    src={`http://localhost:8055/assets/${item.directus_file.id}?access_token=${process.env.NEXT_PUBLIC_DIRECTUS_TOKEN}`}                                    alt={item.directus_file.filename_download || 'Gallery image'}
                                    width={400}
                                    height={300}
                                    className="gallery-image"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
        .gallery-section {
          padding: 80px 0;
          background-color: #f9fafb;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          text-align: center;
        }

        .tagline {
          font-size: 18px;
          color: #718096;
          margin-bottom: 10px;
        }

        h2 {
          font-size: 36px;
          font-weight: bold;
          margin-bottom: 40px;
          color: #1a202c;
        }

        /* auto-fill + minmax: le colonne si adattano alla larghezza del
           contenitore, con un minimo di 300px ciascuna. */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 30px;
          margin-top: 40px;
        }

        .gallery-item {
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .gallery-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        }

        .gallery-image {
          width: 100%;
          height: auto;
          object-fit: cover;
        }

        @media (max-width: 768px) {
          .gallery-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
          }
        }
      `}</style>
        </section>
    );
}