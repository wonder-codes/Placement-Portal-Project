import { useEffect, useState } from 'react';
import io from 'socket.io-client'; // Default import
import { BellRing } from 'lucide-react';

// Use same socket instance config as in your live ticker previously
// Or establish connection here simply
const socketUrl = 'http://localhost:5000'; // Make sure this matches your backend

const LiveTicker = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const socket = io('/', { path: '/socket.io' }); // Using proxy path if configured or direct URL

        socket.on('placement_update', (data) => {
            const message = `${data.studentName} (${data.department}) placed at ${data.company} with ${data.package} LPA! 🚀`;
            setNotifications(prev => [message, ...prev.slice(0, 4)]);
        });

        return () => socket.disconnect();
    }, []);

    return (
        <div className="flex items-center gap-4 overflow-hidden h-8">
            <div className="flex items-center text-teal-600 font-bold whitespace-nowrap">
                <BellRing className="mr-2 h-4 w-4" />
                Live Updates:
            </div>
            <div className="flex-1 overflow-hidden relative">
                <div className="animate-marquee whitespace-nowrap text-sm font-medium text-gray-700">
                    {notifications.length > 0 ? notifications.join(' | ') : 'Waiting for new placements...'}
                </div>
            </div>
            <style>{`
                .animate-marquee {
                    display: inline-block;
                    animation: marquee 20s linear infinite;
                }
                @keyframes marquee {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
            `}</style>
        </div>
    );
};

export default LiveTicker;
