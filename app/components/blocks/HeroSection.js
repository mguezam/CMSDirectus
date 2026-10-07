"use client";

import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection({tagline, headline, description, image, button_group = []}) {
    return (
        <section className="hero-section">
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
            <div className="hero-overlay"/>

            <div className="container">
                <div className="hero-content">
                    {tagline && <p className="tagline">{tagline}</p>}
                    {headline && <h1>{headline}</h1>}
                    {description && <p className="description">{description}</p>}

                    {button_group.length > 0 && (
                        <div className="button-group">
                            {button_group.map((button, idx) => (
                                <Link key={idx} href={resolveButtonUrl(button)}>
                                    <button className={`cta-button ${button.variant || 'default'}`}>
                                        {button.label}
                                    </button>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .hero-section {
                    position: relative;
                    min-height: 500px;
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                }

                .hero-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.4);
                }

                .container {
                    position: relative;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 20px;
                    width: 100%;
                }

                .hero-content {
                    max-width: 600px;
                }

                h1 {
                    font-size: 48px;
                    font-weight: bold;
                    margin-bottom: 20px;
                    color: #ffffff;
                }

                .tagline {
                    font-size: 18px;
                    color: #e2e8f0;
                    margin-bottom: 10px;
                }

                .description {
                    font-size: 20px;
                    line-height: 1.6;
                    color: #e2e8f0;
                    margin-bottom: 30px;
                }

                .button-group {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;
                }

                .cta-button {
                    display: inline-block;
                    background-color: #3182ce;
                    color: white;
                    font-size: 18px;
                    padding: 12px 30px;
                    border-radius: 6px;
                    text-decoration: none;
                    font-weight: 600;
                    transition: background-color 0.3s;
                }

                .cta-button:hover {
                    background-color: #2b6cb0;
                }

                .cta-button.outline {
                    background: transparent;
                    border: 2px solid #3182ce;
                    color: #3182ce;
                }

                .cta-button.soft {
                    background: #ebf8ff;
                    color: #3182ce;
                }

                .cta-button.ghost {
                    background: transparent;
                    color: #3182ce;
                }

                .cta-button.link {
                    background: none;
                    color: #3182ce;
                    text-decoration: underline;
                }

                .hero-image {
                    flex: 1;
                    min-width: 300px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                @media (max-width: 768px) {
                    .container {
                        flex-direction: column;
                    }

                    .hero-content {
                        margin: 0 0 30px 0;
                    }
                }
            `}</style>
        </section>
    );
}

// Helper function to resolve button link
function resolveButtonUrl(button) {
    if (button.type === 'page' && button.page) return `${button.page.permalink}`;
    if (button.type === 'post' && button.post) return `/posts/${button.post.id}`;
    return button.url || '#';
}
