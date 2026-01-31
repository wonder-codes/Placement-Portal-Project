import { useGetMyApplicationsQuery } from '../../features/student/studentApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Ensure you have a badge component or use HTML/Tailwind
import { Loader2, Calendar, Building } from "lucide-react";

// Simple Badge component if not in UI lib
const StatusBadge = ({ status }) => {
    const colors = {
        Applied: 'bg-blue-100 text-blue-800',
        Shortlisted: 'bg-yellow-100 text-yellow-800',
        Interview: 'bg-purple-100 text-purple-800',
        Placed: 'bg-green-100 text-green-800',
        Rejected: 'bg-red-100 text-red-800',
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
        </span>
    );
};

const StudentApplications = () => {
    const { data: applications, isLoading } = useGetMyApplicationsQuery();

    if (isLoading) return <Loader2 className="animate-spin" />;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">My Applications</h2>

            <div className="grid gap-4">
                {applications?.map((app) => (
                    <Card key={app._id} className="bg-white border-gray-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div>
                                <CardTitle className="text-lg font-bold text-gray-900">{app.job.role}</CardTitle>
                                <CardDescription className="text-gray-600 flex items-center mt-1">
                                    <Building className="mr-1 h-3 w-3" /> {app.job.companyName}
                                </CardDescription>
                            </div>
                            <StatusBadge status={app.status} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-gray-500 flex items-center">
                                <Calendar className="mr-2 h-4 w-4" />
                                Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {applications?.length === 0 && <p className="text-gray-600">You haven't applied to any jobs yet.</p>}
            </div>
        </div>
    );
};

export default StudentApplications;
