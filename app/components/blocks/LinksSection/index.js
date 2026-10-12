import Link from 'next/link';
import {Button} from '@/components/ui/button';
import "./style.css";

// Blocco "Links": mostra una riga di collegamenti orizzontali, uno accanto
// all'altro, con titolo opzionale sopra.
//
// title:            intestazione della sezione (opzionale)
// items:            array di oggetti { label, url } scritti dall'editor
// background_color: colore di sfondo della sezione (da Directus)
// text_color:       colore del titolo e delle etichette (da Directus)
export default function LinksSection({title, items = [], background_color, text_color}) {
    return (
        <section
            className="links-section"
            style={{
                // Variabili CSS dinamiche impostate dai valori configurati in Directus.
                "--links-background": background_color,
                "--links-text": text_color,
            }}
        >
            <div className="container">
                {title && <h2>{title}</h2>}

                <div className="links-row">
                    {/* key={idx} e' accettabile qui perche' la lista non viene
                        riordinata: gli elementi cambiano solo se l'editor
                        modifica il repeater in Directus. */}
                    {items.map((item, idx) => (
                        <Button key={idx} asChild variant="outline" className="link-card h-auto">
                            <Link href={item.url}>{item.label}</Link>
                        </Button>
                    ))}
                </div>
            </div>

            
        </section>
    );
}