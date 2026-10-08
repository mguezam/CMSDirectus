"use client";

import Link from "next/link"

export default function TextGridSection({headline, items = []}) {
    return (
        <section className="text-grid-section">
            <div className="text-grid">
                {headline && <h2>{headline}</h2>}

                <div className="grid">
                    {items.map((item, idx) => {
                        const link = resolveHref(item.url);
                        return (
                            <div key={idx} className="box">
                                {link ? (
                                    <Link
                                        href={link.href}
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

    function resolveHref(url) {
        const raw = url?.trim();
        if (!raw) return null;

        // External: full address or other protocol (https://, http://, mailto:, tel:)
        if (/^(https?:\/\/|mailto:|tel:)/i.test(raw)) {
            return {href: raw, external: true};
        }

        // Internal: spaces become hyphens, and exactly one leading slash
        const path = raw.replace(/\s+/g, '-').replace(/^\/+/, '');
        return {href: `/${path}`, external: false};
    }
}