import client from '../lib/directus';
import {readItems} from '@directus/sdk';
import HeroSection from './components/blocks/HeroSection';
import RichTextSection from './components/blocks/RichTextSection';
import TextGridSection from './components/blocks/TextGridSection';
import GallerySection from './components/blocks/GallerySection';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Posts from './components/blocks/Posts';

export default async function Home() {
    // Fetch homepage data from Directus
    const homepageData = await client.request(
        readItems('pages', {
            filter: {
                permalink: {
                    _eq: '/'
                }
            },
            fields: [
                "*",
                "blocks.*",
                "blocks.item.*.*.*.*",
            ]
        })
    );

    const hero_data = homepageData[0].blocks?.filter(block => block.collection === 'block_hero')?.[0];
    const rich_text_data = homepageData[0].blocks?.filter(block => block.collection === 'block_richtext')?.[0];
    const gallery_data = homepageData[0].blocks?.filter(block => block.collection === 'block_gallery')?.[0];
    const text_grid_data = homepageData[0].blocks?.filter(block => block.collection === 'block_textgrid')?.[0];
    const posts_data = homepageData[0].blocks?.filter(block => block.collection === 'block_posts')?.[0];

    const navigationData = await client.request(
        readItems('navigation', {
            fields: [
                "*.*.*.*.*",
            ]
        })
    );

    return (
        <main>
            <Header
                navigation={navigationData}
            />

            <>
                {hero_data && <HeroSection
                    tagline={hero_data.item.tagline}
                    headline={hero_data.item.headline}
                    description={hero_data.item.description}
                    image={hero_data.item.image}
                    layout={hero_data.item.layout}
                    button_group={hero_data.item.button_group?.buttons ?? []}
                />}

                {text_grid_data && <TextGridSection {...(text_grid_data.item)} />}
                {posts_data && <Posts {...(posts_data.item)} />}
                    {gallery_data && <GallerySection
                        {...(gallery_data.item)}
                    />}
            </>

            <Footer
                navigation={navigationData}
            />
        </main>
    );
}
