import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" className="light">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <script src="https://unpkg.com/@phosphor-icons/web" async></script>
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
                darkMode: 'class',
                theme: {
                    extend: {
                        fontFamily: {
                            sans: ['Quicksand', 'sans-serif'],
                        },
                        colors: {
                            warmBg: '#FAF7F2',
                            cardLight: '#FFFFFF',
                            textDark: '#4A3B32',
                            pastelOrange: '#FFDDBF',
                            pastelOrangeHover: '#FFC899',
                            pastelGreen: '#D5ECC2',
                            warmDarkBg: '#2A2421',
                            cardDark: '#38302C',
                            textLight: '#F5EFE6',
                            darkAccent: '#D97736',
                        },
                        boxShadow: {
                            'soft': '0 10px 40px -10px rgba(74, 59, 50, 0.08)',
                            'softDark': '0 10px 40px -10px rgba(0, 0, 0, 0.3)',
                        }
                    }
                }
            }
          `
        }} />
        <style dangerouslySetInnerHTML={{
          __html: `
            body { transition: background-color 0.5s ease, color 0.5s ease; }
            ::-webkit-scrollbar { width: 6px; }
            ::-webkit-scrollbar-track { background: transparent; }
            ::-webkit-scrollbar-thumb { background: #FFDDBF; border-radius: 10px; }
            .dark ::-webkit-scrollbar-thumb { background: #D97736; }
            input[type="number"]::-webkit-inner-spin-button,
            input[type="number"]::-webkit-outer-spin-button {
                -webkit-appearance: none; margin: 0;
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(4px); }
                to { opacity: 1; transform: translateY(0); }
            }
          `
        }} />
      </Head>
      <body className="bg-warmBg text-textDark dark:bg-warmDarkBg dark:text-textLight antialiased selection:bg-pastelOrange dark:selection:bg-darkAccent selection:text-textDark">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
