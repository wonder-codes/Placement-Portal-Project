import { useState } from 'react';
import { useCreateJobMutation } from '../../features/jobs/jobApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Assuming you have this or use simple textarea
import { Loader2, Send } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const PostJob = () => {
    const [formData, setFormData] = useState({
        companyName: '',
        role: '',
        description: '',
        package: '',
        minCGPA: '',
        maxBacklogs: '',
        deadline: ''
    });

    const [createJob, { isLoading }] = useCreateJobMutation();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createJob({
                ...formData,
                eligibility: {
                    minCGPA: formData.minCGPA,
                    maxBacklogs: formData.maxBacklogs
                }
            }).unwrap();
            alert('Job Posted Successfully!');
            navigate('/recruiter');
        } catch (error) {
            alert('Failed to post job');
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Post New Job</h2>
            <Card className="bg-white border-gray-200">
                <CardHeader>
                    <CardTitle className="text-gray-900">Job Details</CardTitle>
                    <CardDescription className="text-gray-500">Create a new opportunity for students</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="company" className="text-gray-700">Company Name</Label>
                                <Input id="company" name="companyName" value={formData.companyName} onChange={handleChange} required className="bg-white text-gray-900 border-gray-300" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role" className="text-gray-700">Job Role</Label>
                                <Input id="role" name="role" value={formData.role} onChange={handleChange} required className="bg-white text-gray-900 border-gray-300" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="desc" className="text-gray-700">Job Description</Label>
                            <textarea
                                id="desc"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-gray-900"
                                rows={4}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="package" className="text-gray-700">Package (LPA)</Label>
                                <Input id="package" name="package" type="number" step="0.1" value={formData.package} onChange={handleChange} required className="bg-white text-gray-900 border-gray-300" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cgpa" className="text-gray-700">Min CGPA</Label>
                                <Input id="cgpa" name="minCGPA" type="number" step="0.1" value={formData.minCGPA} onChange={handleChange} required className="bg-white text-gray-900 border-gray-300" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="backlogs" className="text-gray-700">Max Backlogs</Label>
                                <Input id="backlogs" name="maxBacklogs" type="number" value={formData.maxBacklogs} onChange={handleChange} required className="bg-white text-gray-900 border-gray-300" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="deadline" className="text-gray-700">Application Deadline</Label>
                            <Input id="deadline" name="deadline" type="date" value={formData.deadline} onChange={handleChange} required className="bg-white text-gray-900 border-gray-300" />
                        </div>

                        <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                            Post Opportunity
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default PostJob;
