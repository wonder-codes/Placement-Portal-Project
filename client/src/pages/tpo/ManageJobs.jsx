import { useState } from 'react';
import { useGetMyJobsQuery, useUpdateJobMutation } from '../../services/jobApi';
import { useGetCompaniesQuery } from '../../services/companyApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Briefcase, IndianRupee, MapPin, CheckCircle, XCircle, Clock, Eye, Send } from "lucide-react";
import { Link } from 'react-router-dom';

const ManageJobs = () => {
    // TPOs get all jobs through useGetMyJobsQuery (backend handle it)
    const { data: jobs, isLoading: jobsLoading, refetch } = useGetMyJobsQuery();
    const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();

    const [filter, setFilter] = useState('ALL');

    const handleJobAction = async (id, status) => {
        try {
            await updateJob({ id, status }).unwrap();
            refetch();
            alert(`Job status updated to ${status}`);
        } catch (err) {
            alert(err?.data?.message || 'Failed to update job status');
        }
    };

    const filteredJobs = jobs?.filter(job => {
        if (filter === 'PENDING') return job.status === 'PENDING_APPROVAL';
        if (filter === 'PUBLISHED') return job.status === 'PUBLISHED';
        return true;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'DRAFT': return 'bg-gray-100 text-gray-700';
            case 'PENDING_APPROVAL': return 'bg-amber-100 text-amber-700';
            case 'PUBLISHED': return 'bg-green-100 text-green-700';
            case 'CLOSED': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (jobsLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Placement Opportunities</h2>
                    <p className="text-gray-500">Global oversight of all internship and full-time job postings</p>
                </div>
                <div className="flex bg-white p-1 rounded-lg border">
                    <Button variant={filter === 'ALL' ? 'secondary' : 'ghost'} size="sm" onClick={() => setFilter('ALL')}>All</Button>
                    <Button variant={filter === 'PENDING' ? 'secondary' : 'ghost'} size="sm" onClick={() => setFilter('PENDING')}>Review Queue</Button>
                    <Button variant={filter === 'PUBLISHED' ? 'secondary' : 'ghost'} size="sm" onClick={() => setFilter('PUBLISHED')}>Published</Button>
                </div>
            </div>

            <div className="space-y-4">
                {filteredJobs?.map(job => (
                    <Card key={job._id} className={`bg-white border-gray-200 overflow-hidden ${job.status === 'PENDING_APPROVAL' ? 'border-l-4 border-l-amber-400' : ''}`}>
                        <CardContent className="flex flex-col md:flex-row items-center justify-between p-6 gap-6">
                            <div className="flex items-center gap-5 flex-1 min-w-0">
                                <div className={`p-4 rounded-xl shrink-0 ${job.status === 'PUBLISHED' ? 'bg-green-50' : 'bg-gray-50'}`}>
                                    <Briefcase className={`h-7 w-7 ${job.status === 'PUBLISHED' ? 'text-green-600' : 'text-gray-400'}`} />
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-xl font-bold text-gray-900 truncate">{job.role}</h3>
                                        <Badge className={`${getStatusColor(job.status)} text-[10px] font-bold`}>{job.status}</Badge>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs font-medium text-gray-500">
                                        <span className="text-gray-900">{job.company?.name}</span>
                                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location || 'Not Specified'}</span>
                                        <span className="flex items-center gap-1"><IndianRupee className="h-3 w-3" /> {job.package} LPA</span>
                                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Ends: {new Date(job.deadline).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 shrink-0 md:justify-end">
                                {job.status === 'PENDING_APPROVAL' && (
                                    <>
                                        <Button
                                            size="sm"
                                            onClick={() => handleJobAction(job._id, 'PUBLISHED')}
                                            className="bg-green-600 hover:bg-green-700 text-xs h-9"
                                            disabled={isUpdating}
                                        >
                                            <CheckCircle className="mr-2 h-4 w-4" /> Approve & Publish
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleJobAction(job._id, 'DRAFT')}
                                            className="text-amber-600 border-amber-200 hover:bg-amber-50 text-xs h-9"
                                            disabled={isUpdating}
                                        >
                                            <XCircle className="mr-2 h-4 w-4" /> Request Changes
                                        </Button>
                                    </>
                                )}
                                {job.status === 'PUBLISHED' && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleJobAction(job._id, 'CLOSED')}
                                        className="text-red-600 border-red-100 hover:bg-red-50 text-xs h-9"
                                        disabled={isUpdating}
                                    >
                                        <XCircle className="mr-2 h-4 w-4" /> Stop Applications
                                    </Button>
                                )}
                                {job.status === 'CLOSED' && (
                                    <Button
                                        size="sm"
                                        onClick={() => handleJobAction(job._id, 'PUBLISHED')}
                                        className="bg-blue-600 hover:bg-blue-700 text-xs h-9"
                                        disabled={isUpdating}
                                    >
                                        <Send className="mr-2 h-4 w-4" /> Re-open Job
                                    </Button>
                                )}
                                <Link to={`/recruiter/jobs/${job._id}`}>
                                    <Button variant="ghost" size="sm" className="h-9 text-gray-500 hover:text-purple-600">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {filteredJobs?.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed text-gray-400">
                    No placement opportunities found.
                </div>
            )}
        </div>
    );
};

export default ManageJobs;
