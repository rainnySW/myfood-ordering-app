import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function KitchenDashboard() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Auto-refresh orders every 15 seconds
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch('/api/orders');
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data);
                }
            } catch (err) {
                console.error('Failed to fetch orders:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
        const interval = setInterval(fetchOrders, 15000);
        return () => clearInterval(interval);
    }, []);

    const updateOrderStatus = async (orderId, newStatus) => {
        // In a real app, this would hit an API endpoint to update the DB.
        // For now, we'll update local state optimistically.
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
        
        // TODO: Implement /api/orders/[id] PUT endpoint for MongoDB persistence
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
            case 'Preparing': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'Served': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
            default: return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    return (
        <>
            <Head>
                <title>Kitchen Dashboard | Ramen Aroy</title>
            </Head>
            <div className="min-h-screen bg-warmBg dark:bg-warmDarkBg pt-20 pb-10 px-4 md:px-8 font-sans">
                <div className="max-w-6xl mx-auto">
                    
                    <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-textDark dark:text-textLight">Kitchen Orders</h1>
                            <p className="opacity-70 text-sm mt-1">Live updates every 15 seconds</p>
                        </div>
                        <button 
                            onClick={() => router.push('/')}
                            className="text-pastelOrangeDark dark:text-pastelOrange hover:underline font-bold flex items-center gap-2"
                        >
                            <i className="ph-bold ph-arrow-left"></i> Back to Home
                        </button>
                    </header>

                    {isLoading ? (
                        <div className="text-center py-20 opacity-50 font-bold animate-pulse">
                            Loading kitchen tickets...
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-20 bg-cardLight dark:bg-cardDark rounded-3xl border border-white/20">
                            <i className="ph-bold ph-check-circle text-4xl text-green-500 mb-2 block"></i>
                            <h2 className="text-xl font-bold">No active orders!</h2>
                            <p className="opacity-70">The kitchen is all caught up.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {orders.map(order => (
                                <div key={order._id} className="bg-cardLight dark:bg-cardDark rounded-3xl p-6 shadow-soft dark:shadow-softDark border border-transparent dark:border-white/5 flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="text-2xl font-black text-[#D97736] dark:text-pastelOrange">Table {order.table_number}</div>
                                            <div className="text-xs opacity-60 mt-1">
                                                {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 bg-white/50 dark:bg-black/20 rounded-2xl p-4 mb-4">
                                        <ul className="space-y-3">
                                            {order.items.map((item, idx) => (
                                                <li key={idx} className="flex gap-3 text-sm">
                                                    <span className="font-black text-textDark dark:text-textLight w-6 h-6 flex items-center justify-center bg-white dark:bg-black rounded-md">{item.quantity}x</span>
                                                    <div>
                                                        <div className="font-bold">{item.name}</div>
                                                        {item.special_instructions && (
                                                            <div className="text-xs text-red-500 font-medium mt-0.5">Note: {item.special_instructions}</div>
                                                        )}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="flex gap-2 mt-auto">
                                        {order.status === 'Pending' && (
                                            <button 
                                                onClick={() => updateOrderStatus(order._id, 'Preparing')}
                                                className="flex-1 bg-yellow-500 text-white font-bold py-2 rounded-xl hover:bg-yellow-600 active:scale-95 transition-all"
                                            >
                                                Start Preparing
                                            </button>
                                        )}
                                        {order.status === 'Preparing' && (
                                            <button 
                                                onClick={() => updateOrderStatus(order._id, 'Served')}
                                                className="flex-1 bg-green-500 text-white font-bold py-2 rounded-xl hover:bg-green-600 active:scale-95 transition-all"
                                            >
                                                Mark Served
                                            </button>
                                        )}
                                        {order.status === 'Served' && (
                                            <div className="flex-1 text-center py-2 text-green-500 font-bold opacity-50 flex items-center justify-center gap-2">
                                                <i className="ph-bold ph-check"></i> Completed
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
