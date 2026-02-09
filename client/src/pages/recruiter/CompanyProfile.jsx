import { useState, useEffect } from 'react';
import { useGetMyCompanyQuery, useCreateCompanyMutation, useUpdateCompanyMutation } from '../../services/companyApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Globe, MapPin, Loader2, Save, Edit, Phone, Mail, User as UserIcon } from "lucide-react";

const CompanyProfile = () => {
    const { data: company, isLoading, refetch } = useGetMyCompanyQuery();
    const [createCompany, { isLoading: isCreating }] = useCreateCompanyMutation();
    const [updateCompany, { isLoading: isUpdating }] = useUpdateCompanyMutation();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        website: '',
        location: '',
        logo: '',
        hrContact: { name: '', email: '', phone: '' }
    });

    useEffect(() => {
        if (company) {
            setFormData({
                name: company.name || '',
                description: company.description || '',
                website: company.website || '',
                location: company.location || '',
                logo: company.logo || '',
                hrContact: company.hrContact || { name: '', email: '', phone: '' }
            });
        }
    }, [company]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (company) {
                await updateCompany({ id: company._id, ...formData }).unwrap();
            } else {
                await createCompany(formData).unwrap();
            }
            setIsEditing(false);
            refetch();
            alert('Profile saved successfully!');
        } catch (err) {
            alert(err?.data?.message || 'Failed to save profile');
        }
    };

    if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8" /></div>;

    const showForm = isEditing || !company;

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-900">Company Profile</h2>
                {company && !isEditing && (
                    <Button onClick={() => setIsEditing(true)} variant="outline">
                        <Edit className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
                )}
            </div>

            {company && (
                <div className="flex items-center gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${company.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        Status: {company.status}
                    </span>
                    {company.status === 'DRAFT' && (
                        <span className="text-xs text-gray-500 italic">Waiting for TPO approval</span>
                    )}
                </div>
            )}

            {!showForm ? (
                <Card className="bg-white shadow-sm border-gray-200">
                    <CardHeader className="flex flex-row items-center gap-4 border-b">
                        <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                            {company.logo ? (
                                <img src={company.logo} alt="Logo" className="w-12 h-12 object-contain" />
                            ) : (
                                <Building2 className="h-10 w-10 text-purple-600" />
                            )}
                        </div>
                        <div>
                            <CardTitle className="text-2xl text-gray-900">{company.name}</CardTitle>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {company.location}</span>
                                <span className="flex items-center gap-1 text-blue-600">
                                    <Globe className="h-4 w-4" />
                                    <a href={company.website} target="_blank">{company.website}</a>
                                </span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-8">
                        <div>
                            <Label className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-2 block">About Company</Label>
                            <p className="text-gray-700 leading-relaxed text-sm">{company.description}</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 pt-6 border-t">
                            <div className="space-y-1">
                                <Label className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-2 block">HR Contact</Label>
                                <div className="space-y-2">
                                    <p className="flex items-center text-sm font-medium"><UserIcon className="h-4 w-4 mr-2 text-gray-400" /> {company.hrContact?.name || 'N/A'}</p>
                                    <p className="flex items-center text-sm text-gray-600"><Mail className="h-4 w-4 mr-2 text-gray-400" /> {company.hrContact?.email || 'N/A'}</p>
                                    <p className="flex items-center text-sm text-gray-600"><Phone className="h-4 w-4 mr-2 text-gray-400" /> {company.hrContact?.phone || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>{company ? 'Edit Company Profile' : 'Initialize Company Profile'}</CardTitle>
                        <CardDescription>Provide details about your organization to post job opportunities.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6 text-gray-900">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Company Name</Label>
                                    <Input
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        disabled={company?.status === 'ACTIVE'}
                                        required
                                        className="bg-white border-gray-300"
                                    />
                                    {company?.status === 'ACTIVE' && <p className="text-[10px] text-gray-500 italic">Contact TPO to change official name</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Website URL</Label>
                                    <Input
                                        value={formData.website}
                                        onChange={e => setFormData({ ...formData, website: e.target.value })}
                                        placeholder="https://company.com"
                                        className="bg-white border-gray-300"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Location</Label>
                                    <Input
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="City, State"
                                        className="bg-white border-gray-300"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Logo URL</Label>
                                    <Input
                                        value={formData.logo}
                                        onChange={e => setFormData({ ...formData, logo: e.target.value })}
                                        placeholder="https://logo.url/img.png"
                                        className="bg-white border-gray-300"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>About Company</Label>
                                <Textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    className="bg-white border-gray-300"
                                />
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg space-y-4 border">
                                <h3 className="text-sm font-bold flex items-center"><UserIcon className="h-4 w-4 mr-2" /> HR Contact Details</h3>
                                <div className="grid md:grid-cols-3 gap-4 text-gray-900">
                                    <div className="space-y-2">
                                        <Label>Name</Label>
                                        <Input
                                            value={formData.hrContact.name}
                                            onChange={e => setFormData({ ...formData, hrContact: { ...formData.hrContact, name: e.target.value } })}
                                            className="bg-white border-gray-300"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input
                                            value={formData.hrContact.email}
                                            onChange={e => setFormData({ ...formData, hrContact: { ...formData.hrContact, email: e.target.value } })}
                                            className="bg-white border-gray-300"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Phone</Label>
                                        <Input
                                            value={formData.hrContact.phone}
                                            onChange={e => setFormData({ ...formData, hrContact: { ...formData.hrContact, phone: e.target.value } })}
                                            className="bg-white border-gray-300"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700" disabled={isCreating || isUpdating}>
                                    {(isCreating || isUpdating) ? <Loader2 className="mr-2 animate-spin h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                                    Save Profile
                                </Button>
                                {company && (
                                    <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default CompanyProfile;
