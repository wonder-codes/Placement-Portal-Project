import { useState, useEffect } from 'react';
import { useGetStudentProfileQuery, useUpdateStudentProfileMutation } from '../../services/studentApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, User, LogOut } from "lucide-react";
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

const StudentProfile = () => {
    const dispatch = useDispatch();
    const { data: profile, isLoading } = useGetStudentProfileQuery();
    const [updateProfile, { isLoading: isUpdating }] = useUpdateStudentProfileMutation();

    const [formData, setFormData] = useState({
        resumeUrl: '',
        skills: '',
        cgpa: '',
        backlogs: '',
        graduationYear: '',
        department: ''
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                resumeUrl: profile.resumeUrl || '',
                skills: profile.skills ? profile.skills.join(', ') : '',
                cgpa: profile.cgpa || '',
                backlogs: profile.backlogs || 0,
                graduationYear: profile.graduationYear || '',
                department: profile.department || ''
            });
        }
    }, [profile]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProfile({
                ...formData,
                skills: formData.skills.split(',').map(s => s.trim())
            }).unwrap();
            alert('Profile Updated Successfully!');
        } catch (error) {
            alert('Failed to update profile');
        }
    };

    if (isLoading) return <Loader2 className="animate-spin" />;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">My Profile</h2>

            <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                            <CardTitle className="text-xl text-gray-900">{profile?.user?.name}</CardTitle>
                            <CardDescription className="text-gray-500">{profile?.department} Department • {profile?.user?.email}</CardDescription>
                        </div>
                        <div className="ml-auto">
                            <Button variant="destructive" onClick={() => dispatch(logout())}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="cgpa" className="text-gray-700">CGPA</Label>
                                <Input
                                    id="cgpa"
                                    type="number"
                                    step="0.01"
                                    value={formData.cgpa}
                                    onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                                    className="bg-white border-gray-300 text-gray-900"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="backlogs" className="text-gray-700">Backlogs</Label>
                                <Input
                                    id="backlogs"
                                    type="number"
                                    value={formData.backlogs}
                                    onChange={(e) => setFormData({ ...formData, backlogs: e.target.value })}
                                    className="bg-white border-gray-300 text-gray-900"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="year" className="text-gray-700">Graduation Year</Label>
                                <Input
                                    id="year"
                                    type="number"
                                    value={formData.graduationYear}
                                    onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                                    className="bg-white border-gray-300 text-gray-900"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dept" className="text-gray-700">Department</Label>
                                <select
                                    id="dept"
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select Dept</option>
                                    <option value="CS">CS</option>
                                    <option value="IT">IT</option>
                                    <option value="MECH">MECH</option>
                                    <option value="ECE">ECE</option>
                                    <option value="CIVIL">CIVIL</option>
                                </select>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="skills" className="text-gray-700">Skills (comma separated)</Label>
                                <Input
                                    id="skills"
                                    value={formData.skills}
                                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                    className="bg-white border-gray-300 text-gray-900"
                                    placeholder="Java, Python, React..."
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="resume" className="text-gray-700">Resume URL (Drive/Cloudinary Link)</Label>
                                <Input
                                    id="resume"
                                    value={formData.resumeUrl}
                                    onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                                    className="bg-white border-gray-300 text-gray-900"
                                    placeholder="https://"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" disabled={isUpdating} className="bg-blue-600 hover:bg-blue-700 text-white">
                                {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default StudentProfile;
