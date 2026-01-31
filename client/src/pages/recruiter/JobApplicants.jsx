import { useParams } from 'react-router-dom';
import { useGetJobApplicationsQuery, useUpdateApplicationStatusMutation } from '../../features/jobs/jobApi';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Assuming you have a table component or use HTML
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge"; // Fallback to simple span if missing

const JobApplicants = () => {
    const { jobId } = useParams();
    const { data: applicants, isLoading } = useGetJobApplicationsQuery(jobId);
    const [updateStatus, { isLoading: isUpdating }] = useUpdateApplicationStatusMutation();

    const handleStatusUpdate = async (appId, status) => {
        try {
            await updateStatus({ id: appId, status }).unwrap();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    if (isLoading) return <Loader2 className="animate-spin" />;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Job Applicants</h2>

            <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3">Student Name</th>
                            <th className="px-6 py-3">Department</th>
                            <th className="px-6 py-3">CGPA</th>
                            <th className="px-6 py-3">Resume</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applicants?.map((app) => (
                            <tr key={app._id} className="bg-white border-b hover:bg-gray-50 text-gray-900">
                                <td className="px-6 py-4 font-medium">{app.student.user.name}</td>
                                <td className="px-6 py-4">{app.student.department}</td>
                                <td className="px-6 py-4">{app.student.cgpa}</td>
                                <td className="px-6 py-4">
                                    <a href={app.student.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                        View Resume
                                    </a>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                        ${app.status === 'Applied' ? 'bg-blue-100 text-blue-800' : ''}
                                        ${app.status === 'Shortlisted' ? 'bg-yellow-100 text-yellow-800' : ''}
                                        ${app.status === 'Interview' ? 'bg-purple-100 text-purple-800' : ''}
                                        ${app.status === 'Placed' ? 'bg-green-100 text-green-800' : ''}
                                        ${app.status === 'Rejected' ? 'bg-red-100 text-red-800' : ''}
                                     `}>
                                        {app.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 space-x-2">
                                    {app.status !== 'Placed' && app.status !== 'Rejected' && (
                                        <>
                                            <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(app._id, 'Shortlisted')} disabled={isUpdating} className="text-yellow-600 border-yellow-200 hover:bg-yellow-50">Shortlist</Button>
                                            <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(app._id, 'Interview')} disabled={isUpdating} className="text-purple-600 border-purple-200 hover:bg-purple-50">Interview</Button>
                                            <Button size="sm" onClick={() => handleStatusUpdate(app._id, 'Placed')} disabled={isUpdating} className="bg-green-600 hover:bg-green-700 text-white">Place</Button>
                                            <Button size="sm" variant="destructive" onClick={() => handleStatusUpdate(app._id, 'Rejected')} disabled={isUpdating} className="bg-red-600 hover:bg-red-700 text-white">Reject</Button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {applicants?.length === 0 && (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No applicants yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default JobApplicants;
