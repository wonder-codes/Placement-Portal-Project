import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Mail, Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from '../../features/auth/authSlice';

const RecruiterProfile = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">My Profile</h2>

            <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center">
                            <User className="h-8 w-8 text-purple-600" />
                        </div>
                        <div>
                            <CardTitle className="text-xl text-gray-900">{user?.name}</CardTitle>
                            <CardDescription className="text-gray-500">Recruiter • {user?.email}</CardDescription>
                        </div>
                        <div className="ml-auto">
                            <Button variant="destructive" onClick={() => dispatch(logout())}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <Mail className="h-5 w-5 text-gray-500" />
                            <div>
                                <p className="text-sm font-medium text-gray-500">Email Address</p>
                                <p className="text-gray-900">{user?.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <Shield className="h-5 w-5 text-gray-500" />
                            <div>
                                <p className="text-sm font-medium text-gray-500">Account Type</p>
                                <p className="text-gray-900">Recruiter</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default RecruiterProfile;
