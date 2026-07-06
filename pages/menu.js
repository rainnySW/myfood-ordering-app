import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';

export default function Menu({ menuItems, addToCart, setSelectedItem, setItemOptions, lang, t }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    // Filter & Search Logic
    const safeMenuItems = Array.isArray(menuItems) ? menuItems : [];
    const categories = ['All', ...new Set(safeMenuItems.map(item => item.category))];
    const filteredMenuItems = safeMenuItems.filter(item => {
        const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              (item.name_th && item.name_th.includes(searchQuery));
        return matchesCategory && matchesSearch;
    });

    const getTranslatedCategory = (cat) => {
        if (lang !== 'th') return cat;
        if (cat === 'All') return 'ทั้งหมด';
        if (cat === 'Ramen') return 'ราเมน';
        if (cat === 'Sides') return 'ของทานเล่น';
        if (cat === 'Drinks') return 'เครื่องดื่ม';
        return cat;
    };

    return (
        <div key={lang} className="animate-[fadeIn_0.5s_ease-in-out]">
            <Head>
                <title>{t('menu')} | Ramen Aroy</title>
            </Head>
            
            <div className="pt-8">
                {/* Search and Filter */}
                <div className="max-w-6xl mx-auto px-4 mb-8">
                    <div className="bg-[#FFEFE2] dark:bg-[#3E342E] rounded-3xl p-4 md:p-6 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between border border-[#FFDDBF] dark:border-[#52443A]">
                        {/* Search Bar */}
                        <div className="relative w-full md:w-1/3 flex-shrink-0">
                            <i className="ph-bold ph-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[#D97736] opacity-70"></i>
                            <input 
                                type="text" 
                                placeholder={lang === 'th' ? 'ค้นหาเมนู...' : 'Find your craving...'}
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full bg-white dark:bg-[#2A2421] pl-12 pr-4 py-3 rounded-full border-none focus:ring-2 focus:ring-[#FFDDBF] dark:focus:ring-[#D97736] outline-none transition-all placeholder:opacity-50"
                            />
                        </div>
                        {/* Filter Pills */}
                        <div className="flex gap-3 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 items-center justify-start md:justify-end" style={{ scrollbarWidth: 'none' }}>
                            {categories.map(cat => (
                                <button 
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-5 py-2.5 rounded-full font-bold whitespace-nowrap transition-all flex-shrink-0 ${activeCategory === cat ? 'bg-[#D97736] text-white shadow-md' : 'bg-white dark:bg-[#2A2421] text-textDark dark:text-textLight hover:bg-[#FFDDBF] dark:hover:bg-[#52443A]'}`}
                                >
                                    {getTranslatedCategory(cat)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Menu Grid */}
                <main className="max-w-6xl mx-auto px-3 md:px-4 pb-28 md:pb-20">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
                        {filteredMenuItems.length === 0 ? (
                            <div className="col-span-full text-center py-12 opacity-50 font-bold">
                                {lang === 'th' ? 'ไม่พบเมนู' : 'No menu items found.'}
                            </div>
                        ) : (
                            filteredMenuItems.map(item => (
                                <div 
                                    key={item._id} 
                                    onClick={() => { setSelectedItem(item); setItemOptions({ size: 'Normal', egg: false, sweetness: '100%' }); }}
                                    className="cursor-pointer group bg-cardLight dark:bg-cardDark rounded-2xl md:rounded-3xl overflow-hidden shadow-soft dark:shadow-softDark hover:-translate-y-1 hover:shadow-lg transition-all duration-300 border border-transparent dark:border-white/5 flex flex-col"
                                >
                                <div className="relative h-32 md:h-48 overflow-hidden shrink-0">
                                    <Image src={item.image_url} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw" />
                                    <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-white/90 dark:bg-black/50 backdrop-blur-sm px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-bold z-10 shadow-sm">
                                        ฿{item.price}
                                    </div>
                                </div>
                                <div className="p-3 md:p-6 flex flex-col flex-1">
                                    <div className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-[#D97736] dark:text-pastelOrange mb-1">{getTranslatedCategory(item.category)}</div>
                                    <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-2 leading-tight">{lang === 'th' && item.name_th ? item.name_th : item.name}</h3>
                                    <p className="opacity-70 text-xs md:text-sm mb-3 md:mb-4 line-clamp-2 flex-1">{lang === 'th' && item.description_th ? item.description_th : item.description}</p>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); addToCart(item); }}
                                        className="w-full py-2 md:py-3 rounded-xl md:rounded-2xl bg-warmBg dark:bg-warmDarkBg border-2 border-pastelOrange dark:border-darkAccent font-semibold flex items-center justify-center gap-1 md:gap-2 hover:bg-pastelOrange dark:hover:bg-darkAccent hover:text-textDark dark:hover:text-textLight transition-colors active:scale-95 text-xs md:text-base mt-auto"
                                    >
                                        <i className="ph-bold ph-plus"></i> <span className="hidden sm:inline">{t('add_to_cart')}</span><span className="sm:hidden">{lang === 'th' ? 'เพิ่ม' : 'Add'}</span>
                                    </button>
                                </div>
                            </div>
                            ))
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
