import { useGetAnalyticsQuery } from '../../features/tpo/tpoApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, TrendingUp, Users, Award, IndianRupee, PieChart as PieIcon, BarChart3, Target } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const TpoAnalytics = () => {
    const { data: analytics, isLoading } = useGetAnalyticsQuery();

    if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8 text-teal-600" /></div>;

    const COLORS = ['#0d9488', '#0ea5e9', '#6366f1', '#8b5cf6', '#ec4899'];

    const StatCard = ({ title, value, icon: Icon, description, colorClass }) => (
        <Card className="bg-white border-gray-200 overflow-hidden relative">
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</p>
                        <h3 className={`text-3xl font-bold mt-1 ${colorClass}`}>{value}</h3>
                        <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" /> {description}
                        </p>
                    </div>
                    <div className={`p-3 rounded-xl bg-gray-50 ${colorClass.replace('text', 'text-opacity-20')}`}>
                        <Icon className={`h-6 w-6 ${colorClass}`} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-8 pb-12">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Placement Intelligence</h2>
                    <p className="text-gray-500">Real-time performance metrics and department insights</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase italic">Last Updated: {new Date().toLocaleTimeString()}</p>
                </div>
            </div>

            {/* Top Row Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Pool"
                    value={analytics?.totalStudents || 0}
                    icon={Users}
                    description="Verified Students"
                    colorClass="text-gray-900"
                />
                <StatCard
                    title="Placed"
                    value={analytics?.placedStudents || 0}
                    icon={Award}
                    description="Successful Offers"
                    colorClass="text-green-600"
                />
                <StatCard
                    title="Efficiency"
                    value={`${analytics?.placementPercentage || 0}%`}
                    icon={Target}
                    description="Placement Conversion"
                    colorClass="text-teal-600"
                />
                <StatCard
                    title="Avg Package"
                    value={`₹${analytics?.avgPackage || 0}L`}
                    icon={IndianRupee}
                    description="Lakhs Per Annum"
                    colorClass="text-blue-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Departmental Bar Chart */}
                <Card className="lg:col-span-2 bg-white border-gray-200 shadow-sm">
                    <CardHeader className="border-b bg-gray-50/30">
                        <div className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-teal-600" />
                            <div>
                                <CardTitle className="text-lg">Departmental Breakdown</CardTitle>
                                <CardDescription>Student placement ratio across engineering branches</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics?.departmentStats || []} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: '#f8fafc' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar dataKey="total" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Registered" barSize={40} />
                                <Bar dataKey="placed" fill="#0d9488" radius={[4, 4, 0, 0]} name="Placed" barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Status Distribution Pie Chart */}
                <Card className="bg-white border-gray-200 shadow-sm">
                    <CardHeader className="border-b bg-gray-50/30">
                        <div className="flex items-center gap-2">
                            <PieIcon className="h-5 w-5 text-teal-600" />
                            <div>
                                <CardTitle className="text-lg">Status Ratio</CardTitle>
                                <CardDescription>Market readiness distribution</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="h-[350px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Placed', value: analytics?.placedStudents || 0 },
                                        { name: 'Unplaced', value: (analytics?.totalStudents || 0) - (analytics?.placedStudents || 0) }
                                    ]}
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {[0, 1].map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#0d9488' : '#cbd5e1'} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-gray-900 font-bold text-2xl">
                                    {analytics?.placementPercentage}%
                                </text>
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default TpoAnalytics;
