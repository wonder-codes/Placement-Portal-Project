import { useState, useEffect } from 'react';
import { useCreateJobMutation } from '../../services/jobApi';
import { useGetMyCompanyQuery } from '../../services/companyApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Save, Plus, Trash2, MapPin } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const PostJob = () => {
    const { data: company, isLoading: isCompanyLoading } = useGetMyCompanyQuery();
    const [createJob, { isLoading: isPosting }] = useCreateJobMutation();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        role: '',
        description: '',
        package: '',
        jobType: 'Full-time',
        location: '',
        bond: '',
        deadline: '',
        minCGPA: '',
        maxBacklogs: '0',
        passingYear: new Date().getFullYear(),
        allowedBranches: [],
        rounds: [{ name: 'Aptitude Test', description: '' }]
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoundChange = (index, value) => {
        const newRounds = [...formData.rounds];
        newRounds[index].name = value;
        setFormData({ ...formData, rounds: newRounds });
    };

    const addRound = () => {
        setFormData({ ...formData, rounds: [...formData.rounds, { name: '', description: '' }] });
    };

    const removeRound = (index) => {
        setFormData({ ...formData, rounds: formData.rounds.filter((_, i) => i !== index) });
    };

    const handleBranchToggle = (branch) => {
        setFormData(prev => ({
            ...prev,
            allowedBranches: prev.allowedBranches.includes(branch)
                ? prev.allowedBranches.filter(b => b !== branch)
                : [...prev.allowedBranches, branch]
        }));
    };

    const handleSubmit = async (submitType) => {
        if (!company) return alert("Please complete company profile first");

        try {
            await createJob({
                ...formData,
                package: parseFloat(formData.package),
                eligibility: {
                    minCGPA: parseFloat(formData.minCGPA),
                    maxBacklogs: parseInt(formData.maxBacklogs),
                    allowedBranches: formData.allowedBranches,
                    passingYear: parseInt(formData.passingYear)
                },
                status: submitType === 'submit' ? 'PENDING_APPROVAL' : 'DRAFT'
            }).unwrap();

            alert(submitType === 'submit' ? 'Job submitted for TPO approval!' : 'Job saved as draft');
            navigate('/recruiter');
        } catch (error) {
            alert(error?.data?.message || 'Failed to post job');
        }
    };

    if (isCompanyLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8" /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Create Opportunity</h2>
                    <p className="text-gray-500">Post a new job or internship for {company?.name}</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-white border-gray-200">
                        <CardHeader className="bg-gray-50/50">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-gray-500">Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Job Role / Title</Label>
                                    <Input name="role" value={formData.role} onChange={handleChange} placeholder="e.g. Software Engineer" required className="bg-white border-gray-300" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Job Type</Label>
                                    <select name="jobType" value={formData.jobType} onChange={handleChange} className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm">
                                        <option>Full-time</option>
                                        <option>Internship</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Package (CTC in LPA)</Label>
                                    <Input name="package" type="number" step="0.1" value={formData.package} onChange={handleChange} placeholder="e.g. 12.5" required className="bg-white border-gray-300" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Location</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Bangalore, Remote" className="pl-9 bg-white border-gray-300" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Job Description</Label>
                                <Textarea name="description" value={formData.description} onChange={handleChange} rows={5} placeholder="Describe the role, responsibilities, and perks..." required className="bg-white border-gray-300 font-sans" />
                            </div>

                            <div className="space-y-2">
                                <Label>Bond Details (if any)</Label>
                                <Input name="bond" value={formData.bond} onChange={handleChange} placeholder="e.g. 2 Years service agreement" className="bg-white border-gray-300" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="bg-gray-50/50">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-gray-500">Selection Process</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            {formData.rounds.map((round, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <div className="bg-gray-100 h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0">{index + 1}</div>
                                    <Input
                                        value={round.name}
                                        onChange={(e) => handleRoundChange(index, e.target.value)}
                                        placeholder="Round name..."
                                        className="bg-white border-gray-300"
                                    />
                                    {formData.rounds.length > 1 && (
                                        <Button variant="ghost" size="icon" onClick={() => removeRound(index)} className="text-red-500 hover:text-red-700">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button variant="outline" size="sm" onClick={addRound} className="w-full border-dashed">
                                <Plus className="h-4 w-4 mr-2" /> Add Next Round
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader className="bg-gray-50/50">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-gray-500">Eligibility Criteria</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="space-y-2">
                                <Label>Minimum CGPA</Label>
                                <Input name="minCGPA" type="number" step="0.1" value={formData.minCGPA} onChange={handleChange} required className="bg-white border-gray-300" />
                            </div>
                            <div className="space-y-2">
                                <Label>Max Backlogs Allowed</Label>
                                <Input name="maxBacklogs" type="number" value={formData.maxBacklogs} onChange={handleChange} required className="bg-white border-gray-300" />
                            </div>
                            <div className="space-y-2">
                                <Label>Target Passing Year</Label>
                                <Input name="passingYear" type="number" value={formData.passingYear} onChange={handleChange} required className="bg-white border-gray-300" />
                            </div>
                            <div className="space-y-2">
                                <Label>Eligible Branches</Label>
                                <div className="flex flex-wrap gap-2">
                                    {['CS', 'IT', 'MECH', 'ECE', 'CIVIL'].map(branch => (
                                        <button
                                            key={branch}
                                            type="button"
                                            onClick={() => handleBranchToggle(branch)}
                                            className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-colors ${formData.allowedBranches.includes(branch)
                                                ? 'bg-purple-600 border-purple-600 text-white'
                                                : 'bg-white border-gray-300 text-gray-600 hover:border-purple-400'
                                                }`}
                                        >
                                            {branch}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2 pt-2">
                                <Label>Application Deadline</Label>
                                <Input name="deadline" type="date" value={formData.deadline} onChange={handleChange} required className="bg-white border-gray-300" />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-3">
                        <Button onClick={() => handleSubmit('submit')} className="w-full bg-purple-600 hover:bg-purple-700 h-12 text-lg" disabled={isPosting}>
                            {isPosting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Send className="mr-2 h-5 w-5" />}
                            Post for Approval
                        </Button>
                        <Button onClick={() => handleSubmit('draft')} variant="outline" className="w-full h-12" disabled={isPosting}>
                            <Save className="mr-2 h-5 w-5" /> Save as Draft
                        </Button>
                        <p className="text-[10px] text-gray-400 text-center px-4 leading-normal">
                            Once submitted, the TPO will review and publish the job. You can edit the details only while it's in Draft.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostJob;
