"use client";

import Link from 'next/link';
import HeaderSearch from './HeaderSearch';
import Image from "next/image";
import SocialLinks from './SocialLinks';

export default function Header({navigation}) {
    // Find the Main Navigation set by title
    const headerNavigation = navigation.filter((nav) => nav.title === 'Main Navigation')[0];

    if (!headerNavigation || headerNavigation.items?.length === 0) {
        return null;
    }
    console.log('keys:', Object.keys(headerNavigation));
    console.log('colors:', {
        search_background_color: headerNavigation.search_background_color,
        search_text_color: headerNavigation.search_text_color,
        search_color: headerNavigation.search_color,
        search_text_color_v2: headerNavigation.search_text_color_v2,
    });

    const backgroundColor = headerNavigation.background_color;
    const topBarColor = headerNavigation.top_bar_color;
    const height = headerNavigation.height;
    const logo = headerNavigation.logo;
    const socialLinks = headerNavigation.social_links
    const socialLinksLabel = headerNavigation?.social_links_label;
    const socialLinksColor = headerNavigation.social_links_color;

    return (
        <header className="site-header">
            <div className="top-bar">
                <div className="container top-container">
                    <div className="logo">
                        {logo && (
                            <Image
                                src={`http://localhost:8055/assets/${logo.id}?access_token=${process.env.NEXT_PUBLIC_DIRECTUS_TOKEN}`}
                                alt={logo.filename_download || 'Logo'}
                                width={70}
                                height={70}
                                style={{objectFit: 'contain', width: 'auto', height: 'auto'}}
                            />
                        )}
                        <Link href="/directus-next-cms/public">
                            <span className="logo-text">Consorzio di Bonifica Adige Po</span>
                        </Link>
                    </div>
                    <div className="top-right">
                        <SocialLinks links={socialLinks} label={socialLinksLabel} color={socialLinksColor}/>
                        {headerNavigation.search_enabled && (
                            <HeaderSearch placeholder={headerNavigation.search_placeholder ?? 'Cerca...'}
                                          search_background_color={headerNavigation.search_background_color} search_text_color={headerNavigation.search_text_color}/>
                        )}
                    </div>
                </div>
            </div>

            <nav className="nav-bar">
                <div className="container nav-container">
                    <div className="main-nav">
                        {headerNavigation.items.map((item) => (
                            <NavigationItem key={item.id} item={item}/>
                        ))}
                    </div>
                </div>
            </nav>

            <style jsx>{`
                .site-header {
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                    position: sticky;
                    top: 0;
                    z-index: 100;
                }

                .container {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 0 20px;
                    display: flex;
                    align-items: center;
                }

                .top-container {
                    height: ${height ?? 80}px;
                    justify-content: space-between;
                }

                .top-bar {
                    background-color: ${topBarColor ?? '#ffffff'};
                }

                .nav-bar {
                    background-color: ${backgroundColor ?? '#ffffff'};
                }

                .nav-container {
                    height: 48px;
                    justify-content: flex-start;
                }

                .top-right {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 8px;
                }

                .logo {
                    display: flex;
                    font-size: 25px;
                    font-weight: 700;
                    align-items: center;
                    flex-shrink: 1;
                    min-width: 0;
                    gap: 20px;
                }

                .logo-text {
                    color: #3182ce;
                    text-decoration: none;
                }

                .main-nav a:hover {
                    color: #3182ce;
                }

                @media (max-width: 768px) {
                    .container {
                        flex-direction: column;
                        height: auto;
                        padding: 20px;
                    }

                    .logo {
                        margin-bottom: 20px;
                    }

                }
            `}</style>
            <style jsx global>{`
                .nav-dropdown {
                    position: relative;
                }

                .nav-dropdown-trigger {
                    color: var(--item-color, #4a5568);
                    font-size: 16px;
                    font-weight: 500;
                    cursor: pointer;
                    white-space: nowrap;
                }

                .nav-dropdown:hover .nav-dropdown-trigger {
                    color: #3182ce;
                }

                .nav-dropdown-panel {
                    display: none;
                    position: absolute;
                    top: 100%;
                    left: 0;
                    gap: 40px;
                    min-width: 400px;
                    padding: 20px;
                    background: #ffffff;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    border-radius: 6px;
                }

                .nav-dropdown:hover .nav-dropdown-panel {
                    display: flex;
                }

                .nav-column {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .nav-column-title {
                    font-weight: 700;
                    color: #1a202c;
                    margin: 0 0 4px;
                }

                .nav-column a {
                    color: var(--item-color, #4a5568);
                    text-decoration: none;
                }

                .nav-column a:hover {
                    color: #3182ce;
                }

                .main-nav {
                    display: flex;
                    align-items: center;
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    gap: 24px;
                }

                .main-nav a {
                    color: var(--item-color, #4a5568);
                    text-decoration: none;
                    font-size: 16px;
                    font-weight: 500;
                    transition: color 0.3s;
                    white-space: nowrap;
                }
            `}</style>
        </header>
    );
}

// Top-level items: a group becomes a dropdown, anything else is a plain link
function NavigationItem({item}) {
    if (item.type === 'group') {
        return <DropdownItem item={item}/>;
    }
    return <NavLink item={item}/>;
}

// A dropdown whose children (sub-groups) become vertical columns
function DropdownItem({item}) {
    return (
        <div className="nav-dropdown">
            <span className="nav-dropdown-trigger" style={{'--item-color': item.element_color}}>{item.title}</span>
            <div className="nav-dropdown-panel">
                {item.children?.map((child) =>
                    child.type === 'group' ? (
                        <div key={child.id} className="nav-column">
                            <p className="nav-column-title">{child.title}</p>
                            {child.children?.map((link) => (
                                <NavLink key={link.id} item={link}/>
                            ))}
                        </div>
                    ) : (
                        <div key={child.id} className="nav-column">
                            <NavLink item={child}/>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

function NavLink({item}) {
    return (
        <div style={{'--item-color': item.element_color}}>
            <Link
                href={resolveItemUrl(item)}
                target={item.target === '_blank' ? '_blank' : undefined}
                rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
            >
                {item.title}
            </Link>
        </div>
    );
}

// Helper to resolve link destination properly
function resolveItemUrl(item) {
    if (item.type === 'page' && item.page) {
        return `${item.page.permalink}`;
    }
    if (item.type === 'post' && item.post) {
        return `/posts/${item.post}`;
    }
    if (item.type === 'url' && item.url) {
        return item.url;
    }
    return '#';
}