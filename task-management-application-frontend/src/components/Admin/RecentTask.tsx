import { useSelector } from 'react-redux';
import { socket } from '../../main';
import { useState, useEffect } from 'react';
import type { RootState } from '../../redux/store';
import { useDispatch } from 'react-redux';
import axios from 'axios';

interface Activity {
    description: string;
    activityType: 'New Task' | 'New Project' | 'Task Completed' | 'Project Deleted' | 'Task Updated' | 'Project Updated';
    createdAt: string;
}

const ActivityTypeBadge: React.FC<{ type: string }> = ({ type }) => {



    const getTypeColor = (type: string) => {
        switch (type) {
            case 'New Task':
            case 'New Project':
                return 'bg-yellow-100 text-yellow-800';
            case 'Task Completed':
                return 'bg-green-100 text-green-800';
            case 'Project Deleted':
                return 'bg-red-100 text-red-800';
            case 'Task Updated':
            case 'Project Updated':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(type)}`}>
            {type}
        </span>
    );
};

const ActivityFeed = () => {
    const { user } = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch()
    const [activities, setActivities] = useState<Activity[]>([]);

    useEffect(() => {
        const fetchActivity = async () => {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/activity/getActivity/${user?.id}`, { withCredentials: true })
            console.log("asdas : ",  res.data.data)
            const data = res.data.data
            setActivities(data)
        }
        fetchActivity()
    }, [user?.id, dispatch])
    console.log(activities)


    useEffect(() => {
        // Listen for real-time activity updates
        socket.on("newActivity", (data: Activity) => {
            console.log("New activity received: ", data)
            setActivities(prev => [data, ...prev]);
        });

        return () => {
            socket.off("newActivity");
        };
    }, []);

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 60) {
            return `${diffInMinutes}m ago`;
        } else if (diffInMinutes < 1440) {
            return `${Math.floor(diffInMinutes / 60)}h ago`;
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        }
    };

    return (
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Activity Feed</h2>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
                <div className="max-h-96 overflow-y-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Activity
                                </th>
                                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Time
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {activities?.map((activity, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 lg:px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900 truncate max-w-64">{activity.description}</div>
                                    </td>
                                    <td className="px-4 lg:px-6 py-4">
                                        <ActivityTypeBadge type={activity.activityType} />
                                    </td>
                                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                        {formatTimestamp(activity?.createdAt?.split("T")[0])}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
                <div className="max-h-96 overflow-y-auto space-y-3">
                    {activities?.map((activity, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1 min-w-0 mr-2">
                                    <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                                        {activity.description}
                                    </p>
                                </div>
                                <ActivityTypeBadge type={activity.activityType} />
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="text-xs text-gray-500">
                                    {formatTimestamp(activity?.createdAt?.split("T")[0])}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ActivityFeed;