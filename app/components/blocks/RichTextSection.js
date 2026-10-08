"use client";

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

            <style jsx>{`
                .rich-text-section {
                    background-color: var(--richtext-background, #151515);
                    padding: 80px 0;
                }

                .container {
                    max-width: 900px;
                    margin: 0 auto;
                    padding: 0 20px;
                }

                .tagline {
                    font-size: 18px;
                    color: var(--tagline-color, #151515);
                    margin-bottom: 10px;
                }

                h2 {
                    font-size: 36px;
                    font-weight: bold;
                    margin-bottom: 30px;
                    color: var(--headline-color, #151515);
                }

                .content {
                    font-size: 18px;
                    line-height: 1.7;
                    color: var(--content-color, #151515);
                }

                .content :global(a) {
                    color: #3182ce;
                    text-decoration: underline;
                    transition: color 0.15s;
                }

                .content :global(a:hover) {
                    color: #2b6cb0;
                }

                .content :global(p) {
                    margin-bottom: 20px;
                }

                .content :global(h3) {
                    font-size: 24px;
                    margin-top: 40px;
                    margin-bottom: 20px;
                    color: #2d3748;
                }

                .content :global(ul),
                .content :global(ol) {
                    margin-bottom: 20px;
                    padding-left: 20px;
                }

                .content :global(li) {
                    margin-bottom: 10px;
                }

                @media (max-width: 768px) {
                    h2 {
                        font-size: 30px;
                    }

                    .content {
                        font-size: 16px;
                    }
                }
            `}</style>
        </section>
    );
}