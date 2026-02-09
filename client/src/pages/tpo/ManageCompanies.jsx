import { useState } from 'react';
import { useGetCompaniesQuery, useUpdateCompanyMutation } from '../../services/companyApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Building2, Globe, MapPin, CheckCircle, Power, User as UserIcon, Mail, Phone, ExternalLink } from "lucide-react";

const ManageCompanies = () => {
    const { data: companies, isLoading, refetch } = useGetCompaniesQuery();
    const [updateCompany, { isLoading: isUpdating }] = useUpdateCompanyMutation();

    const [filter, setFilter] = useState('ALL');

    const handleVerifyCompany = async (id) => {
        try {
            await updateCompany({ id, status: 'ACTIVE' }).unwrap();
            refetch();
            alert('Company Verified Successfully!');
        } catch (err) {
            alert(err?.data?.message || 'Failed to verify company');
        }
    };

    const handleToggleActive = async (id, currentIsActive) => {
        try {
            await updateCompany({ id, isActive: !currentIsActive }).unwrap();
            refetch();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const filteredCompanies = companies?.filter(c => {
        if (filter === 'DRAFT') return c.status === 'DRAFT';
        if (filter === 'ACTIVE') return c.status === 'ACTIVE';
        return true;
    });

    if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Manage Companies</h2>
                    <p className="text-gray-500">Verify registrar profiles and manage recruitment partners</p>
                </div>
                <div className="flex bg-white p-1 rounded-lg border">
                    <Button variant={filter === 'ALL' ? 'secondary' : 'ghost'} size="sm" onClick={() => setFilter('ALL')}>All</Button>
                    <Button variant={filter === 'DRAFT' ? 'secondary' : 'ghost'} size="sm" onClick={() => setFilter('DRAFT')}>Pending Approval</Button>
                    <Button variant={filter === 'ACTIVE' ? 'secondary' : 'ghost'} size="sm" onClick={() => setFilter('ACTIVE')}>Active</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredCompanies?.map(company => (
                    <Card key={company._id} className={`bg-white border-gray-200 overflow-hidden relative ${company.status === 'DRAFT' ? 'border-amber-200 bg-amber-50/10' : ''}`}>
                        {company.status === 'DRAFT' && (
                            <div className="absolute top-0 left-0 w-1 h-full bg-amber-400" />
                        )}
                        <CardHeader className="flex flex-row items-center gap-4 pb-4">
                            <div className="h-12 w-12 rounded-lg border bg-gray-50 p-2 flex items-center justify-center shrink-0">
                                {company.logo ? (
                                    <img src={company.logo} alt="" className="object-contain h-full w-full" />
                                ) : (
                                    <Building2 className="h-6 w-6 text-gray-400" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <CardTitle className="truncate text-lg text-gray-900">{company.name}</CardTitle>
                                    <Badge className={`${company.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'} text-[10px] font-bold`}>
                                        {company.status}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {company.location}</span>
                                    <a href={company.website} target="_blank" className="text-blue-600 flex items-center gap-1 hover:underline">
                                        <Globe className="h-3 w-3" /> Website <ExternalLink className="h-2 w-2" />
                                    </a>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                                {company.description || 'No description provided.'}
                            </p>

                            <div className="bg-gray-50/50 p-3 rounded-lg border border-gray-100 space-y-2">
                                <h4 className="text-[10px] uppercase tracking-wider font-bold text-gray-400 flex items-center gap-1">
                                    <UserIcon className="h-3 w-3" /> HR Contact Details
                                </h4>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                    <p className="text-xs text-gray-700 font-medium truncate">{company.hrContact?.name || 'N/A'}</p>
                                    <p className="text-xs text-gray-500 font-medium truncate flex items-center gap-1"><Mail className="h-2 w-2" /> {company.hrContact?.email || 'N/A'}</p>
                                    <p className="text-[10px] text-gray-400 flex items-center gap-1"><Phone className="h-2 w-2" /> {company.hrContact?.phone || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                                {company.status === 'DRAFT' ? (
                                    <Button
                                        onClick={() => handleVerifyCompany(company._id)}
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-xs h-9"
                                        disabled={isUpdating}
                                    >
                                        <CheckCircle className="mr-2 h-4 w-4" /> Verify & Activate
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outline"
                                        onClick={() => handleToggleActive(company._id, company.isActive)}
                                        className={`flex-1 text-xs h-9 ${company.isActive ? 'text-red-600 border-red-100 hover:bg-red-50' : 'text-green-600 border-green-100 hover:bg-green-50'}`}
                                        disabled={isUpdating}
                                    >
                                        <Power className="mr-2 h-4 w-4" />
                                        {company.isActive ? 'Deactivate' : 'Reactivate'}
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {filteredCompanies?.length === 0 && (
                    <div className="lg:col-span-2 text-center py-20 text-gray-400">
                        No companies found matching the filter.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageCompanies;
