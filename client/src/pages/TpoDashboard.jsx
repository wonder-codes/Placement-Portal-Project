import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { Button } from '@/components/ui/button';
import { Activity, Users, ShieldCheck, LogOut } from 'lucide-react';
import TpoAnalytics from './tpo/TpoAnalytics';
import TpoVerification from './tpo/TpoVerification';
import LiveTicker from './tpo/LiveTicker';

const TpoDashboard = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);

    const navItems = [
        { path: '/tpo', label: 'Analytics', icon: Activity },
        { path: '/tpo/verification', label: 'Verification', icon: ShieldCheck },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                        Admin Portal
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">TPO Officer</p>
                </div>
                <nav className="flex-1 px-4 space-y-2 py-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link key={item.path} to={item.path}>
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-100 mb-1"
                                >
                                    <Icon className="mr-2 h-4 w-4" />
                                    {item.label}
                                </Button>
                            </Link>
                        )
                    })}
                </nav>
                <div className="p-4 border-t border-gray-200">
                    <Button variant="destructive" className="w-full justify-start bg-red-600 hover:bg-red-700 text-white" onClick={() => dispatch(logout())}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto h-screen relative bg-gray-50">
                <div className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10 shadow-sm">
                    <LiveTicker />
                </div>
                <div className="p-8">
                    <Routes>
                        <Route path="/" element={<TpoAnalytics />} />
                        <Route path="/verification" element={<TpoVerification />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

export default TpoDashboard;
