import Image from 'next/image';
import Link from 'next/link';
import {Button} from '@/components/ui/button';
import "./style.css";

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
                                <Button
                                    key={idx}
                                    asChild
                                    className={`h-auto rounded-md px-[30px] py-3 text-lg font-semibold ${
                                        heroButtonClasses[button.variant] ?? heroButtonClasses.default
                                    }`}
                                >
                                    <Link href={resolveButtonUrl(button)}>{button.label}</Link>
                                </Button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            
        </section>
    );
}

const heroButtonClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-[#2b6cb0]',
    outline: 'border-2 border-[#3182ce] bg-transparent text-[#3182ce] hover:bg-[#ebf8ff]',
    soft: 'border-0 bg-[#ebf8ff] text-[#3182ce] hover:bg-[#dbeafe]',
    ghost: 'border-0 bg-transparent text-[#3182ce] hover:bg-[#ebf8ff]',
    link: 'border-0 bg-transparent text-[#3182ce] underline hover:bg-transparent',
};

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