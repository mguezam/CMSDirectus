import "./style.css";

// Blocco "Rich Text": testo formattato (paragrafi, titoli, elenchi, link)
// scritto dall'editor in Directus. Il contenuto e' HTML e viene inserito
// cosi' com'e': va bene perche' lo scrivono solo gli editori del sito, non
// i visitatori.
//
// tagline / headline:      testi introduttivi opzionali
// content:                 HTML del corpo principale
// alignment:               allineamento del contenitore ("left" o "center")
// background_color:        sfondo della sezione (da Directus)
// tagline_color, headline_color, content_color: colori dei singoli testi
export default function RichTextSection({
                                            tagline,
                                            headline,
                                            content,
                                            alignment = 'center',
                                            background_color,
                                            tagline_color,
                                            headline_color,
                                            content_color
                                        }) {
    return (
        <section className="rich-text-section" style={{"--richtext-background": background_color}}>
            <div className="container" style={{textAlign: alignment}}>
                {tagline && <p className="tagline" style={{"--tagline-color": tagline_color}}>{tagline}</p>}
                {headline && <h2 style={{"--headline-color": headline_color}}>{headline}</h2>}
                {content && (
                    <div className="content" dangerouslySetInnerHTML={{__html: content}}
                         style={{"--content-color": content_color}}/>
                )}
            </div>

            
        </section>
    );
}