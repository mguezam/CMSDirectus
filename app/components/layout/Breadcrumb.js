"use client";

import Link from 'next/link';

export default function Breadcrumb({trail = [], breadcrumb_color, breadcrumb_font_size}) {
    if (!trail || trail.length === 0) return null;

    return (
        <nav aria-label="Breadcrumb" className="breadcrumb"
             style={{"--breadcrumb_font_size": breadcrumb_font_size + "px", "--breadcrumb_color": breadcrumb_color}}>
            <Link href="/">Home</Link>

            {trail.map((crumb, idx) => {
                const isLast = idx === trail.length - 1;
                return (
                    <span key={idx} className="crumb">
                        <span className="separator">&gt;</span>
                        {crumb.href && !isLast ? (
                            <Link href={crumb.href}>{crumb.title}</Link>
                        ) : (
                            <span aria-current={isLast ? 'page' : undefined}>{crumb.title}</span>
                        )}
                    </span>
                );
            })}

            <style jsx>{`
                .breadcrumb {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px 20px 0;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: var(--breadcrumb_font_size, 14px);
                    color: var(--breadcrumb_color, blue);
                }

                .crumb {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .breadcrumb :global(a) {
                    color: inherit;
                    text-decoration: none;
                }

                .breadcrumb :global(a:hover) {
                    text-decoration: underline;
                }

                .separator {
                    opacity: 0.6;
                }
            `}</style>
        </nav>
    );
}