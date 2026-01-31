import { useState } from 'react';
import { useRegisterMutation, setCredentials } from '../features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

const Register = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', role: 'Student',
        department: 'CS', cgpa: '', backlogs: '0', skills: ''
    });

    const [register, { isLoading }] = useRegisterMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData };
            if (payload.role === 'Student') {
                payload.skills = payload.skills.split(',').map(s => s.trim());
            } else {
                delete payload.department;
                delete payload.cgpa;
                delete payload.backlogs;
                delete payload.skills;
            }

            const userData = await register(payload).unwrap();
            dispatch(setCredentials({ user: userData, token: userData.token }));
            if (userData.role === 'Student') navigate('/student');
            else if (userData.role === 'Recruiter') navigate('/recruiter');
            else if (userData.role === 'TPO') navigate('/tpo');
        } catch (err) {
            console.error('Failed to register:', err);
            alert(err?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 px-4 py-8">
            <Card className="w-full max-w-lg bg-white shadow-2xl border-gray-200">
                <CardHeader className="space-y-1 pb-4">
                    <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Create an Account
                    </CardTitle>
                    <CardDescription className="text-center text-gray-600 text-base">
                        Join the Smart Placement Portal
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-gray-700 font-medium">Full Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    className="bg-white border-gray-300 text-gray-900"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role" className="text-gray-700 font-medium">Role</Label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 ring-offset-background placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                >
                                    <option value="Student">Student</option>
                                    <option value="Recruiter">Recruiter</option>
                                    <option value="TPO">TPO</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                className="bg-white border-gray-300 text-gray-900"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                className="bg-white border-gray-300 text-gray-900"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {formData.role === 'Student' && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="department" className="text-gray-700 font-medium">Department</Label>
                                        <select
                                            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 ring-offset-background placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            name="department"
                                            value={formData.department}
                                            onChange={handleChange}
                                        >
                                            <option value="CS">CS</option>
                                            <option value="IT">IT</option>
                                            <option value="MECH">MECH</option>
                                            <option value="ECE">ECE</option>
                                            <option value="CIVIL">CIVIL</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cgpa" className="text-gray-700 font-medium">CGPA</Label>
                                        <Input
                                            id="cgpa"
                                            type="number"
                                            step="0.01"
                                            name="cgpa"
                                            className="bg-white border-gray-300 text-gray-900"
                                            value={formData.cgpa}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="backlogs" className="text-gray-700 font-medium">Backlogs</Label>
                                        <Input
                                            id="backlogs"
                                            type="number"
                                            name="backlogs"
                                            className="bg-white border-gray-300 text-gray-900"
                                            value={formData.backlogs}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="skills" className="text-gray-700 font-medium">Skills (comma separated)</Label>
                                        <Input
                                            id="skills"
                                            name="skills"
                                            placeholder="React, Node, Java"
                                            className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                                            value={formData.skills}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...</> : 'Create Account'}
                        </Button>
                        <p className="text-sm text-gray-600 text-center">
                            Already have an account?{" "}
                            <Link to="/login" className="text-purple-600 hover:text-purple-800 font-semibold hover:underline">
                                Login
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default Register;
