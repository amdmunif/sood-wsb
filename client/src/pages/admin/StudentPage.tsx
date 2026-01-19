import React, { useEffect, useState } from 'react';
import {
    getStudents,
    createStudent,
    updateStudent,
    deleteStudent,
} from '../../services/studentService';
import type { Student } from '../../types';

const StudentPage: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [nik, setNik] = useState('');
    const [pkbmId, setPkbmId] = useState<number | ''>(''); // Mock PKBM selection

    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const data = await getStudents();
            setStudents(data);
        } catch (err) {
            setError('Failed to fetch students');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            // Validate NIK length locally
            if (nik && nik.length !== 16) {
                setError('NIK has to be 16 digits');
                return;
            }

            const payload = {
                name,
                email,
                nik: nik || null,
                pkbm_id: pkbmId ? Number(pkbmId) : 1, // Defaulting to 1 for dev if not selected
            };

            if (editingId) {
                await updateStudent(editingId, payload);
            } else {
                await createStudent(payload);
            }

            resetForm();
            fetchStudents();
        } catch (err: any) {
            const errorMsg = err.response?.data?.error;
            if (Array.isArray(errorMsg)) {
                setError(errorMsg.map((e: any) => e.message).join(', '));
            } else {
                setError(errorMsg || 'Failed to save student');
            }
        }
    };

    const resetForm = () => {
        setName('');
        setEmail('');
        setNik('');
        setPkbmId('');
        setEditingId(null);
        setError('');
    };

    const handleEdit = (student: Student) => {
        setName(student.name);
        setEmail(student.email);
        setNik(student.nik || '');
        setPkbmId(student.pkbm_id);
        setEditingId(student.id);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await deleteStudent(id);
                fetchStudents();
            } catch (err) {
                alert('Failed to delete student');
            }
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Manajemen Siswa</h1>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">
                    {editingId ? 'Edit Siswa' : 'Tambah Siswa Baru'}
                </h2>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">NIK (16 Digit)</label>
                        <input
                            type="text"
                            value={nik}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, ''); // Only numbers
                                if (val.length <= 16) setNik(val);
                            }}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="3307xxxxxxxxxxxx"
                        />
                        <p className="text-xs text-gray-500 mt-1">{nik.length}/16 digit</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">PKBM ID</label>
                        <input
                            type="number"
                            value={pkbmId}
                            onChange={(e) => setPkbmId(e.target.value ? Number(e.target.value) : '')}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="1"
                            required
                        />
                    </div>

                    <div className="md:col-span-2 flex gap-2 mt-2">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : (editingId ? 'Update' : 'Simpan')}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
                            >
                                Batal
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 font-medium text-gray-500">ID</th>
                            <th className="px-6 py-3 font-medium text-gray-500">NIK</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Nama</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Email</th>
                            <th className="px-6 py-3 font-medium text-gray-500 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {students.map((student) => (
                            <tr key={student.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-gray-900">{student.id}</td>
                                <td className="px-6 py-4 text-gray-900 font-mono">{student.nik || '-'}</td>
                                <td className="px-6 py-4 text-gray-900 font-medium">{student.name}</td>
                                <td className="px-6 py-4 text-gray-500">{student.email}</td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleEdit(student)}
                                        className="text-blue-600 hover:text-blue-800 mr-4"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(student.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {students.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    Belum ada data siswa.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentPage;
