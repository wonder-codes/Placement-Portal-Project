import { useGetMyApplicationsQuery, useRespondToOfferMutation } from '../../services/studentApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, Building, Clock, MapPin, Check, X } from "lucide-react";

const StatusBadge = ({ status }) => {
    const colors = {
        Applied: 'bg-blue-100 text-blue-800',
        'Test Scheduled': 'bg-yellow-100 text-yellow-800',
        'Interview Scheduled': 'bg-indigo-100 text-indigo-800',
        'Selected': 'bg-green-100 text-green-800 font-bold animate-pulse',
        'Offer Accepted': 'bg-emerald-600 text-white font-bold',
        'Offer Rejected': 'bg-gray-100 text-gray-800',
        Rejected: 'bg-red-100 text-red-800',
    };
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
        </span>
    );
};

const StudentApplications = () => {
    const { data: applications, isLoading } = useGetMyApplicationsQuery();
    const [respondToOffer, { isLoading: isResponding }] = useRespondToOfferMutation();

    const handleResponse = async (id, response) => {
        try {
            await respondToOffer({ applicationId: id, response }).unwrap();
            alert(`Offer ${response} successfully!`);
        } catch (err) {
            alert('Action failed');
        }
    };

    if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8" /></div>;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">My Applications</h2>

            <div className="grid gap-6">
                {applications?.map((app) => (
                    <Card key={app._id} className="bg-white border-gray-200 overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-gray-50/50">
                            <div>
                                <CardTitle className="text-xl font-bold text-gray-900">{app.job.role}</CardTitle>
                                <CardDescription className="text-gray-600 flex items-center mt-1">
                                    <Building className="mr-1 h-3 w-3" /> {app.job.company?.name || app.job.companyName}
                                </CardDescription>
                            </div>
                            <StatusBadge status={app.status} />
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                                <div className="flex items-center">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Applied: {new Date(app.createdAt).toLocaleDateString()}
                                </div>
                                {app.testSchedule?.dateTime && (
                                    <div className="flex items-center text-yellow-700 bg-yellow-50 px-2 py-1 rounded">
                                        <Clock className="mr-2 h-4 w-4" />
                                        Test: {new Date(app.testSchedule.dateTime).toLocaleString()}
                                    </div>
                                )}
                                {app.interviewSchedule?.dateTime && (
                                    <div className="flex items-center text-indigo-700 bg-indigo-50 px-2 py-1 rounded">
                                        <Clock className="mr-2 h-4 w-4" />
                                        Interview: {new Date(app.interviewSchedule.dateTime).toLocaleString()}
                                    </div>
                                )}
                            </div>

                            {app.status === 'Selected' && (
                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-3">
                                    <p className="text-green-800 font-medium">Congratulations! You have been selected. Please respond to the offer.</p>
                                    <div className="flex gap-3">
                                        <Button
                                            onClick={() => handleResponse(app._id, 'Accepted')}
                                            disabled={isResponding}
                                            className="bg-green-600 hover:bg-green-700 h-9"
                                        >
                                            <Check className="mr-2 h-4 w-4" /> Accept Offer
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => handleResponse(app._id, 'Rejected')}
                                            disabled={isResponding}
                                            className="border-red-200 text-red-600 hover:bg-red-50 h-9"
                                        >
                                            <X className="mr-2 h-4 w-4" /> Reject
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {app.status === 'Offer Accepted' && (
                                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                                    <p className="text-emerald-800 font-bold flex items-center">
                                        <Check className="mr-2 h-5 w-5" /> You have accepted this offer!
                                    </p>
                                    <p className="text-sm text-emerald-600 mt-1">Further applications are now locked as per placement policy.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
                {applications?.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg border border-dashed">
                        <p className="text-gray-500">You haven't applied to any jobs yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentApplications;
