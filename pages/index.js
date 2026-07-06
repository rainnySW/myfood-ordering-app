import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Home({ menuItems, lang, t }) {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // Rotate items every 10 seconds with smooth animation
    useEffect(() => {
        if (!menuItems || menuItems.length === 0) return;
        const interval = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 3) % menuItems.length);
                setIsAnimating(false);
            }, 600); // 600ms matches the transition duration
        }, 10000);
        return () => clearInterval(interval);
    }, [menuItems]);

    // Get 3 items wrapping around the array
    const getDisplayedItems = () => {
        if (!Array.isArray(menuItems) || menuItems.length === 0) return [];
        const items = [];
        for (let i = 0; i < 3; i++) {
            items.push(menuItems[(currentIndex + i) % menuItems.length]);
        }
        return items;
    };

    const displayedItems = getDisplayedItems();

    return (
        <div key={lang} className="animate-[fadeIn_0.5s_ease-in-out]">
            <Head>
                <title>{t('home')} | Ramen Aroy</title>
            </Head>

            {/* Hero Section */}
            <header className="max-w-6xl mx-auto px-4 py-12 md:py-20 text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
                    {lang === 'th' ? 'ชามที่อบอุ่น สำหรับ' : 'Warm bowls for'} <br className="md:hidden" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97736] to-orange-400 dark:from-pastelOrange dark:to-[#FFDDBF]">
                        {lang === 'th' ? 'ช่วงเวลาแสนพิเศษ' : 'cozy moments.'}
                    </span>
                </h1>
                <p className="text-lg opacity-80 max-w-xl mx-auto mb-10">
                    {lang === 'th' ? 'ยินดีต้อนรับสู่พื้นที่แห่งความสุขของคุณ เลือกดูเมนูยอดฮิตด้านล่าง หรือสำรวจเมนูทั้งหมดเพื่อสั่งอาหารได้เลย' : 'Welcome to your happy place. Check out our favorites below or explore the full menu to order directly to your table.'}
                </p>
                <Link href="/menu" className="inline-block bg-textDark dark:bg-textLight text-white dark:text-textDark px-8 py-4 rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-black/10 dark:shadow-black/30">
                    {lang === 'th' ? 'ดูเมนูทั้งหมด' : 'Explore Full Menu'}
                </Link>
            </header>

            {/* Featured Slideshow */}
            <section className="max-w-6xl mx-auto pb-28 md:pb-20">
                <div className="px-4 mb-6 flex justify-between items-end">
                    <h2 className="text-2xl md:text-3xl font-bold">{lang === 'th' ? 'เมนูยอดฮิต' : 'Featured Favorites'}</h2>
                    <Link href="/menu" className="text-pastelOrangeDark dark:text-pastelOrange font-bold text-sm hover:underline flex items-center gap-1">
                        {lang === 'th' ? 'ดูทั้งหมด' : 'See All'} <i className="ph-bold ph-arrow-right"></i>
                    </Link>
                </div>

                {/* Grid for 3 items (Scrollable on very small mobile if needed, but flex evenly) */}
                <div 
                    className={`flex overflow-x-auto snap-x snap-mandatory gap-4 px-4 pb-8 md:justify-center transition-all duration-700 ease-in-out ${isAnimating ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'}`} 
                    style={{ scrollbarWidth: 'none' }}
                >
                    
                    {displayedItems.map((item, idx) => (
                        <div 
                            key={`${item._id}-${idx}`} 
                            onClick={() => router.push('/menu')}
                            className="cursor-pointer snap-start shrink-0 w-[260px] sm:w-[280px] md:w-[320px] group bg-cardLight dark:bg-cardDark rounded-3xl overflow-hidden shadow-soft dark:shadow-softDark hover:-translate-y-1 hover:shadow-lg transition-all duration-300 border border-transparent dark:border-white/5 flex flex-col"
                        >
                            <div className="relative h-40 md:h-56 overflow-hidden shrink-0">
                                <Image src={item?.image_url || '/placeholder.jpg'} alt={item?.name || 'Loading'} fill priority={idx === 0} className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" sizes="(max-width: 768px) 260px, 320px" />
                                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold z-10 shadow-sm">
                                    ฿{item.price}
                                </div>
                            </div>
                            <div className="p-5 flex flex-col flex-1">
                                <div className="text-xs font-bold uppercase tracking-wider text-[#D97736] dark:text-pastelOrange mb-1">{lang === 'th' && item.category === 'Ramen' ? 'ราเมน' : (lang === 'th' && item.category === 'Sides' ? 'ของทานเล่น' : (lang === 'th' && item.category === 'Drinks' ? 'เครื่องดื่ม' : item.category))}</div>
                                <h3 className="text-lg md:text-xl font-bold mb-2 leading-tight">{lang === 'th' && item.name_th ? item.name_th : item.name}</h3>
                                <p className="opacity-70 text-sm line-clamp-2 flex-1">{lang === 'th' && item.description_th ? item.description_th : item.description}</p>
                            </div>
                        </div>
                    ))}
                    
                </div>
            </section>
        </div>
    );
}
