import HeroSection from '@/app/components/blocks/HeroSection';
import RichTextSection from '@/app/components/blocks/RichTextSection';
import GallerySection from '@/app/components/blocks/GallerySection';
import PricingSection from '@/app/components/blocks/PricingSection';
import FormSection from "@/app/components/blocks/FormSection";
import TextGridSection from '@/app/components/blocks/TextGridSection';
import Posts from '@/app/components/blocks/Posts';

const BLOCKS = {
    block_hero: HeroSection,
    block_richtext: RichTextSection,
    block_gallery: GallerySection,
    block_pricing: PricingSection,
    block_form: FormSection,
    block_textgrid: TextGridSection,
    block_posts: Posts,
};

export default function BlockRenderer({blocks = [], categoryName}) {
    return (
        <>
            {blocks.map((block) => {
                const Component = BLOCKS[block.collection];
                if (!Component) return null;

                // Categories only make sense for the posts block
                const extraProps = block.collection === 'block_posts' ? {categoryName} : {};

                return <Component key={block.id} {...(block.item ?? {})} {...extraProps} />;
            })}
        </>
    );
}