import Link from 'next/link';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import "./style.css";

// Blocco "Pricing": mostra una serie di piani tariffari affiancati, ciascuno
// con titolo, prezzo, elenco di caratteristiche e un bottone. I piani
// arrivano da una relazione uno-a-molti (pricing_cards) del blocco.
//
// tagline / headline: testi introduttivi
// pricing_cards:      array di piani gia' espansi da Directus
export default function PricingSection({ tagline, headline, pricing_cards = [] }) {
    // Senza piani la sezione non ha senso: non si mostra nulla
    if (!pricing_cards || pricing_cards.length === 0) {
        return null;
    }

    return (
        <section className="pricing-section">
            <div className="container">
                <div className="pricing-header">
                    {tagline && <p className="tagline">{tagline}</p>}
                    {headline && <h2>{headline}</h2>}
                </div>

                <div className="pricing-plans">
                    {/* key={index} qui va bene: l'ordine e' gestito dal campo
                        "sort" in Directus, non viene riordinato al volo. */}
                    {pricing_cards.map((plan, index) => (
                        <Card className={`pricing-plan ${plan.is_highlighted ? 'featured' : ''}`} key={index}>
                            {plan.badge && (
                                <Badge className="pricing-badge absolute right-5 top-5 border-0 bg-primary text-primary-foreground text-xs uppercase tracking-wide">
                                    {plan.badge}
                                </Badge>
                            )}
                            <h3>{plan.title}</h3>
                            <div className="price">{plan.price}</div>
                            {plan.description && <p className="plan-description">{plan.description}</p>}

                            {plan.features && (
                                <ul className="features">
                                    {/* .trim() toglie gli spazi che Directus a
                                        volte lascia intorno alle voci della
                                        simple-list. */}
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx}>{feature.trim()}</li>
                                    ))}
                                </ul>
                            )}

                            {plan.button && plan.button.label && (
                                <Button
                                    asChild
                                    variant={plan.is_highlighted ? 'default' : 'secondary'}
                                    className="w-full text-base font-semibold"
                                >
                                    <Link href={resolveButtonUrl(plan.button)}>{plan.button.label}</Link>
                                </Button>
                            )}
                        </Card>
                    ))}
                </div>
            </div>

            
        </section>
    );
}

// Calcola la destinazione del bottone del piano. A differenza del blocco
// Hero, qui il campo button viene da una relazione uno-a-molti separata
// (block_button), quindi "page" e "post" sono id, non oggetti espansi.
function resolveButtonUrl(button) {
    if (button.type === 'page' && button.page) return `/pages/${button.page}`;
    if (button.type === 'post' && button.post) return `/posts/${button.post}`;
    return button.url || '#';
}