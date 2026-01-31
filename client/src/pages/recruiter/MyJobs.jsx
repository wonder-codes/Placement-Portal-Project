import { useGetMyJobsQuery } from '../../features/jobs/jobApi';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Loader2, Users } from "lucide-react";

const MyJobs = () => {
    const { data: jobs, isLoading } = useGetMyJobsQuery();

    if (isLoading) return <Loader2 className="animate-spin" />;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Posted Jobs</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {jobs?.map((job) => (
                    <Card key={job._id} className="bg-white border-gray-200 shadow-sm flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-gray-900">{job.role}</CardTitle>
                            <CardDescription className="text-gray-600">{job.companyName}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="text-sm text-gray-600 space-y-2">
                                <p><strong>Package:</strong> ₹{job.package} LPA</p>
                                <p><strong>Min CGPA:</strong> {job.eligibility.minCGPA}</p>
                                <p className="line-clamp-2">{job.description}</p>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Link to={`/recruiter/jobs/${job._id}`} className="w-full">
                                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                                    <Users className="mr-2 h-4 w-4" /> View Applicants
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
                {jobs?.length === 0 && <p className="text-gray-600">No jobs posted yet.</p>}
            </div>
        </div>
    );
};

export default MyJobs;
