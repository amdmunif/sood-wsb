import React, { useEffect, useState } from 'react';
import {
    getSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
} from '../../services/subjectService';
import { getSubjectCategories } from '../../services/subjectCategoryService';
import type { Subject, SubjectCategory } from '../../types';

const SubjectPage: React.FC = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [categories, setCategories] = useState<SubjectCategory[]>([]);

    const [name, setName] = useState('');
    const [categoryId, setCategoryId] = useState<number | ''>('');

    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchData = async () => {
        try {
            setLoading(true);
            const [subjectsData, categoriesData] = await Promise.all([
                getSubjects(),
                getSubjectCategories(),
            ]);
            setSubjects(subjectsData);
            setCategories(categoriesData);
        } catch (err) {
            setError('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const catId = categoryId ? Number(categoryId) : undefined;

            if (editingId) {
                await updateSubject(editingId, name, catId);
            } else {
                await createSubject(name, catId);
            }
            setName('');
            setCategoryId('');
            setEditingId(null);
            fetchData();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to save subject');
        }
    };

    const handleEdit = (subject: Subject) => {
        setName(subject.name);
        setCategoryId(subject.category_id || '');
        setEditingId(subject.id);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this subject?')) {
            try {
                await deleteSubject(id);
                fetchData();
            } catch (err) {
                alert('Failed to delete subject');
            }
        }
    };

    const handleCancel = () => {
        setName('');
        setCategoryId('');
        setEditingId(null);
        setError('');
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Mata Pelajaran</h1>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">
                    {editingId ? 'Edit Mapel' : 'Tambah Mapel'}
                </h2>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex gap-4 items-end flex-wrap">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nama Mata Pelajaran
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="Contoh: Matematika"
                            required
                        />
                    </div>

                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Kategori
                        </label>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : '')}
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                        >
                            <option value="">-- Pilih Kategori --</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-2">
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
                                onClick={handleCancel}
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
                            <th className="px-6 py-3 font-medium text-gray-500">Nama Mapel</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Kategori</th>
                            <th className="px-6 py-3 font-medium text-gray-500 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {subjects.map((subject) => (
                            <tr key={subject.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-gray-900">{subject.id}</td>
                                <td className="px-6 py-4 text-gray-900 font-medium">{subject.name}</td>
                                <td className="px-6 py-4 text-gray-600">
                                    {subject.category ? (
                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                            {subject.category.name}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleEdit(subject)}
                                        className="text-blue-600 hover:text-blue-800 mr-4"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(subject.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {subjects.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                    Belum ada mata pelajaran.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SubjectPage;
