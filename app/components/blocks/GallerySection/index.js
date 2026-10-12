import Image from 'next/image';
import "./style.css";

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

            
        </section>
    );
}