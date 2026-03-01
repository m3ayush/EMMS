import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../hooks/useApi';

const DEPARTMENTS = [
    'All',
    'Computer Science',
    'Electronics',
    'Mechanical',
    'Civil',
    'Biomedical',
    'Information Technology',
    'Electrical',
];

export default function AllFacultyPage() {
    const [faculty, setFaculty] = useState([]);
    const [loading, setLoading] = useState(true);
    const [departmentFilter, setDepartmentFilter] = useState('All');

    useEffect(() => {
        const fetchFaculty = async () => {
            setLoading(true);
            try {
                const query = departmentFilter !== 'All' ? `?department=${encodeURIComponent(departmentFilter)}&limit=1000` : '?limit=1000';
                const res = await api.get(`/admin/faculty${query}`);
                setFaculty(res.data.data.faculty);
            } catch (err) {
                console.error('Error fetching faculty:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchFaculty();
    }, [departmentFilter]);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-3xl font-black text-black">Faculty Members</h1>
                <div className="flex items-center space-x-2">
                    <label htmlFor="department-filter" className="text-sm font-bold text-black">
                        Filter by Department:
                    </label>
                    <select
                        id="department-filter"
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        className="rounded-md border-2 border-black px-3 py-1.5 text-sm font-bold bg-white focus:ring-2 focus:ring-brutal-primary focus:outline-none shadow-[2px_2px_0px_0px_black] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_black] transition-all cursor-pointer"
                    >
                        {DEPARTMENTS.map((dept) => (
                            <option key={dept} value={dept}>
                                {dept}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_black] p-6">
                {loading ? (
                    <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-3 border-black"></div></div>
                ) : faculty.length === 0 ? (
                    <p className="text-sm text-gray-600 font-medium">No faculty members found for the selected department.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b-2 border-black">
                                    <th className="text-left py-2 text-black font-bold">Faculty</th>
                                    <th className="text-left py-2 text-black font-bold">Department</th>
                                    <th className="text-left py-2 text-black font-bold">Active MoUs</th>
                                    <th className="text-right py-2 text-black font-bold">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {faculty.map((item) => (
                                    <tr key={item._id} className="border-b-2 border-black/20 hover:bg-black/5 transition-colors">
                                        <td className="py-3">
                                            <Link to={`/senior/faculty/${item._id}`} className="text-black font-bold underline decoration-2 hover:bg-brutal-primary inline-block">
                                                {item.name}
                                            </Link>
                                        </td>
                                        <td className="py-3 text-gray-700 font-medium">{item.department}</td>
                                        <td className="py-3 text-gray-700 font-medium">{item.activeMouCount} MoU(s)</td>
                                        <td className="py-3 text-right">
                                            <Link to={`/senior/faculty/${item._id}`}
                                                className="text-xs px-3 py-1.5 rounded-md bg-white text-black font-bold border-2 border-black shadow-[3px_3px_0px_0px_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all inline-block">
                                                View Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
