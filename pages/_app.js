import { useState, useEffect, useRef, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';
import { translations } from '../utils/i18n';

const AnimatedPriceButton = ({ price, lang, isEditing, onClick }) => {
    const [displayPrice, setDisplayPrice] = useState(price);
    const [animationState, setAnimationState] = useState('none');
    const [key, setKey] = useState(0);
    const prevPriceRef = useRef(price);

    useEffect(() => {
        if (price > prevPriceRef.current) {
            setKey(prev => prev + 1);
            setAnimationState('increase');
            const timeout = setTimeout(() => setAnimationState('none'), 500);
            setDisplayPrice(price);
            prevPriceRef.current = price;
            return () => clearTimeout(timeout);
        } else if (price < prevPriceRef.current) {
            setKey(prev => prev + 1);
            setAnimationState('decrease');
            const timeout = setTimeout(() => setAnimationState('none'), 500);
            setDisplayPrice(price);
            prevPriceRef.current = price;
            return () => clearTimeout(timeout);
        } else {
            setDisplayPrice(price);
            prevPriceRef.current = price;
        }
    }, [price]);

    const fullText = `฿${displayPrice}`;
    const isDecreasing = animationState === 'decrease';
    const isIncreasing = animationState === 'increase';

    return (
        <button 
            onClick={onClick}
            className="w-full bg-pastelOrange dark:bg-darkAccent text-textDark dark:text-textLight py-4 rounded-2xl font-bold text-lg hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 overflow-hidden shadow-sm"
        >
            <i className={isEditing ? "ph-bold ph-pencil-simple" : "ph-bold ph-plus"}></i> 
            <div className={`flex transition-colors duration-300 ${isDecreasing ? 'text-red-600 dark:text-red-400' : ''}`}>
                {fullText.split('').map((char, idx) => (
                    <span 
                        key={`${key}-${idx}`} 
                        className={isIncreasing ? "inline-block animate-bounce-char" : "inline-block"} 
                        style={isIncreasing ? { animationDelay: `${idx * 0.03}s` } : {}}
                    >
                        {char === ' ' ? '\u00A0' : char}
                    </span>
                ))}
            </div>
        </button>
    );
};

export default function App({ Component, pageProps }) {
    const router = useRouter();

    // Global State
    const [isDark, setIsDark] = useState(false);
    const [lang, setLang] = useState('en');
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
    const [checkoutStep, setCheckoutStep] = useState('cart'); // cart, checkout, success, receipt
    const [tableNumber, setTableNumber] = useState('');
    const [menuItems, setMenuItems] = useState([]);
    
    const [selectedItem, setSelectedItem] = useState(null);
    const [renderedItem, setRenderedItem] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    
    useEffect(() => {
        if (selectedItem) {
            setRenderedItem(selectedItem);
            setTimeout(() => setIsModalVisible(true), 10);
        } else {
            setIsModalVisible(false);
            const timeout = setTimeout(() => setRenderedItem(null), 300);
            return () => clearTimeout(timeout);
        }
    }, [selectedItem]);
    const [itemOptions, setItemOptions] = useState({ size: 'Normal', egg: false, sweetness: '100%', sauce: 'Karaage', specialInstructions: '', spicyLevel: 0, misoSoup: false });
    const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [isExploding, setIsExploding] = useState(false);
    const [explosionKey, setExplosionKey] = useState(0);

    const explosionParticles = useMemo(() => {
        return Array.from({ length: 40 }).map((_, i) => {
            const angle = Math.random() * Math.PI * 2;
            const velocity = 150 + Math.random() * 250; 
            return {
                id: i,
                tx: Math.cos(angle) * velocity,
                ty: Math.sin(angle) * velocity,
                rot: (Math.random() - 0.5) * 720,
                size: 10 + Math.random() * 25,
                isRed: Math.random() > 0.5,
                delay: Math.random() * 0.1,
                duration: 0.5 + Math.random() * 0.3
            };
        });
    }, [explosionKey]);

    const [isShaking, setIsShaking] = useState(false);
    const [shakeLevel, setShakeLevel] = useState(0);
    const [loginEmail, setLoginEmail] = useState('');
    const [disableAnimations, setDisableAnimations] = useState(false);
    const [loginPassword, setLoginPassword] = useState('');
    const [signupName, setSignupName] = useState('');
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [isUploadingPortrait, setIsUploadingPortrait] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [editNameValue, setEditNameValue] = useState('');
    
    // Cropping State
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [photoURL, setPhotoURL] = useState('');
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    
    const [lastOrder, setLastOrder] = useState(null);
    const [pageOpacity, setPageOpacity] = useState('opacity-100');

    // Page Transition
    useEffect(() => {
        const handleStart = () => setPageOpacity('opacity-0');
        const handleComplete = () => setTimeout(() => setPageOpacity('opacity-100'), 50);

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleComplete);
        };
    }, [router]);

    // Fetch Menu
    useEffect(() => {
        // Load persistents
        const savedDark = localStorage.getItem('darkMode');
        if (savedDark) setIsDark(JSON.parse(savedDark));
        const savedLang = localStorage.getItem('lang');
        if (savedLang) setLang(savedLang);
        const savedDisableAnimations = localStorage.getItem('disableAnimations');
        if (savedDisableAnimations) setDisableAnimations(JSON.parse(savedDisableAnimations));
        const savedUser = localStorage.getItem('authUser');
        if (savedUser) setUser(JSON.parse(savedUser));

        fetch('/api/menu')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setMenuItems(data);
                } else {
                    console.error('Failed to fetch menu from DB:', data);
                    setMenuItems([]);
                }
            })
            .catch(err => console.error('Failed to fetch menu:', err));
    }, []);

    // Toggle Dark Mode
    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    useEffect(() => {
        if (disableAnimations) {
            document.body.classList.add('disable-animations');
        } else {
            document.body.classList.remove('disable-animations');
        }
    }, [disableAnimations]);

    const toggleDarkMode = () => {
        const newDark = !isDark;
        setIsDark(newDark);
        localStorage.setItem('darkMode', newDark);
        
        if (user) {
            // Save preference to database silently in the background
            fetch('/api/update-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: user.email, 
                    preferences: { ...user.preferences, darkMode: newDark } 
                })
            })
            .then(res => {
                if(res.ok) res.json().then(updatedUser => setUser(prev => {
                    const merged = { ...prev, ...updatedUser };
                    localStorage.setItem('authUser', JSON.stringify(merged));
                    return merged;
                }));
            })
            .catch(err => console.error("Failed to sync preference:", err));
        }
    };

    // Translation Function
    const t = (key) => translations[lang][key] || key;

    const toggleLanguage = () => {
        const nextLang = lang === 'en' ? 'th' : 'en';
        setLang(nextLang);
        localStorage.setItem('lang', nextLang);
        
        if (user) {
            // Save preference to database silently in the background
            fetch('/api/update-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: user.email, 
                    preferences: { ...user.preferences, language: nextLang } 
                })
            })
            .then(res => {
                if(res.ok) res.json().then(updatedUser => setUser(prev => {
                    const merged = { ...prev, ...updatedUser };
                    localStorage.setItem('authUser', JSON.stringify(merged));
                    return merged;
                }));
            })
            .catch(err => console.error("Failed to sync language preference:", err));
        }
    };

    const toggleDisableAnimations = () => {
        const nextVal = !disableAnimations;
        setDisableAnimations(nextVal);
        localStorage.setItem('disableAnimations', nextVal);
        if (user) {
            fetch('/api/update-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: user.email, 
                    preferences: { ...user.preferences, disableAnimations: nextVal } 
                })
            })
            .then(res => {
                if(res.ok) res.json().then(updatedUser => setUser(prev => {
                    const merged = { ...prev, ...updatedUser };
                    localStorage.setItem('authUser', JSON.stringify(merged));
                    return merged;
                }));
            })
            .catch(err => console.error("Failed to sync disableAnimations:", err));
        }
    };

    // Cart Logic
    const addToCart = (item, options = null, editingCartItemId = null) => {
        let finalPrice = item.price;
        let optionText = '';
        let optionTextTh = '';
        
        if (options) {
            if (item.category === 'Ramen') {
                if (options.size === 'Special') {
                    finalPrice += 15;
                    optionText += 'Special Size';
                    optionTextTh += 'พิเศษ';
                } else {
                    optionText += 'Normal Size';
                    optionTextTh += 'ธรรมดา';
                }
            } else if (item.category === 'Sides') {
                if (options.size === 'Super Special') {
                    finalPrice += 10;
                    optionText += 'Super Special Size';
                    optionTextTh += 'โคตรพิเศษ';
                } else if (options.size === 'Special') {
                    finalPrice += 5;
                    optionText += 'Special Size';
                    optionTextTh += 'พิเศษ';
                } else {
                    optionText += 'Normal Size';
                    optionTextTh += 'ธรรมดา';
                }
            }
            if (options.egg && item.category === 'Ramen') {
                finalPrice += 15;
                optionText += optionText ? ', Add Egg' : 'Add Egg';
                optionTextTh += optionTextTh ? ', เพิ่มไข่' : 'เพิ่มไข่';
            }
            if (options.misoSoup && item.name === 'Tsukemen Dipping Noodles') {
                finalPrice += 20;
                optionText += optionText ? ', Miso Soup' : 'Miso Soup';
                optionTextTh += optionTextTh ? ', ซุปมิโซะ' : 'ซุปมิโซะ';
            }
            if (item.category === 'Drinks' && options.sweetness) {
                optionText += optionText ? `, ${options.sweetness} Sweet` : `${options.sweetness} Sweet`;
                optionTextTh += optionTextTh ? `, หวาน ${options.sweetness}` : `หวาน ${options.sweetness}`;
            }
            if (item.name === 'Karaage Chicken' && options.sauce) {
                optionText += optionText ? `, ${options.sauce} Sauce` : `${options.sauce} Sauce`;
                const sauceTh = options.sauce === 'Karaage' ? 'ซอสคาราเกะ' : (options.sauce === 'Ketchup' ? 'ซอสมะเขือเทศ' : 'ซาวร์ครีม');
                optionTextTh += optionTextTh ? `, ${sauceTh}` : `${sauceTh}`;
            }
            if (options.spicyLevel !== undefined && item.isSpicy) {
                if (options.spicyLevel === 5) {
                    finalPrice += 10;
                } else if (options.spicyLevel >= 3) {
                    finalPrice += 5;
                }
                const spicyLabelEn = options.spicyLevel === 0 ? 'No Spicy' : `Spicy Lv.${options.spicyLevel}`;
                const spicyLabelTh = options.spicyLevel === 0 ? 'ไม่เผ็ด' : `เผ็ดระดับ ${options.spicyLevel}`;
                optionText += optionText ? `, ${spicyLabelEn}` : `${spicyLabelEn}`;
                optionTextTh += optionTextTh ? `, ${spicyLabelTh}` : `${spicyLabelTh}`;
            }
        }

        const cartItemId = item._id + (optionText ? `-${optionText}` : '-Default') + (options?.specialInstructions ? `-${options.specialInstructions}` : '');
        const displayName = optionText ? `${item.name} (${optionText})` : item.name;
        const displayNameTh = item.name_th ? (optionTextTh ? `${item.name_th} (${optionTextTh})` : item.name_th) : displayName;

        setCart(prev => {
            let nextCart = [...prev];
            
            if (editingCartItemId) {
                const oldItemIndex = nextCart.findIndex(i => i.cartItemId === editingCartItemId);
                const oldQty = oldItemIndex !== -1 ? nextCart[oldItemIndex].qty : 1;
                
                if (oldItemIndex !== -1) {
                    nextCart.splice(oldItemIndex, 1);
                }
                
                const existing = nextCart.find(i => i.cartItemId === cartItemId);
                if (existing) {
                    existing.qty += oldQty;
                } else {
                    nextCart.push({ ...item, cartItemId, name: displayName, name_th: displayNameTh, price: finalPrice, qty: oldQty, options });
                }
                return nextCart;
            } else {
                const existing = nextCart.find(i => i.cartItemId === cartItemId);
                if (existing) {
                    if (existing.qty >= 99) return prev;
                    return nextCart.map(i => i.cartItemId === cartItemId ? { ...i, qty: i.qty + 1 } : i);
                }
                
                if (prev.length === 0) {
                    setTimeout(() => setIsCartOpen(true), 10);
                }
                
                return [...nextCart, { ...item, cartItemId, name: displayName, name_th: displayNameTh, price: finalPrice, qty: 1, options }];
            }
        });
        
        setSelectedItem(null);
    };

    const updateQty = (cartItemId, delta) => {
        setCart(prev => prev.map(i => {
            if (i.cartItemId === cartItemId) {
                const newQty = i.qty + delta;
                if (newQty > 99) return { ...i, qty: 99 };
                return newQty > 0 ? { ...i, qty: newQty } : i;
            }
            return i;
        }).filter(i => i.qty > 0));
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

    const validateEmail = (email) => {
        if (!email || email.length < 5 || email.length > 50) return 'ERR_EMAIL_LENGTH';
        if (email.includes(' ')) return 'ERR_EMAIL_SPACE';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return 'ERR_EMAIL_FORMAT';
        return null;
    };

    const validatePassword = (pwd) => {
        if (!pwd) return 'ERR_PWD_EMPTY';
        if (pwd.length < 4 || pwd.length > 12) return 'ERR_PWD_LENGTH';
        if (pwd.includes(' ')) return 'ERR_PWD_SPACE';
        const validCharsRegex = /^[a-zA-Z0-9.\-_@]+$/;
        if (!validCharsRegex.test(pwd)) return 'ERR_PWD_INVALID_CHARS';
        const numberRegex = /[0-9]/;
        if (!numberRegex.test(pwd)) return 'ERR_PWD_NO_NUMBER';
        return null;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        
        const emailErr = validateEmail(loginEmail);
        if (emailErr) {
            if (isLoginMode) {
                alert(lang === 'th' ? `ข้อมูลผิดพลาด: กรุณากรอก email ให้ถูกต้อง [${emailErr}]` : `Something wrong: please write down email correctly [${emailErr}]`);
            } else {
                alert(lang === 'th' ? `ข้อมูลผิดพลาด: กรุณากรอก email [${emailErr}]` : `Error: Please write down email correctly [${emailErr}]`);
            }
            return;
        }

        const pwdErr = validatePassword(loginPassword);
        if (pwdErr) {
            alert(lang === 'th' ? `รหัสผ่านไม่ถูกต้องตามเงื่อนไข (ยาว 4-12 ตัว, ต้องเป็นภาษาอังกฤษ มีตัวเลข ห้ามเว้นวรรค และใช้ได้แค่ @ . _ -) [${pwdErr}]` : `Invalid password format (4-12 chars, A-Z, a-z, at least 1 number, no spaces, only @ . _ - allowed) [${pwdErr}]`);
            return;
        }

        try {
            const endpoint = isLoginMode ? '/api/login' : '/api/signup';
            const body = isLoginMode 
                ? { identifier: loginEmail, password: loginPassword }
                : { email: loginEmail, password: loginPassword, name: "New User" };
                
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            
            if (res.ok) {
                const userData = await res.json();
                setUser(userData);
                if (userData.preferences?.darkMode !== undefined) {
                    setIsDark(userData.preferences.darkMode);
                    localStorage.setItem('darkMode', userData.preferences.darkMode);
                }
                if (userData.preferences?.language) {
                    setLang(userData.preferences.language);
                    localStorage.setItem('lang', userData.preferences.language);
                }
                if (userData.preferences?.disableAnimations !== undefined) {
                    setDisableAnimations(userData.preferences.disableAnimations);
                    localStorage.setItem('disableAnimations', userData.preferences.disableAnimations);
                }
                localStorage.setItem('authUser', JSON.stringify(userData));
                setIsUserPanelOpen(false);
                setLoginPassword(''); // clear password for safety
            } else {
                const errorData = await res.json();
                alert((errorData.error || 'Invalid credentials.') + (errorData.code ? ` [${errorData.code}]` : ''));
            }
        } catch (error) {
            console.error('Auth error:', error);
            alert('Something went wrong. Please try again.');
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setPhotoURL(url);
        setCropModalOpen(true);
        // Reset file input so they can pick the same file again if they cancel
        e.target.value = '';
    };

    const handleCropComplete = async () => {
        if (!user) return;
        setIsUploadingPortrait(true);
        setCropModalOpen(false);
        
        try {
            const croppedBlob = await getCroppedImg(photoURL, croppedAreaPixels);
            const file = new File([croppedBlob], "profile.jpg", { type: "image/jpeg" });
            
            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
            const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    
            if (!cloudName || !uploadPreset) {
                alert('Cloudinary is not configured yet! Please check PROJECT_SUMMARY.md for setup instructions.');
                setIsUploadingPortrait(false);
                return;
            }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formData
            });
            const data = await res.json();
            
            if (data.secure_url) {
                const updateRes = await fetch('/api/update-profile', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: user.email, portrait_url: data.secure_url })
                });
                if (updateRes.ok) {
                    const updatedUser = await updateRes.json();
                    setUser(prev => ({ ...prev, ...updatedUser }));
                } else {
                    console.error("Update failed:", await updateRes.text());
                    alert("Failed to update profile locally.");
                }
            } else {
                alert('Upload failed: ' + (data.error?.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Portrait upload error:', error);
            alert('Upload failed. Check console for details.');
        } finally {
            setIsUploadingPortrait(false);
        }
    };

    const handleNameUpdate = async () => {
        if (!editNameValue.trim() || editNameValue === user?.name) {
            setIsEditingName(false);
            return;
        }
        try {
            const updateRes = await fetch('/api/update-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, name: editNameValue.trim() })
            });
            if (updateRes.ok) {
                const updatedUser = await updateRes.json();
                setUser(prev => ({ ...prev, ...updatedUser }));
            }
        } catch (e) {
            console.error('Name update error:', e);
        }
        setIsEditingName(false);
    };

    const handleCheckoutSubmit = async (e) => {
        e.preventDefault();
        if (!tableNumber) return;
        
        const orderData = {
            table_number: tableNumber,
            items: cart.map(item => ({
                menu_item_id: item._id,
                name: item.name,
                price_per_unit: item.price,
                quantity: item.qty,
                subtotal: item.price * item.qty,
                special_instructions: item.options?.specialInstructions || ''
            })),
            total_amount: cartTotal
        };

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });
            const data = await res.json();
            
            setLastOrder({
                id: data._id || 'ORD-' + Math.floor(1000 + Math.random() * 9000),
                items: [...cart],
                total: cartTotal,
                table: tableNumber,
                time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
            });
            
            setCheckoutStep('success');
            setTimeout(() => {
                setCheckoutStep('receipt');
                setCart([]);
                setTableNumber('');
            }, 2000);
        } catch (error) {
            console.error('Checkout failed', error);
        }
    };

    const handleCloseReceipt = () => {
        setIsCartOpen(false);
        setTimeout(() => {
            setCheckoutStep('cart');
            setLastOrder(null);
        }, 300);
    };

    const itemToRender = selectedItem || renderedItem;
    let currentModalPrice = 0;
    if (itemToRender) {
        currentModalPrice = itemToRender.price;
        if (itemToRender.category === 'Ramen') {
            if (itemOptions.size === 'Special') currentModalPrice += 15;
            if (itemOptions.egg) currentModalPrice += 15;
            if (itemOptions.misoSoup && itemToRender.name === 'Tsukemen Dipping Noodles') {
                currentModalPrice += 20;
            }
        } else if (itemToRender.category === 'Sides') {
            if (itemOptions.size === 'Super Special') currentModalPrice += 10;
            else if (itemOptions.size === 'Special') currentModalPrice += 5;
        }
        if (itemOptions.spicyLevel === 5 && itemToRender.isSpicy) {
            currentModalPrice += 10;
        } else if (itemOptions.spicyLevel >= 3 && itemToRender.isSpicy) {
            currentModalPrice += 5;
        }
    }

    return (
        <div className="min-h-screen relative pb-24 md:pb-0">
            <Head>
                <title>Ramen Aroy | Cozy Ordering</title>
            </Head>
            <style jsx global>{`
                .disable-animations *, .disable-animations *::before, .disable-animations *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                    scroll-behavior: auto !important;
                }
                
                .animate-shake-1 { animation: shake1 0.4s ease-in-out; }
                .animate-shake-2 { animation: shake2 0.4s ease-in-out; }
                .animate-shake-3 { animation: shake3 0.4s ease-in-out; }
                .animate-shake-4 { animation: shake4 0.4s ease-in-out; }
                .animate-shake-5 { animation: shake5 0.5s ease-in-out; }
                @keyframes shake1 { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-2px); } 75% { transform: translateX(2px); } }
                @keyframes shake2 { 0%, 100% { transform: translateX(0) rotate(0); } 25% { transform: translateX(-4px) rotate(-1deg); } 75% { transform: translateX(4px) rotate(1deg); } }
                @keyframes shake3 { 0%, 100% { transform: translateX(0) rotate(0); } 20%, 60% { transform: translateX(-6px) rotate(-2deg); } 40%, 80% { transform: translateX(6px) rotate(2deg); } }
                @keyframes shake4 { 0%, 100% { transform: translateX(0) rotate(0) translateY(0); } 16%, 50%, 83% { transform: translateX(-10px) rotate(-3deg) translateY(-1px); } 33%, 66% { transform: translateX(10px) rotate(3deg) translateY(1px); } }
                @keyframes shake5 { 0%, 100% { transform: translateX(0) rotate(0) translateY(0) scale(1); } 12%, 37%, 62%, 87% { transform: translateX(-15px) rotate(-5deg) translateY(-2px) scale(1.02); } 25%, 50%, 75% { transform: translateX(15px) rotate(5deg) translateY(2px) scale(1.02); } }
                
                @keyframes explode-cube {
                    0% { transform: translate(0, 0) rotate(0deg) scale(0); opacity: 1; }
                    20% { transform: translate(calc(var(--tx) * 0.2), calc(var(--ty) * 0.2)) rotate(calc(var(--rot) * 0.2)) scale(1); opacity: 1; }
                    100% { transform: translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(0.5); opacity: 0; }
                }
                .animate-explode-cube { animation: explode-cube linear forwards; }
                
                @keyframes pulse-flash {
                    0% { transform: scale(0); opacity: 0.8; }
                    100% { transform: scale(2); opacity: 0; }
                }
                .animate-pulse-flash { animation: pulse-flash 0.5s ease-out forwards; }
                
                @keyframes bounce-char {
                    0% { transform: translateY(0); }
                    30% { transform: translateY(-5px); }
                    50% { transform: translateY(0); }
                    70% { transform: translateY(-2px); }
                    100% { transform: translateY(0); }
                }
                .animate-bounce-char {
                    animation: bounce-char 0.5s ease-in-out forwards;
                }
                
                @keyframes slide-up-fade {
                    0% { transform: translateY(15px); opacity: 0; }
                    100% { transform: translateY(0); opacity: 1; }
                }
                .animate-slide-up-fade {
                    animation: slide-up-fade 0.3s ease-out forwards;
                }
            `}</style>
            {/* Top Navigation (PC Only) */}
            <nav className="hidden md:flex sticky top-0 z-40 backdrop-blur-md bg-warmBg/80 dark:bg-warmDarkBg/80 border-b border-pastelOrange/20 dark:border-white/5 transition-colors duration-500">
                <div className="max-w-6xl w-full mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <i className="ph-fill ph-bowl-food text-3xl text-pastelOrangeDark dark:text-pastelOrange"></i>
                            <span className="text-xl font-bold tracking-tight">Ramen Aroy</span>
                        </Link>
                        <div className="flex gap-6 font-bold text-sm">
                            <Link href="/" className={`hover:text-pastelOrangeDark dark:hover:text-pastelOrangeDark dark:hover:text-pastelOrange transition-colors ${router.pathname === '/' ? 'text-pastelOrangeDark dark:text-pastelOrange' : 'opacity-70'}`}>{t('home')}</Link>
                            <Link href="/menu" className={`hover:text-pastelOrangeDark dark:hover:text-pastelOrangeDark dark:hover:text-pastelOrange transition-colors ${router.pathname === '/menu' ? 'text-pastelOrangeDark dark:text-pastelOrange' : 'opacity-70'}`}>{t('menu')}</Link>
                            {user?.role === 'kitchen' && (
                                <Link href="/kitchen" className={`hover:text-pastelOrangeDark dark:hover:text-pastelOrangeDark dark:hover:text-pastelOrange transition-colors ${router.pathname === '/kitchen' ? 'text-pastelOrangeDark dark:text-pastelOrange' : 'opacity-70'}`}>{t('kitchen')}</Link>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={toggleLanguage}
                            className="p-2 font-bold text-sm hover:bg-pastelOrange/20 dark:hover:bg-white/10 rounded-lg transition-colors"
                        >
                            {lang.toUpperCase()}
                        </button>
                        
                        <button 
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full hover:bg-pastelOrange/20 dark:hover:bg-white/10 transition-colors"
                        >
                            {isDark ? <i className="ph-fill ph-sun text-xl text-pastelOrange"></i> : <i className="ph-fill ph-moon text-xl text-textDark"></i>}
                        </button>
                        
                        <button 
                            onClick={() => setIsUserPanelOpen(true)}
                            className="p-2 rounded-full hover:bg-pastelOrange/20 dark:hover:bg-white/10 transition-colors"
                        >
                            <i className="ph-fill ph-user-circle text-2xl text-textDark dark:text-textLight"></i>
                        </button>
                        
                        <button 
                            onClick={() => setIsCartOpen(true)}
                            className="flex items-center gap-2 bg-pastelOrange dark:bg-darkAccent text-textDark dark:text-textLight px-4 py-2 rounded-full font-semibold hover:opacity-90 transition-all shadow-sm active:scale-95"
                        >
                            <i className="ph-bold ph-shopping-bag text-lg"></i>
                            <span>{cartCount} Items</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Top Bar (Just Logo & Theme Toggle) */}
            <nav className="md:hidden sticky top-0 z-40 backdrop-blur-md bg-warmBg/80 dark:bg-warmDarkBg/80 border-b border-pastelOrange/20 dark:border-white/5 transition-colors duration-500">
                <div className="px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <i className="ph-fill ph-bowl-food text-3xl text-pastelOrangeDark dark:text-pastelOrange"></i>
                        <span className="text-xl font-bold tracking-tight">Ramen Aroy</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={toggleLanguage}
                            className="p-2 font-bold text-sm hover:bg-pastelOrange/20 dark:hover:bg-white/10 rounded-lg transition-colors"
                        >
                            {lang.toUpperCase()}
                        </button>
                        <button 
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full hover:bg-pastelOrange/20 dark:hover:bg-white/10 transition-colors"
                        >
                            {isDark ? <i className="ph-fill ph-sun text-xl text-pastelOrange"></i> : <i className="ph-fill ph-moon text-xl text-textDark"></i>}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Page Content */}
            <div className={`transition-opacity duration-300 ease-in-out ${pageOpacity}`}>
                <Component 
                    {...pageProps} 
                    menuItems={menuItems} 
                    addToCart={addToCart} 
                    lang={lang}
                    t={t}
                    toggleLanguage={toggleLanguage}
                    setSelectedItem={setSelectedItem}
                    setItemOptions={setItemOptions}
                />
            </div>

            {/* Mobile Floating Cart Button (Pill) */}
            <div className={`md:hidden fixed z-30 w-[90%] max-w-sm left-1/2 -translate-x-1/2 transition-all duration-500 ease-out ${cartCount > 0 && !isCartOpen ? 'bottom-20 opacity-100' : '-bottom-20 opacity-0 pointer-events-none'}`}>
                <button 
                    onClick={() => setIsCartOpen(true)}
                    className="w-full bg-pastelOrange dark:bg-darkAccent text-textDark dark:text-textLight px-6 py-4 rounded-3xl font-bold text-lg shadow-lg shadow-pastelOrange/30 dark:shadow-black/50 flex items-center justify-between active:scale-95 transition-transform"
                >
                    <span className="flex items-center gap-2">
                        <i className="ph-fill ph-shopping-bag text-2xl"></i>
                        {lang === 'th' ? 'ดูรายการสั่งอาหาร' : 'View Order'}
                    </span>
                    <span>฿{cartTotal}</span>
                </button>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-cardLight/90 dark:bg-cardDark/90 backdrop-blur-lg border-t border-pastelOrange/20 dark:border-white/5 z-40 pb-safe">
                <div className="flex justify-around items-center h-16">
                    <Link href="/" className={`flex flex-col items-center gap-1 p-2 transition-colors ${router.pathname === '/' ? 'text-pastelOrangeDark dark:text-pastelOrange bg-pastelOrange/20 dark:bg-pastelOrange/10 rounded-2xl' : 'text-textDark/40 dark:text-textLight/40 hover:text-pastelOrangeDark dark:hover:text-pastelOrange'}`}>
                        <i className="ph-fill ph-house text-2xl"></i>
                        <span className="text-[10px] font-bold tracking-wider">{lang === 'th' ? 'หน้าแรก' : 'Home'}</span>
                    </Link>
                    <Link href="/menu" className={`flex flex-col items-center gap-1 p-2 transition-colors ${router.pathname === '/menu' ? 'text-pastelOrangeDark dark:text-pastelOrange bg-pastelOrange/20 dark:bg-pastelOrange/10 rounded-2xl' : 'text-textDark/40 dark:text-textLight/40 hover:text-pastelOrangeDark dark:hover:text-pastelOrange'}`}>
                        <i className="ph-fill ph-magnifying-glass text-2xl"></i>
                        <span className="text-[10px] font-bold tracking-wider">{lang === 'th' ? 'เมนู' : 'Menu'}</span>
                    </Link>
                    <button onClick={() => setIsUserPanelOpen(true)} className="flex flex-col items-center gap-1 p-2 text-textDark/40 dark:text-textLight/40 hover:text-pastelOrangeDark dark:hover:text-pastelOrange transition-colors">
                        <i className="ph-fill ph-user text-2xl"></i>
                        <span className="text-[10px] font-bold tracking-wider">{lang === 'th' ? 'โปรไฟล์' : 'Profile'}</span>
                    </button>
                    <button onClick={() => setIsCartOpen(true)} className="relative flex flex-col items-center gap-1 p-2 text-textDark/40 dark:text-textLight/40 hover:text-pastelOrangeDark dark:hover:text-pastelOrange transition-colors">
                        <i className="ph-fill ph-shopping-bag text-2xl"></i>
                        <span className="text-[10px] font-bold tracking-wider">{lang === 'th' ? 'ตะกร้า' : 'Cart'}</span>
                        {cartCount > 0 && (
                            <div className="absolute top-1 right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-cardLight dark:border-cardDark shadow-sm">
                                {cartCount}
                            </div>
                        )}
                    </button>
                </div>
            </div>

            {/* Cart Modal Overlay */}
            <div className={`fixed inset-0 bg-textDark/20 dark:bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                {/* Slide-in Panel */}
                <div className={`absolute bottom-0 md:top-0 md:bottom-auto md:right-0 w-full md:w-[450px] h-[85vh] md:h-screen bg-cardLight dark:bg-cardDark md:rounded-l-3xl rounded-t-3xl md:rounded-tr-none shadow-2xl flex flex-col transition-transform duration-500 ease-out ${isCartOpen ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-y-0 md:translate-x-full'}`}>
                    
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-warmBg dark:border-white/5">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold">
                                {checkoutStep === 'cart' ? 'Your Order' : checkoutStep === 'checkout' ? 'Checkout' : checkoutStep === 'receipt' ? 'Digital Receipt' : ''}
                            </h2>
                        </div>
                        <button onClick={() => { setIsCartOpen(false); setTimeout(() => setCheckoutStep('cart'), 300); }} className="p-2 bg-warmBg dark:bg-warmDarkBg rounded-full hover:scale-110 transition-transform">
                            <i className="ph-bold ph-x text-xl"></i>
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {cart.length === 0 && checkoutStep === 'cart' ? (
                            <div className="h-full flex flex-col items-center justify-center opacity-50 space-y-4">
                                <i className="ph-thin ph-shopping-bag text-6xl"></i>
                                <p>Your comfy cart is empty.</p>
                            </div>
                        ) : checkoutStep === 'cart' ? (
                            <div className="space-y-6">
                                {cart.map(item => (
                                    <div key={item._id} className="flex gap-4">
                                        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                                            <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="80px" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between">
                                                <h4 className="font-bold">{lang === 'th' && item.name_th ? item.name_th : item.name}</h4>
                                                <button onClick={() => {
                                                    const baseItem = menuItems.find(m => m._id === item._id);
                                                    if(baseItem) {
                                                        if (item.options) {
                                                            setItemOptions(item.options);
                                                        } else {
                                                            setItemOptions({ size: 'Normal', egg: false, sweetness: '100%', sauce: 'Karaage', specialInstructions: '', spicyLevel: 0, misoSoup: false });
                                                        }
                                                        setSelectedItem({...baseItem, isEditingCartItemId: item.cartItemId});
                                                    }
                                                }} className="p-1.5 -mt-1 -mr-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#D97736] dark:text-pastelOrange transition-colors">
                                                    <i className="ph-bold ph-pencil-simple text-sm"></i>
                                                </button>
                                            </div>
                                            <p className="text-[#D97736] dark:text-pastelOrange font-semibold">฿{item.price}</p>
                                            <div className="flex items-center gap-3 mt-2 bg-warmBg dark:bg-warmDarkBg w-fit rounded-full px-2 py-1">
                                                <button onClick={() => updateQty(item.cartItemId, -1)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-white/10 transition-colors"><i className="ph-bold ph-minus"></i></button>
                                                <span className="font-bold text-sm w-4 text-center">{item.qty}</span>
                                                <button onClick={() => updateQty(item.cartItemId, 1)} disabled={item.qty >= 99} className={`w-6 h-6 flex items-center justify-center rounded-full transition-colors ${item.qty >= 99 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white dark:hover:bg-white/10'}`}><i className="ph-bold ph-plus"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : checkoutStep === 'checkout' ? (
                            <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-6 animate-fade-in">
                                <div>
                                    <label className="block text-sm font-bold mb-2 opacity-80">Enter Your Table Number <span className="text-red-500">*</span></label>
                                    <input 
                                        type="number" 
                                        required 
                                        value={tableNumber}
                                        onChange={(e) => setTableNumber(e.target.value)}
                                        placeholder="e.g. 12" 
                                        className="w-full bg-warmBg dark:bg-warmDarkBg px-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-pastelOrangeDark dark:focus:ring-pastelOrange outline-none transition-all" 
                                    />
                                </div>
                                <div className="p-4 bg-pastelOrange/20 dark:bg-pastelOrange/10 rounded-2xl text-center">
                                    <p className="text-sm font-semibold mb-2">Payment Transfer</p>
                                    <div className="aspect-square w-32 mx-auto bg-white rounded-xl flex items-center justify-center shadow-sm">
                                        <i className="ph-thin ph-qr-code text-6xl text-textDark"></i>
                                    </div>
                                    <p className="text-xs mt-2 opacity-70">Scan to pay ฿{cartTotal}</p>
                                </div>
                            </form>
                        ) : checkoutStep === 'success' ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 animate-fade-in">
                                <div className="w-20 h-20 bg-pastelGreen text-[#4A3B32] rounded-full flex items-center justify-center mb-4">
                                    <i className="ph-bold ph-check text-4xl"></i>
                                </div>
                                <h3 className="text-2xl font-bold">Order Received!</h3>
                                <p className="opacity-70">Generating your digital receipt...</p>
                            </div>
                        ) : checkoutStep === 'receipt' && lastOrder ? (
                            <div className="h-full flex flex-col items-center animate-fade-in py-4">
                                <div className="w-full bg-white dark:bg-cardLight/10 rounded-xl border-t-4 border-dashed border-pastelOrange dark:border-darkAccent p-6 shadow-sm relative">
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cardLight dark:bg-cardDark px-4 text-xs font-bold uppercase tracking-widest opacity-50 rounded-full">Receipt</div>
                                    <div className="text-center mb-6 mt-2">
                                        <h3 className="text-xl font-bold">Ramen Aroy</h3>
                                        <p className="text-sm opacity-70">Order #{lastOrder.id}</p>
                                        <p className="text-sm opacity-70">Table {lastOrder.table} • {lastOrder.time}</p>
                                    </div>
                                    <div className="space-y-3 mb-6 border-t border-b border-gray-100 dark:border-white/10 py-4">
                                        {lastOrder.items.map(item => (
                                            <div key={item._id} className="flex justify-between text-sm">
                                                <span>{item.qty}x {item.name}</span>
                                                <span>฿{item.price * item.qty}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between items-center font-bold text-lg">
                                        <span>Total Paid</span>
                                        <span className="text-[#D97736] dark:text-pastelOrange">฿{lastOrder.total}</span>
                                    </div>
                                </div>
                                <button onClick={handleCloseReceipt} className="mt-6 w-full py-4 rounded-2xl bg-textDark dark:bg-textLight text-white dark:text-textDark font-bold text-lg hover:opacity-90 active:scale-95 transition-all">
                                    Done
                                </button>
                            </div>
                        ) : null}
                    </div>

                    {/* Footer / Actions */}
                    {cart.length > 0 && checkoutStep !== 'success' && checkoutStep !== 'receipt' && (
                        <div className="p-6 border-t border-warmBg dark:border-white/5 bg-cardLight dark:bg-cardDark">
                            <div className="flex justify-between items-center mb-4 text-lg">
                                <span className="opacity-70 font-semibold">Total</span>
                                <span className="text-2xl font-bold">฿{cartTotal}</span>
                            </div>
                            {checkoutStep === 'cart' ? (
                                <>
                                    <button 
                                        onClick={() => setCheckoutStep('checkout')}
                                        className="w-full bg-textDark dark:bg-textLight text-white dark:text-textDark py-4 rounded-2xl font-bold text-lg hover:opacity-90 active:scale-95 transition-all"
                                    >
                                        Proceed to Checkout
                                    </button>
                                    <button 
                                        onClick={() => setIsClearConfirmOpen(true)}
                                        className="w-full mt-3 py-4 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-2xl font-bold text-lg hover:bg-red-100 dark:hover:bg-red-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                                    >
                                        <i className="ph-bold ph-trash"></i> Clear Everything
                                    </button>
                                </>
                            ) : (
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => setCheckoutStep('cart')}
                                        className="w-1/3 bg-warmBg dark:bg-warmDarkBg py-4 rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95 transition-all"
                                    >
                                        Back
                                    </button>
                                    <button 
                                        type="submit"
                                        form="checkout-form"
                                        className="w-2/3 bg-pastelOrange dark:bg-darkAccent text-textDark dark:text-textLight py-4 rounded-2xl font-bold text-lg hover:opacity-90 active:scale-95 transition-all flex justify-center items-center gap-2"
                                    >
                                        <i className="ph-bold ph-check-circle"></i> Confirm Order
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Clear Confirmation Slide-up */}
                <div className={`absolute bottom-0 md:top-auto md:bottom-0 md:right-0 w-full md:w-[450px] bg-cardLight dark:bg-cardDark rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-[60] transition-transform duration-300 ease-out flex flex-col ${isClearConfirmOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                    <div className="p-6 text-center border-t border-warmBg dark:border-white/5 pb-8">
                        <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6"></div>
                        <h3 className="text-2xl font-bold mb-2 text-textDark dark:text-textLight">Are you sure?</h3>
                        <p className="opacity-70 mb-8 text-textDark dark:text-textLight">This will empty your cart completely.</p>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setIsClearConfirmOpen(false)}
                                className="w-1/2 py-4 rounded-2xl font-bold text-lg bg-warmBg dark:bg-warmDarkBg hover:opacity-80 transition-all active:scale-95 text-textDark dark:text-textLight"
                            >
                                Nevermind
                            </button>
                            <button 
                                onClick={() => { setCart([]); setIsClearConfirmOpen(false); setCheckoutStep('cart'); }}
                                className="w-1/2 py-4 rounded-2xl font-bold text-lg bg-red-500 text-white hover:bg-red-600 transition-all active:scale-95"
                            >
                                Yes!
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* User Panel (Mocked to Real Auth) */}
            <div className={`fixed inset-0 bg-textDark/20 dark:bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${isUserPanelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className={`absolute top-0 left-0 w-full md:w-[400px] h-screen bg-cardLight dark:bg-cardDark md:rounded-r-3xl shadow-2xl flex flex-col transition-transform duration-500 ease-out ${isUserPanelOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="flex items-center justify-between p-6 border-b border-warmBg dark:border-white/5">
                        <h2 className="text-2xl font-bold">{user ? (lang === 'th' ? 'โปรไฟล์ของฉัน' : 'My Profile') : (isLoginMode ? (lang === 'th' ? 'ยินดีต้อนรับกลับ' : 'Welcome Back') : (lang === 'th' ? 'สร้างบัญชี' : 'Create Account'))}</h2>
                        <button onClick={() => setIsUserPanelOpen(false)} className="p-2 bg-warmBg dark:bg-warmDarkBg rounded-full hover:scale-110 transition-transform">
                            <i className="ph-bold ph-x text-xl"></i>
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6">
                        {!user ? (
                            <form key={isLoginMode ? 'login' : 'register'} onSubmit={handleLogin} className="space-y-4 animate-slide-up-fade">
                                <p className="text-center opacity-70 mb-8">{isLoginMode ? (lang === 'th' ? 'เข้าสู่ระบบเพื่อสั่งอาหารได้อย่างรวดเร็ว' : 'Sign in for fast checkout.') : (lang === 'th' ? 'เข้าร่วมกับเราเพื่อประสบการณ์แสนอบอุ่น' : 'Join us for a cozy experience.')}</p>
                                
                                <div className="text-xs opacity-70 mb-4 bg-warmBg dark:bg-warmDarkBg p-3 rounded-xl space-y-1">
                                    <p><strong>Email:</strong> {lang === 'th' ? 'เช่น xxx@xxmail.xxx (ต้องมี @ และโดเมน ห้ามเว้นวรรค)' : 'e.g. xxx@xxmail.xxx (requires @, domain, no spaces)'}</p>
                                    <p><strong>Password:</strong> {lang === 'th' ? 'ยาว 4-12 ตัว, ภาษาอังกฤษ (A-Z, a-z), ตัวเลข (อย่างน้อย 1 ตัว) และเครื่องหมาย @ . _ - เท่านั้น (ห้ามเว้นวรรค)' : '4 to 12 characters. A-Z, a-z, 0-9 (at least 1), and @ . _ - only (no spaces)'}</p>
                                </div>
                                <input type="text" required={!isLoginMode} value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder={lang === 'th' ? "เช่น xxx@xxmail.xxx (ห้ามเว้นวรรค)" : "e.g. xxx@xxmail.xxx (No spaces)"} className="w-full bg-warmBg dark:bg-warmDarkBg px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-pastelOrangeDark dark:focus:ring-pastelOrange text-sm" />
                                <input type="password" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder={lang === 'th' ? "รหัสผ่าน: 4-12 ตัว, A-Z, a-z, 0-9, @ . _ - (ห้ามเว้นวรรค)" : "Password: 4-12 chars, A-Z, a-z, 0-9, @ . _ - (no spaces)"} className="w-full bg-warmBg dark:bg-warmDarkBg px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-pastelOrangeDark dark:focus:ring-pastelOrange text-sm" />
                                
                                <button type="submit" className="w-full mt-4 bg-pastelOrange text-textDark py-4 rounded-2xl font-bold hover:opacity-90 active:scale-95 transition-all">
                                    {isLoginMode ? 'Sign In' : 'Sign Up'}
                                </button>
                                
                                <button type="button" onClick={() => setIsLoginMode(!isLoginMode)} className="w-full text-sm font-bold opacity-70 hover:opacity-100 hover:text-pastelOrangeDark dark:hover:text-pastelOrange transition-colors mt-2">
                                    {isLoginMode 
                                        ? (lang === 'th' ? "ยังไม่มีบัญชีใช่ไหม? Sign up" : "Don't have an account? Sign up") 
                                        : (lang === 'th' ? "มีบัญชีอยู่แล้วใช่ไหม? Sign in" : "Already have an account? Sign in")}
                                </button>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                <div className="text-center">
                                    <div className="relative w-24 h-24 mx-auto mb-4 group cursor-pointer">
                                        {user.portrait_url ? (
                                            <Image src={user.portrait_url} alt="Profile" fill className="object-cover rounded-full border-4 border-pastelOrange/30 shadow-md" sizes="96px" />
                                        ) : (
                                            <div className="w-full h-full bg-pastelOrange/20 dark:bg-pastelOrange/10 rounded-full flex items-center justify-center border-4 border-transparent group-hover:border-pastelOrange/30 transition-all shadow-sm">
                                                <i className="ph-fill ph-user text-4xl text-pastelOrange"></i>
                                            </div>
                                        )}
                                        
                                        <label className={`absolute inset-0 bg-black/50 text-white rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ${isUploadingPortrait ? 'opacity-100 bg-black/60' : ''}`}>
                                            {isUploadingPortrait ? (
                                                <i className="ph-bold ph-spinner animate-spin text-2xl"></i>
                                            ) : (
                                                <>
                                                    <i className="ph-bold ph-camera text-xl mb-0.5"></i>
                                                    <span className="text-[10px] font-bold">Edit</span>
                                                </>
                                            )}
                                            <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} disabled={isUploadingPortrait} />
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-center gap-2 mb-1">
                                        {isEditingName ? (
                                            <input 
                                                autoFocus
                                                type="text" 
                                                value={editNameValue} 
                                                onChange={e => setEditNameValue(e.target.value)} 
                                                onBlur={handleNameUpdate}
                                                onKeyDown={e => e.key === 'Enter' && handleNameUpdate()}
                                                className="bg-warmBg dark:bg-warmDarkBg px-3 py-1 rounded-lg outline-none focus:ring-2 focus:ring-pastelOrangeDark dark:focus:ring-pastelOrange text-center font-bold text-xl w-48" 
                                            />
                                        ) : (
                                            <>
                                                <h3 className="text-xl font-bold">{user.name}</h3>
                                                <button onClick={() => { setEditNameValue(user.name); setIsEditingName(true); }} className="p-1.5 opacity-50 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-all">
                                                    <i className="ph-bold ph-pencil-simple text-sm"></i>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                    <p className="opacity-70 text-sm">{user.email}</p>
                                    {user.role === 'kitchen' && (
                                        <span className="inline-block mt-2 px-3 py-1 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-xs font-bold rounded-full">Kitchen Staff</span>
                                    )}
                                </div>
                                {user.role === 'kitchen' && (
                                    <button onClick={() => router.push('/kitchen')} className="w-full py-4 bg-textDark dark:bg-textLight text-white dark:text-textDark font-bold rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-2">
                                        <i className="ph-bold ph-cooking-pot"></i> Open Kitchen Dashboard
                                    </button>
                                )}
                                <div className="p-4 bg-warmBg dark:bg-warmDarkBg rounded-2xl">
                                    <h4 className="font-bold mb-3">{lang === 'th' ? 'การตั้งค่า' : 'Preferences'}</h4>
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <span className="font-semibold">{lang === 'th' ? 'ปิดเอฟเฟกต์แอนิเมชัน' : 'Disable Animations'}</span>
                                        <input type="checkbox" className="w-5 h-5 accent-pastelOrange rounded-md cursor-pointer" checked={disableAnimations} onChange={toggleDisableAnimations} />
                                    </label>
                                </div>
                                <button onClick={() => { setUser(null); setLoginEmail(''); localStorage.removeItem('authUser'); }} className="w-full py-4 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all">Sign Out</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Item Options Modal */}
            <div className={`fixed inset-0 bg-textDark/40 dark:bg-black/80 backdrop-blur-sm z-50 transition-opacity duration-300 flex items-end md:items-center justify-center p-0 md:p-4 overflow-hidden ${isModalVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setSelectedItem(null)}>
                
                {/* Level 5 Explosion Background */}
                {itemToRender && isExploding && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0">
                        {explosionParticles.map(p => (
                            <div 
                                key={p.id}
                                className={`absolute animate-explode-cube rounded-sm shadow-sm ${p.isRed ? 'bg-red-500 shadow-red-500/50' : 'bg-orange-500 shadow-orange-500/50'}`}
                                style={{
                                    '--tx': `${p.tx}px`,
                                    '--ty': `${p.ty}px`,
                                    '--rot': `${p.rot}deg`,
                                    width: p.size,
                                    height: p.size,
                                    animationDuration: `${p.duration}s`,
                                    animationDelay: `${p.delay}s`
                                }}
                            />
                        ))}
                        <div className="absolute w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] border-[30px] border-orange-500/30 rounded-full animate-pulse-flash pointer-events-none"></div>
                        <div className="absolute w-[60vw] h-[60vw] md:w-[30vw] md:h-[30vw] border-[20px] border-red-500/40 rounded-full animate-pulse-flash pointer-events-none" style={{ animationDelay: '0.1s' }}></div>
                    </div>
                )}

                {itemToRender && (
                    <div className={`w-full max-w-md relative z-10 rounded-t-3xl md:rounded-3xl flex flex-col max-h-[90vh] md:max-h-[85vh] overflow-hidden transition-all duration-300 ${isModalVisible ? 'translate-y-0 md:scale-100' : 'translate-y-full md:translate-y-0 md:scale-95'} ${isShaking ? 'animate-shake-' + shakeLevel : ''} ${itemOptions.spicyLevel === 5 ? 'bg-purple-100 dark:bg-purple-950 shadow-[0_-20px_80px_rgba(168,85,247,0.6)] md:shadow-[0_20px_80px_rgba(168,85,247,0.8)] border-t md:border border-purple-500 shadow-[inset_0_0_20px_rgba(168,85,247,0.3)]' : itemOptions.spicyLevel >= 4 ? 'bg-red-100 dark:bg-red-950 shadow-[0_-10px_40px_rgba(239,68,68,0.3)] md:shadow-[0_10px_40px_rgba(239,68,68,0.5)] border-t md:border border-red-500/40' : itemOptions.spicyLevel === 3 ? 'bg-[#fff0f0] dark:bg-[#361c1c] shadow-[0_-10px_40px_rgba(239,68,68,0.15)] md:shadow-[0_10px_40px_rgba(239,68,68,0.3)] border-t md:border border-red-500/20' : itemOptions.spicyLevel > 0 ? 'bg-cardLight dark:bg-cardDark shadow-[0_-10px_40px_rgba(255,255,255,0.4)] md:shadow-[0_10px_40px_rgba(255,255,255,0.6)] dark:shadow-[0_10px_40px_rgba(255,255,255,0.15)] border-t md:border border-white/40 dark:border-white/10' : 'bg-cardLight dark:bg-cardDark shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-2xl border-t md:border border-transparent dark:border-white/5'}`} onClick={e => e.stopPropagation()}>
                        
                        <div className="overflow-y-auto flex-1">
                            <div className="relative h-40 md:h-48 shrink-0">
                            <Image src={itemToRender.image_url} alt={itemToRender.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 400px" />
                            <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors z-10">
                                <i className="ph-bold ph-x text-lg"></i>
                            </button>
                        </div>
                        <div className="p-5 md:p-6 pb-4">
                            <h3 className="text-2xl font-bold mb-1">{lang === 'th' && itemToRender.name_th ? itemToRender.name_th : itemToRender.name}</h3>
                            <p className="opacity-70 text-sm mb-6">{lang === 'th' && itemToRender.description_th ? itemToRender.description_th : itemToRender.description}</p>
                            
                            <div className="space-y-6">
                                {itemToRender.category !== 'Drinks' && (
                                    <div>
                                        <h4 className="font-bold mb-3 flex items-center justify-between">
                                            {lang === 'th' ? 'ขนาด' : 'Size'}
                                            <span className="text-xs font-normal opacity-50 bg-textDark/10 dark:bg-white/10 px-2 py-0.5 rounded-full">{lang === 'th' ? 'จำเป็น' : 'Required'}</span>
                                        </h4>
                                        <div className="flex gap-4">
                                            <label className="flex-1 cursor-pointer">
                                                <input type="radio" name="size" className="peer sr-only" checked={itemOptions.size === 'Normal'} onChange={() => setItemOptions({...itemOptions, size: 'Normal'})} />
                                                <div className="text-center p-3 rounded-2xl border-2 border-transparent bg-warmBg dark:bg-warmDarkBg peer-checked:border-pastelOrange peer-checked:bg-pastelOrange/20 peer-checked:shadow-[0_4px_15px_rgba(255,200,153,0.4)] dark:peer-checked:shadow-[0_4px_15px_rgba(217,119,54,0.3)] transition-all font-semibold hover:scale-[1.02] active:scale-95">
                                                    {lang === 'th' ? 'ธรรมดา' : 'Normal'} <span className="block text-xs opacity-70">฿{itemToRender.price}</span>
                                                </div>
                                            </label>
                                            <label className="flex-1 cursor-pointer">
                                                <input type="radio" name="size" className="peer sr-only" checked={itemOptions.size === 'Special'} onChange={() => setItemOptions({...itemOptions, size: 'Special'})} />
                                                <div className="text-center p-3 rounded-2xl border-2 border-transparent bg-warmBg dark:bg-warmDarkBg peer-checked:border-pastelOrange peer-checked:bg-pastelOrange/20 peer-checked:shadow-[0_4px_15px_rgba(255,200,153,0.4)] dark:peer-checked:shadow-[0_4px_15px_rgba(217,119,54,0.3)] transition-all font-semibold hover:scale-[1.02] active:scale-95">
                                                    {lang === 'th' ? 'พิเศษ' : 'Special'} <span className="block text-xs font-bold text-pastelOrangeDark dark:text-pastelOrange">+{itemToRender.category === 'Ramen' ? '฿15' : '฿5'}</span>
                                                </div>
                                            </label>
                                            {itemToRender.category === 'Sides' && (
                                                <label className="flex-1 cursor-pointer">
                                                    <input type="radio" name="size" className="peer sr-only" checked={itemOptions.size === 'Super Special'} onChange={() => setItemOptions({...itemOptions, size: 'Super Special'})} />
                                                    <div className="text-center p-3 rounded-2xl border-2 border-transparent bg-warmBg dark:bg-warmDarkBg peer-checked:border-pastelOrange peer-checked:bg-pastelOrange/20 peer-checked:shadow-[0_4px_15px_rgba(255,200,153,0.4)] dark:peer-checked:shadow-[0_4px_15px_rgba(217,119,54,0.3)] transition-all font-semibold hover:scale-[1.02] active:scale-95">
                                                        {lang === 'th' ? 'โคตรพิเศษ' : 'Super'} <span className="block text-xs font-bold text-pastelOrangeDark dark:text-pastelOrange">+฿10</span>
                                                    </div>
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                )}
                                
                                {itemToRender.category === 'Ramen' && (
                                    <div>
                                        <h4 className="font-bold mb-3">{lang === 'th' ? 'เพิ่มเติม' : 'Extras'}</h4>
                                        <label className="flex items-center justify-between p-4 rounded-2xl bg-warmBg dark:bg-warmDarkBg cursor-pointer border-2 border-transparent hover:border-pastelOrange/30 hover:scale-[1.02] active:scale-95 transition-all">
                                            <span className="font-semibold">{lang === 'th' ? 'ไข่ต้มยางมะตูม (+฿15)' : 'Soft Boiled Egg (+฿15)'}</span>
                                            <input type="checkbox" className="w-5 h-5 accent-pastelOrange rounded-md cursor-pointer shadow-sm" checked={itemOptions.egg || false} onChange={(e) => setItemOptions({...itemOptions, egg: e.target.checked})} />
                                        </label>
                                        {itemToRender.name === 'Tsukemen Dipping Noodles' && (
                                            <label className="flex items-center justify-between p-4 mt-3 rounded-2xl bg-warmBg dark:bg-warmDarkBg cursor-pointer border-2 border-transparent hover:border-pastelOrange/30 hover:scale-[1.02] active:scale-95 transition-all">
                                                <span className="font-semibold">{lang === 'th' ? 'เปลี่ยนเป็นซุปมิโซะ (+฿20)' : 'Change to Miso Soup (+฿20)'}</span>
                                                <input type="checkbox" className="w-5 h-5 accent-pastelOrange rounded-md cursor-pointer shadow-sm" checked={itemOptions.misoSoup || false} onChange={(e) => setItemOptions({...itemOptions, misoSoup: e.target.checked})} />
                                            </label>
                                        )}
                                    </div>
                                )}
                                
                                {itemToRender.name === 'Karaage Chicken' && (
                                    <div>
                                        <h4 className="font-bold mb-3 flex items-center justify-between">
                                            {lang === 'th' ? 'ซอส' : 'Sauce'}
                                            <span className="text-xs font-normal opacity-50 bg-textDark/10 dark:bg-white/10 px-2 py-0.5 rounded-full">{lang === 'th' ? 'เลือกได้ 1' : 'Choose 1'}</span>
                                        </h4>
                                        <div className="grid grid-cols-3 gap-3">
                                            {['Karaage', 'Ketchup', 'Sourcream'].map(sauceType => {
                                                const sauceTh = sauceType === 'Karaage' ? 'คาราเกะ' : (sauceType === 'Ketchup' ? 'มะเขือเทศ' : 'ซาวร์ครีม');
                                                return (
                                                    <label key={sauceType} className="cursor-pointer">
                                                        <input type="radio" name="sauce" className="peer sr-only" checked={itemOptions.sauce === sauceType} onChange={() => setItemOptions({...itemOptions, sauce: sauceType})} />
                                                        <div className="text-center p-2 rounded-2xl border-2 border-transparent bg-warmBg dark:bg-warmDarkBg peer-checked:border-pastelOrange peer-checked:bg-pastelOrange/20 peer-checked:shadow-[0_4px_15px_rgba(255,200,153,0.4)] dark:peer-checked:shadow-[0_4px_15px_rgba(217,119,54,0.3)] transition-all font-semibold text-xs sm:text-sm hover:scale-[1.02] active:scale-95">
                                                            {lang === 'th' ? sauceTh : sauceType}
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {itemToRender.isSpicy && (
                                    <div>
                                        <h4 className="font-bold mb-3 flex items-center justify-between">
                                            {lang === 'th' ? 'ระดับความเผ็ด' : 'Spicy Level'}
                                        </h4>
                                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 sm:gap-2">
                                            {[0, 1, 2, 3, 4, 5].map(level => {
                                                const labelEn = level === 0 ? 'No Spicy' : `Lv.${level}`;
                                                const labelTh = level === 0 ? 'ไม่เผ็ด' : `Lv.${level}`;
                                                return (
                                                    <label key={`spicy-${level}`} className="cursor-pointer">
                                                        <input type="radio" name="spicyLevel" className="peer sr-only" checked={itemOptions.spicyLevel === level} onChange={() => {
                                                            setItemOptions({...itemOptions, spicyLevel: level});
                                                            if (level === 5) {
                                                                setExplosionKey(prev => prev + 1);
                                                                setIsExploding(true);
                                                                setTimeout(() => setIsExploding(false), 1000);
                                                            }
                                                            if (level > 0) {
                                                                setShakeLevel(level);
                                                                setIsShaking(false);
                                                                setTimeout(() => setIsShaking(true), 10);
                                                                setTimeout(() => setIsShaking(false), level === 5 ? 510 : 410);
                                                            }
                                                        }} />
                                                        <div className={`text-center py-2 rounded-xl border-2 transition-all font-bold text-[9px] sm:text-[11px] hover:scale-[1.05] active:scale-95 flex flex-col items-center gap-0.5 sm:gap-1 h-full justify-center ${itemOptions.spicyLevel === level ? (level === 5 ? 'border-purple-500 bg-purple-500/10 text-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'border-red-500 bg-red-500/10 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]') : 'border-transparent bg-warmBg dark:bg-warmDarkBg'}`}>
                                                            <i className={`ph-fill ph-fire text-sm sm:text-base ${level > 0 ? (level === 5 ? 'text-purple-500 animate-[pulse_1s_ease-in-out_infinite]' : level > 2 ? 'text-red-600' : 'text-orange-500') : 'opacity-30 text-gray-500'}`}></i>
                                                            <span className="leading-tight">{lang === 'th' ? labelTh : labelEn}</span>
                                                            {level === 5 ? <span className="text-[8px] sm:text-[9px] text-purple-500 font-black mt-[-2px]">+฿10</span> : level >= 3 ? <span className="text-[8px] sm:text-[9px] text-red-500 font-black mt-[-2px]">+฿5</span> : null}
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {itemToRender.category === 'Drinks' && (
                                    <div>
                                        <h4 className="font-bold mb-3 flex items-center justify-between">
                                            {lang === 'th' ? 'ระดับความหวาน' : 'Sweetness'}
                                            <span className="text-xs font-normal opacity-50 bg-textDark/10 dark:bg-white/10 px-2 py-0.5 rounded-full">{lang === 'th' ? 'จำเป็น' : 'Required'}</span>
                                        </h4>
                                        <div className="grid grid-cols-3 gap-3">
                                            {['0%', '50%', '100%'].map(level => (
                                                <label key={level} className="cursor-pointer">
                                                    <input type="radio" name="sweetness" className="peer sr-only" checked={itemOptions.sweetness === level} onChange={() => setItemOptions({...itemOptions, sweetness: level})} />
                                                    <div className="text-center p-2 rounded-2xl border-2 border-transparent bg-warmBg dark:bg-warmDarkBg peer-checked:border-pastelOrange peer-checked:bg-pastelOrange/20 peer-checked:shadow-[0_4px_15px_rgba(255,200,153,0.4)] dark:peer-checked:shadow-[0_4px_15px_rgba(217,119,54,0.3)] transition-all font-semibold text-sm hover:scale-[1.02] active:scale-95">
                                                        {level}
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="mt-6">
                                <h4 className="font-bold mb-3 flex items-center justify-between">
                                    {lang === 'th' ? 'หมายเหตุพิเศษ' : 'Special Instructions'}
                                    <span className="text-xs font-normal opacity-50 bg-textDark/10 dark:bg-white/10 px-2 py-0.5 rounded-full">{lang === 'th' ? 'ไม่บังคับ' : 'Optional'}</span>
                                </h4>
                                <input 
                                    type="text" 
                                    placeholder={lang === 'th' ? 'เช่น ไม่ใส่ผัก...' : 'e.g. No vegetables...'}
                                    value={itemOptions.specialInstructions || ''}
                                    onChange={(e) => setItemOptions({...itemOptions, specialInstructions: e.target.value})}
                                    className="w-full bg-warmBg dark:bg-warmDarkBg px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-pastelOrangeDark dark:focus:ring-pastelOrange transition-all text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-4 md:p-6 pt-3 md:pt-4 border-t border-textDark/5 dark:border-white/5 shrink-0 bg-inherit shadow-[0_-4px_15px_rgba(0,0,0,0.03)] dark:shadow-none">
                            <AnimatedPriceButton 
                                price={currentModalPrice} 
                                lang={lang} 
                                isEditing={itemToRender.isEditingCartItemId} 
                                onClick={() => addToCart(itemToRender, itemOptions, itemToRender.isEditingCartItemId)} 
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Crop Modal Overlay */}
            <div className={`fixed inset-0 bg-textDark/80 dark:bg-black/90 backdrop-blur-md z-[100] transition-opacity duration-300 flex items-center justify-center p-4 ${cropModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className={`bg-cardLight dark:bg-cardDark w-full max-w-md rounded-3xl shadow-2xl overflow-hidden transition-transform duration-300 flex flex-col ${cropModalOpen ? 'scale-100' : 'scale-95'}`}>
                    <div className="relative h-80 w-full bg-black/10 dark:bg-white/5">
                        {photoURL && (
                            <Cropper
                                image={photoURL}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                cropShape="round"
                                showGrid={false}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={(croppedArea, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
                            />
                        )}
                    </div>
                    <div className="p-6">
                        <div className="mb-6">
                            <label className="text-sm font-bold opacity-70 mb-2 block text-textDark dark:text-textLight">Zoom</label>
                            <input type="range" min={1} max={3} step={0.1} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-full accent-pastelOrange" />
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => { setCropModalOpen(false); setPhotoURL(''); }} className="flex-1 py-3 bg-warmBg dark:bg-warmDarkBg font-bold rounded-xl hover:opacity-80 transition-opacity text-textDark dark:text-textLight">Cancel</button>
                            <button onClick={handleCropComplete} className="flex-1 py-3 bg-pastelOrange dark:bg-darkAccent text-textDark dark:text-textLight font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                                <i className="ph-bold ph-crop"></i> Save Picture
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
