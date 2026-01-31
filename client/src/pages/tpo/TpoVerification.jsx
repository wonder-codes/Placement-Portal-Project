import { useGetUsersToVerifyQuery, useVerifyUserMutation } from '../../features/tpo/tpoApi';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Check } from "lucide-react";

const TpoVerification = () => {
    const { data: users, isLoading } = useGetUsersToVerifyQuery();
    const [verifyUser, { isLoading: isVerifying }] = useVerifyUserMutation();

    if (isLoading) return <Loader2 className="animate-spin" />;

    const handleVerify = async (id) => {
        try {
            await verifyUser(id).unwrap();
            // Refetch happens automatically
        } catch (error) {
            alert('Failed to verify');
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Pending Verifications</h2>
            <div className="grid gap-4">
                {users?.map((user) => (
                    <Card key={user._id} className="bg-white border-gray-200">
                        <CardContent className="p-4 flex justify-between items-center">
                            <div>
                                <p className="font-bold text-lg text-gray-900">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email} • <span className="font-medium text-gray-700">{user.role}</span></p>
                            </div>
                            <Button size="sm" onClick={() => handleVerify(user._id)} disabled={isVerifying} className="bg-green-600 hover:bg-green-700 text-white">
                                <Check className="mr-2 h-4 w-4" /> Verify User
                            </Button>
                        </CardContent>
                    </Card>
                ))}
                {users?.length === 0 && <p className="text-gray-600">No pending verifications.</p>}
            </div>
        </div>
    );
};

export default TpoVerification;
