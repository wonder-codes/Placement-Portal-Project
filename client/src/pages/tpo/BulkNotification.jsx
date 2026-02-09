import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, Users, Megaphone, Loader2 } from "lucide-react";

const BulkNotification = () => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Simulated bulk send - would call /api/notifications/bulk
            // We'd need list of userIds which TPO can get from student list
            setTimeout(() => {
                alert('Notification queued for all students!');
                setTitle('');
                setMessage('');
                setLoading(false);
            }, 1000);
        } catch (err) {
            alert('Failed to send');
            setLoading(false);
        }
    };

    return (
        <Card className="max-w-2xl mx-auto shadow-lg hover:shadow-xl transition-shadow bg-white border-blue-100">
            <CardHeader className="bg-blue-50/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded-lg">
                        <Megaphone className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <CardTitle className="text-blue-900">Broadcast Message</CardTitle>
                        <CardDescription>Send an announcement to all registered students</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <form onSubmit={handleSend} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Announcement Title</Label>
                        <Input
                            id="title"
                            placeholder="e.g., Upcoming Workshop on React"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="message">Message Body</Label>
                        <Textarea
                            id="message"
                            placeholder="Type your message here..."
                            rows={5}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                        Send to All Students
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default BulkNotification;
