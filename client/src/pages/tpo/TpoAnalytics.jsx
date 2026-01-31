import { useGetAnalyticsQuery } from '../../features/tpo/tpoApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TpoAnalytics = () => {
    const { data: analytics, isLoading } = useGetAnalyticsQuery();

    if (isLoading) return <Loader2 className="animate-spin" />;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-white border-gray-200">
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">Total Students</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-gray-900">{analytics?.totalStudents || 0}</div></CardContent>
                </Card>
                <Card className="bg-white border-gray-200">
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">Placed</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-green-600">{analytics?.placedStudents || 0}</div></CardContent>
                </Card>
                <Card className="bg-white border-gray-200">
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">Placement %</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-blue-600">{analytics?.placementPercentage || 0}%</div></CardContent>
                </Card>
                <Card className="bg-white border-gray-200">
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">Avg Package</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-gray-900">₹{analytics?.avgPackage || 0} LPA</div></CardContent>
                </Card>
            </div>

            <Card className="col-span-4 bg-white border-gray-200">
                <CardHeader>
                    <CardTitle className="text-gray-900">Placement by Department</CardTitle>
                    <CardDescription>Comparison of total vs placed students</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics?.departmentStats || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="_id" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="total" fill="#8884d8" name="Total Students" />
                            <Bar dataKey="placed" fill="#82ca9d" name="Placed Students" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
};

export default TpoAnalytics;
