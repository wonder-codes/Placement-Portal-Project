import { useState } from 'react';
import { useGetTpoStudentsQuery, useUpdateTpoStudentStatusMutation } from '../../features/tpo/tpoApi';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Filter, GraduationCap, Building2, CheckCircle2, MoreVertical, Mail } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const ManageStudents = () => {
    const { data: students, isLoading } = useGetTpoStudentsQuery();
    const [updateStatus, { isLoading: isUpdating }] = useUpdateTpoStudentStatusMutation();

    const [searchTerm, setSearchTerm] = useState('');
    const [deptFilter, setDeptFilter] = useState('All');
    const [selectedStudent, setSelectedStudent] = useState(null);

    const filteredStudents = students?.filter(s => {
        const matchesSearch = s.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = deptFilter === 'All' || s.department === deptFilter;
        return matchesSearch && matchesDept;
    });

    const handleUpdateStatus = async (id, status) => {
        try {
            await updateStatus({ id, placementStatus: status }).unwrap();
            setSelectedStudent(null);
            alert('Status updated successfully');
        } catch (err) {
            alert('Failed to update status');
        }
    };

    if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Student Directory</h2>
                    <p className="text-gray-500">Monitor academic performance and placement status of all students</p>
                </div>
            </div>

            <Card className="bg-white shadow-sm border-gray-200">
                <CardContent className="p-4 grid md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search students by name or email..."
                            className="pl-9 bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="h-10 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm"
                        value={deptFilter}
                        onChange={(e) => setDeptFilter(e.target.value)}
                    >
                        <option value="All">All Departments</option>
                        {['CS', 'IT', 'MECH', 'ECE', 'CIVIL'].map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                </CardContent>
            </Card>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-gray-900">
                <table className="w-full text-sm text-left">
                    <thead className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-4">Student</th>
                            <th className="px-6 py-4">Academic Details</th>
                            <th className="px-6 py-4">Placement Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredStudents?.map((student) => (
                            <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
                                            {student.user.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{student.user.name}</p>
                                            <p className="text-xs text-gray-400 flex items-center gap-1"><Mail className="h-3 w-3" /> {student.user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-[10px] border-teal-200 text-teal-700 font-bold">{student.department}</Badge>
                                            <span className="text-xs font-bold text-gray-700">{student.cgpa} CGPA</span>
                                        </div>
                                        <p className="text-[10px] text-gray-400">Class of {student.graduationYear}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge className={`text-[10px] font-bold ${student.placementStatus === 'Placed' ? 'bg-green-100 text-green-700' :
                                            student.placementStatus === 'Unplaced' ? 'bg-gray-100 text-gray-700' :
                                                'bg-blue-100 text-blue-700'
                                        }`}>
                                        {student.placementStatus}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSelectedStudent(student)}
                                        className="h-8 w-8 p-0"
                                    >
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Manual Status Edit Dialog */}
            <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Placement Status</DialogTitle>
                    </DialogHeader>
                    <div className="py-6 space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-lg">
                                {selectedStudent?.user.name[0]}
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">{selectedStudent?.user.name}</p>
                                <p className="text-xs text-gray-500">{selectedStudent?.department} • {selectedStudent?.cgpa} CGPA</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Select New Status</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['Unplaced', 'Placed', 'Progress', 'Not Eligible'].map(status => (
                                    <Button
                                        key={status}
                                        variant={selectedStudent?.placementStatus === status ? 'secondary' : 'outline'}
                                        onClick={() => handleUpdateStatus(selectedStudent._id, status)}
                                        disabled={isUpdating}
                                        className="justify-start py-6 text-gray-900 bg-white"
                                    >
                                        {status}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setSelectedStudent(null)}>Cancel</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ManageStudents;
