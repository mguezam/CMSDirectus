import {Fragment} from 'react';
import Link from 'next/link';
import {
    Breadcrumb as BreadcrumbRoot,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import "./style.css";

// Briciole di pane ("Home > Sezione > Pagina"). Il percorso arriva gia' pronto
// da getPageByPermalink, quindi qui si limita a disegnarlo.
//
// trail:                elenco di voci { title, href }. href e' null per le voci
//                       senza destinazione (es. i gruppi del menu)
// breadcrumb_color:     colore del testo, impostato in Directus sulla pagina
// breadcrumb_font_size: dimensione del testo in pixel (solo il numero)
export default function Breadcrumb({trail = [], breadcrumb_color, breadcrumb_font_size}) {
    // Nessun percorso: non si disegna nulla. Il controllo copre anche null,
    // che il valore di default "= []" non coprirebbe.
    if (!trail || trail.length === 0) return null;

    // Colore e dimensione vengono passati al CSS come variabili custom
    // (--nome), assegnate qui con lo stile inline e lette piu' sotto con var().
    // Attenzione: se breadcrumb_font_size e' vuoto il risultato e' "undefinedpx"
    // (o "nullpx"), un valore non valido che impedisce di usare il 14px di riserva.
    return (
        <BreadcrumbRoot aria-label="Breadcrumb" className="breadcrumb"
             style={{
                 "--breadcrumb_font_size": breadcrumb_font_size != null && breadcrumb_font_size !== ''
                     ? `${breadcrumb_font_size}px`
                     : undefined,
                 "--breadcrumb_color": breadcrumb_color,
             }}>
            <BreadcrumbList className="breadcrumb-list">
                <BreadcrumbItem>
                    <BreadcrumbLink asChild><Link href="/">Home</Link></BreadcrumbLink>
                </BreadcrumbItem>

                {trail.map((crumb, idx) => {
                    const isLast = idx === trail.length - 1;
                    return (
                        <Fragment key={idx}>
                            <BreadcrumbSeparator className="separator">&gt;</BreadcrumbSeparator>
                            <BreadcrumbItem>
                                {crumb.href && !isLast ? (
                                    <BreadcrumbLink asChild><Link href={crumb.href}>{crumb.title}</Link></BreadcrumbLink>
                                ) : (
                                    <BreadcrumbPage className="text-inherit">{crumb.title}</BreadcrumbPage>
                                )}
                            </BreadcrumbItem>
                        </Fragment>
                    );
                })}
            </BreadcrumbList>
        </BreadcrumbRoot>
    );
}