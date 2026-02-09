import { useGetMyJobsQuery, useUpdateJobMutation } from '../../services/jobApi';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Loader2, Users, Edit3, Send, Power, Building2, MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const MyJobs = () => {
    const { data: jobs, isLoading, refetch } = useGetMyJobsQuery();
    const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();

    const handleStatusUpdate = async (id, status) => {
        try {
            await updateJob({ id, status }).unwrap();
            refetch();
            alert(`Job status updated to ${status}`);
        } catch (err) {
            alert(err?.data?.message || 'Failed to update status');
        }
    };

    if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8" /></div>;

    const getStatusColor = (status) => {
        switch (status) {
            case 'DRAFT': return 'bg-gray-100 text-gray-700 border-gray-200';
            case 'PENDING_APPROVAL': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'PUBLISHED': return 'bg-green-100 text-green-700 border-green-200';
            case 'CLOSED': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-6 pb-12">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Manage Job Posts</h2>
                    <p className="text-gray-500">View and track status of your job opportunities</p>
                </div>
                <Link to="/recruiter/post-job">
                    <Button className="bg-purple-600 hover:bg-purple-700">Post New Job</Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {jobs?.map((job) => (
                    <Card key={job._id} className="bg-white border-gray-200 shadow-sm flex flex-col group hover:shadow-md transition-all">
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start mb-2">
                                <Badge className={`${getStatusColor(job.status)} variant-outline font-bold text-[10px]`}>
                                    {job.status}
                                </Badge>
                                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {new Date(job.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                                {job.role}
                            </CardTitle>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                <Building2 className="w-3 h-3" /> {job.company?.name}
                                <span className="text-gray-300">|</span>
                                <MapPin className="w-3 h-3" /> {job.location || 'N/A'}
                            </div>
                        </CardHeader>

                        <CardContent className="flex-1 space-y-4">
                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Package</p>
                                    <p className="text-sm font-bold text-gray-800">₹{job.package} LPA</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">CGPA</p>
                                    <p className="text-sm font-bold text-gray-800">{job.eligibility.minCGPA}+</p>
                                </div>
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed italic">
                                "{job.description}"
                            </p>
                        </CardContent>

                        <CardFooter className="flex flex-col gap-2 pt-2 border-t mt-auto">
                            <div className="flex w-full gap-2">
                                <Link to={`/recruiter/jobs/${job._id}`} className="flex-1">
                                    <Button variant="outline" className="w-full h-9 text-xs border-purple-200 text-purple-700 hover:bg-purple-50">
                                        <Users className="mr-2 h-3.5 w-3.5" /> Applicants
                                    </Button>
                                </Link>
                                {job.status === 'DRAFT' && (
                                    <Button onClick={() => handleStatusUpdate(job._id, 'PENDING_APPROVAL')} className="flex-1 bg-purple-600 hover:bg-purple-700 h-9 text-xs">
                                        <Send className="mr-2 h-3.5 w-3.5" /> Submit
                                    </Button>
                                )}
                            </div>

                            {job.status === 'PUBLISHED' && (
                                <Button onClick={() => handleStatusUpdate(job._id, 'CLOSED')} variant="outline" className="w-full h-8 text-xs text-red-600 border-red-100 hover:bg-red-50">
                                    <Power className="mr-2 h-3.5 w-3.5" /> Close Applications
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>
            {jobs?.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 font-medium">No jobs posted yet. Start by creating your first opportunity!</p>
                </div>
            )}
        </div>
    );
};

export default MyJobs;
