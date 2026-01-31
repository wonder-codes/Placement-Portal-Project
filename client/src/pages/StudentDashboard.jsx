import { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Briefcase, FileUser, LogOut } from 'lucide-react';
import StudentJobs from './student/StudentJobs';
import StudentProfile from './student/StudentProfile';
import StudentApplications from './student/StudentApplications';

const StudentDashboard = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);

    const navItems = [
        { path: '/student', label: 'Jobs', icon: Briefcase },
        { path: '/student/applications', label: 'Applications', icon: LayoutDashboard },
        { path: '/student/profile', label: 'Profile', icon: FileUser },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Placement
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">{user?.name}</p>
                </div>
                <nav className="flex-1 px-4 space-y-2 py-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link key={item.path} to={item.path}>
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-100"
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
            <main className="flex-1 p-8 overflow-y-auto h-screen bg-gray-50">
                <Routes>
                    <Route path="/" element={<StudentJobs />} />
                    <Route path="/applications" element={<StudentApplications />} />
                    <Route path="/profile" element={<StudentProfile />} />
                </Routes>
            </main>
        </div>
    );
};

export default StudentDashboard;
