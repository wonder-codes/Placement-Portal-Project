import { useGetJobsQuery } from '../../services/jobApi';
import { useGetStudentProfileQuery, useApplyForJobMutation } from '../../services/studentApi';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Briefcase, CheckCircle, XCircle } from "lucide-react";

const StudentJobs = () => {
    const { data: jobs, isLoading: isJobsLoading } = useGetJobsQuery();
    const { data: student, isLoading: isStudentLoading } = useGetStudentProfileQuery();
    const [applyForJob, { isLoading: isApplying }] = useApplyForJobMutation();

    if (isJobsLoading || isStudentLoading) return <div className="flex h-full w-full items-center justify-center"><Loader2 className="animate-spin h-8 w-8" /></div>;

    const isPlaced = student?.placementStatus === 'Placed';

    const handleApply = async (jobId) => {
        try {
            await applyForJob({ jobId }).unwrap();
            alert('Applied Successfully!');
            // Refetch or update happens automatically via tags
        } catch (error) {
            alert(error?.data?.message || 'Failed to apply');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Open Opportunities</h2>
                {isPlaced && <div className="bg-green-100 text-green-800 px-4 py-2 rounded-md font-medium">You are Placed! 🎉</div>}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {jobs?.map((job) => {
                    // Eligibility Check
                    const isCgpaOk = (student?.cgpa || 0) >= (job?.eligibility?.minCGPA || 0);
                    const isBacklogsOk = (student?.backlogs || 0) <= (job?.eligibility?.maxBacklogs || 0);
                    const isBranchOk = !job.eligibility.allowedBranches || job.eligibility.allowedBranches.length === 0 || job.eligibility.allowedBranches.includes(student?.department);

                    const isEligible = isCgpaOk && isBacklogsOk && isBranchOk && !isPlaced;

                    return (
                        <Card key={job._id} className="flex flex-col bg-white border-gray-200">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <CardTitle className="text-gray-900">{job.role}</CardTitle>
                                        <CardDescription className="text-gray-600 font-medium">{job.company?.name || job.companyName}</CardDescription>
                                    </div>
                                    <div className="font-bold text-lg text-gray-900">
                                        ₹{job.package} <span className="text-xs font-normal text-gray-500">LPA</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 text-sm space-y-4">
                                <p className="text-gray-600 line-clamp-3">{job.description}</p>
                                <div className="grid grid-cols-1 gap-2 bg-gray-50 p-3 rounded-md text-gray-700">
                                    <div className="flex items-center gap-2">
                                        {isCgpaOk ? <CheckCircle className="text-green-500 h-4 w-4" /> : <XCircle className="text-red-500 h-4 w-4" />}
                                        <span>Min CGPA: {job.eligibility.minCGPA}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {isBacklogsOk ? <CheckCircle className="text-green-500 h-4 w-4" /> : <XCircle className="text-red-500 h-4 w-4" />}
                                        <span>Max Backlogs: {job.eligibility.maxBacklogs}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {isBranchOk ? <CheckCircle className="text-green-500 h-4 w-4" /> : <XCircle className="text-red-500 h-4 w-4" />}
                                        <span>Branches: {job.eligibility.allowedBranches?.join(', ') || 'All'}</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                    disabled={!isEligible || isApplying}
                                    onClick={() => handleApply(job._id)}
                                >
                                    {isPlaced ? 'Uneligible (Placed)' : (!isCgpaOk || !isBacklogsOk || !isBranchOk) ? 'Not Eligible' : 'Apply Now'}
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
                {jobs?.length === 0 && <p className="text-center col-span-full text-gray-600">No jobs posted yet.</p>}
            </div>
        </div>
    );
};

export default StudentJobs;
