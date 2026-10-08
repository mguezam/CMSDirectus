import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import Breadcrumb from "@/app/components/layout/Breadcrumb";
import BlockRenderer from "@/app/components/BlockRenderer";

export default function PageShell({page, navigationData, trail, categoryName}) {
    return (
        <main style={{"--page-background": page.background_color, minHeight: "100vh"}}>
            <Header navigation={navigationData} />

            {page.show_breadcrumb && (
                <Breadcrumb
                    trail={trail}
                    breadcrumb_color={page.breadcrumb_color}
                    breadcrumb_font_size={page.breadcrumb_font_size}
                />
            )}

            <BlockRenderer blocks={page.blocks} categoryName={categoryName} />

            <Footer navigation={navigationData} />
        </main>
    );
}