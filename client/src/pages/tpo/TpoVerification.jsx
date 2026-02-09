import { useGetUsersToVerifyQuery, useVerifyUserMutation } from '../../features/tpo/tpoApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, UserCheck, ShieldAlert, Mail, User as UserIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TpoVerification = () => {
    const { data: users, isLoading } = useGetUsersToVerifyQuery();
    const [verifyUser, { isLoading: isVerifying }] = useVerifyUserMutation();

    const handleVerify = async (id) => {
        try {
            await verifyUser(id).unwrap();
        } catch (error) {
            alert('Failed to verify user');
        }
    };

    if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8 text-teal-600" /></div>;

    const recruiters = users?.filter(u => u.role === 'Recruiter') || [];
    const students = users?.filter(u => u.role === 'Student') || [];

    const VerifyCard = ({ user }) => (
        <Card key={user._id} className="bg-white border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${user.role === 'Recruiter' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                        {user.name[0]}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 flex items-center gap-2">
                            {user.name}
                            <Badge variant="outline" className="text-[10px] font-bold uppercase">{user.role}</Badge>
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {user.email}
                        </p>
                    </div>
                </div>
                <Button
                    size="sm"
                    onClick={() => handleVerify(user._id)}
                    disabled={isVerifying}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs"
                >
                    <UserCheck className="mr-2 h-4 w-4" /> Approve
                </Button>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Identity Verification</h2>
                <p className="text-gray-500">Approve new account requests from students and recruitment partners</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Recruiter Queue */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <ShieldAlert className="h-5 w-5 text-purple-600" />
                        <h3 className="font-bold text-gray-700">Recruiter Requests</h3>
                        <Badge className="ml-2 bg-purple-100 text-purple-700">{recruiters.length}</Badge>
                    </div>
                    <div className="grid gap-3">
                        {recruiters.map(user => <VerifyCard key={user._id} user={user} />)}
                        {recruiters.length === 0 && (
                            <div className="p-8 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 text-gray-400 text-sm">
                                No pending recruiter verifications
                            </div>
                        )}
                    </div>
                </div>

                {/* Student Queue */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <ShieldAlert className="h-5 w-5 text-blue-600" />
                        <h3 className="font-bold text-gray-700">Student Requests</h3>
                        <Badge className="ml-2 bg-blue-100 text-blue-700">{students.length}</Badge>
                    </div>
                    <div className="grid gap-3">
                        {students.map(user => <VerifyCard key={user._id} user={user} />)}
                        {students.length === 0 && (
                            <div className="p-8 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 text-gray-400 text-sm">
                                No pending student verifications
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TpoVerification;
