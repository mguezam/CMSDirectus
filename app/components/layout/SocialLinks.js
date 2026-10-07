import Image from "next/image";

export default function SocialLinks({links, label, color}) {
    if (!links || links.length === 0) {
        return null;
    }

    return (
        <div className="social-links">
            <span className={"socialLabel"} style={{'--color': color}}>{label}</span>
            {links.map((link, idx) => (
                <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.platform}
                >
                    <Image src={`/icons/${link.platform}.svg`} alt="" width={22} height={22}/>
                </a>
            ))}

            <style jsx>{`
                .social-links {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .socialLabel {
                    color: var(--color, white);
                }
                a {
                    display: inline-flex;
                }

                a:hover {
                    opacity: 0.7;
                }
            `}</style>
        </div>
    );
}