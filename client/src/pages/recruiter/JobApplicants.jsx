import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetJobApplicationsQuery, useUpdateApplicationStatusMutation } from '../../services/applicationApi';
import { useGetJobByIdQuery } from '../../services/jobApi';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search, Filter, Calendar, MapPin, Link as LinkIcon, Download, FileCheck, CheckCircle2, XCircle, MoreVertical } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const JobApplicants = () => {
    const { jobId } = useParams();
    const { data: job } = useGetJobByIdQuery(jobId);
    const { data: applicants, isLoading, refetch } = useGetJobApplicationsQuery(jobId);
    const [updateStatus, { isLoading: isUpdating }] = useUpdateApplicationStatusMutation();

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [branchFilter, setBranchFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');

    // Modals
    const [schedulingModal, setSchedulingModal] = useState({ open: false, app: null, type: '' });
    const [scheduleData, setScheduleData] = useState({ date: '', time: '', venue: '' });
    const [offerModal, setOfferModal] = useState({ open: false, app: null });
    const [offerData, setOfferData] = useState({ package: '', joiningDate: '', offerLetterUrl: '' });

    const filteredApplicants = applicants?.filter(app => {
        const matchesSearch = app.student.user.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBranch = branchFilter === 'All' || app.student.department === branchFilter;
        const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
        return matchesSearch && matchesBranch && matchesStatus;
    });

    const handleScheduleSubmit = async () => {
        try {
            const status = schedulingModal.type === 'Test' ? 'TEST_SHORTLISTED' : 'INTERVIEW_SHORTLISTED';
            const scheduleField = schedulingModal.type === 'Test' ? 'testSchedule' : 'interviewSchedule';

            await updateStatus({
                id: schedulingModal.app._id,
                status,
                [scheduleField]: scheduleData
            }).unwrap();

            setSchedulingModal({ open: false, app: null, type: '' });
            refetch();
        } catch (error) {
            alert('Failed to schedule');
        }
    };

    const handleOfferSubmit = async () => {
        try {
            await updateStatus({
                id: offerModal.app._id,
                status: 'Selected',
                offerDetails: offerData
            }).unwrap();

            setOfferModal({ open: false, app: null });
            refetch();
        } catch (error) {
            alert('Failed to submit offer');
        }
    };

    if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8" /></div>;

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">{job?.role} Applicants</h2>
                    <p className="text-gray-500">Managing {applicants?.length} total candidates</p>
                </div>
            </div>

            {/* Filters */}
            <Card className="bg-white shadow-sm border-gray-200">
                <CardContent className="p-4 grid md:grid-cols-4 gap-4">
                    <div className="md:col-span-2 relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search by name..."
                            className="pl-9 bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="h-10 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm"
                        value={branchFilter}
                        onChange={(e) => setBranchFilter(e.target.value)}
                    >
                        <option value="All">All Branches</option>
                        {['CS', 'IT', 'MECH', 'ECE', 'CIVIL'].map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <select
                        className="h-10 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        {['Applied', 'TEST_SHORTLISTED', 'INTERVIEW_SHORTLISTED', 'Selected', 'Rejected'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </CardContent>
            </Card>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-gray-900">
                <table className="w-full text-sm text-left">
                    <thead className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-4">Candidate</th>
                            <th className="px-6 py-4">Academic Specs</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredApplicants?.map((app) => (
                            <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                                            {app.student.user.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{app.student.user.name}</p>
                                            <p className="text-xs text-gray-400">{app.student.user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-[10px] font-bold">{app.student.department}</Badge>
                                            <span className="text-xs font-medium text-gray-700">{app.student.cgpa} CGPA</span>
                                        </div>
                                        {app.student.resumeUrl && (
                                            <a href={app.student.resumeUrl} target="_blank" className="text-[10px] text-blue-600 flex items-center gap-1 hover:underline">
                                                <Download className="h-3 w-3" /> View Resume
                                            </a>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge className={`text-[10px] font-bold ${app.status === 'Applied' ? 'bg-blue-100 text-blue-700' :
                                            app.status.includes('SHORTLISTED') ? 'bg-yellow-100 text-yellow-700' :
                                                app.status === 'Selected' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {app.status}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    {app.status === 'Applied' && (
                                        <Button size="sm" onClick={() => setSchedulingModal({ open: true, app, type: 'Test' })} className="bg-purple-600 hover:bg-purple-700 text-xs h-8">
                                            Shortlist for Test
                                        </Button>
                                    )}
                                    {app.status === 'TEST_SHORTLISTED' && (
                                        <Button size="sm" onClick={() => setSchedulingModal({ open: true, app, type: 'Interview' })} className="bg-blue-600 hover:bg-blue-700 text-xs h-8">
                                            Shortlist for Interview
                                        </Button>
                                    )}
                                    {app.status === 'INTERVIEW_SHORTLISTED' && (
                                        <Button size="sm" onClick={() => setOfferModal({ open: true, app })} className="bg-green-600 hover:bg-green-700 text-xs h-8 font-bold">
                                            Confirm Selection
                                        </Button>
                                    )}
                                    {(app.status !== 'Rejected' && app.status !== 'Offer Accepted') && (
                                        <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50 text-xs h-8" onClick={() => updateStatus({ id: app._id, status: 'Rejected' })}>
                                            Reject
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Scheduling Modal */}
            <Dialog open={schedulingModal.open} onOpenChange={(o) => setSchedulingModal({ ...schedulingModal, open: o })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Schedule {schedulingModal.type}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4 text-gray-900">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Date</Label>
                                <Input type="date" className="bg-white border-gray-300" onChange={e => setScheduleData({ ...scheduleData, date: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Time</Label>
                                <Input type="time" className="bg-white border-gray-300" onChange={e => setScheduleData({ ...scheduleData, time: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Venue / Link</Label>
                            <Input placeholder="Location or Meeting Link" className="bg-white border-gray-300" onChange={e => setScheduleData({ ...scheduleData, venue: e.target.value })} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleScheduleSubmit} className="bg-purple-600">Save & Notify Student</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Offer Modal */}
            <Dialog open={offerModal.open} onOpenChange={(o) => setOfferModal({ ...offerModal, open: o })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Final Selection & Offer</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4 text-gray-900">
                        <div className="space-y-2">
                            <Label>Final Package (LPA)</Label>
                            <Input type="number" step="0.1" className="bg-white border-gray-300" placeholder="e.g. 15.5" onChange={e => setOfferData({ ...offerData, package: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Joining Date</Label>
                            <Input type="date" className="bg-white border-gray-300" onChange={e => setOfferData({ ...offerData, joiningDate: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Offer Letter URL (PDF)</Label>
                            <Input placeholder="Link to offer document" className="bg-white border-gray-300" onChange={e => setOfferData({ ...offerData, offerLetterUrl: e.target.value })} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleOfferSubmit} className="bg-green-600">Submit Selection</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default JobApplicants;
