import React, { useEffect, useState } from 'react';
import {
    getSubjectCategories,
    createSubjectCategory,
    updateSubjectCategory,
    deleteSubjectCategory,
} from '../../services/subjectCategoryService';
import type { SubjectCategory } from '../../types';

const SubjectCategoryPage: React.FC = () => {
    const [categories, setCategories] = useState<SubjectCategory[]>([]);
    const [name, setName] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await getSubjectCategories();
            setCategories(data);
        } catch (err) {
            setError('Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            if (editingId) {
                await updateSubjectCategory(editingId, name);
            } else {
                await createSubjectCategory(name);
            }
            setName('');
            setEditingId(null);
            fetchCategories();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to save category');
        }
    };

    const handleEdit = (category: SubjectCategory) => {
        setName(category.name);
        setEditingId(category.id);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await deleteSubjectCategory(id);
                fetchCategories();
            } catch (err) {
                alert('Failed to delete category');
            }
        }
    };

    const handleCancel = () => {
        setName('');
        setEditingId(null);
        setError('');
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Kategori Mata Pelajaran</h1>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">
                    {editingId ? 'Edit Kategori' : 'Tambah Kategori'}
                </h2>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nama Kategori
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                            placeholder="Contoh: Wajib"
                            required
                        />
                    </div>
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
                </form>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 font-medium text-gray-500">ID</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Nama Kategori</th>
                            <th className="px-6 py-3 font-medium text-gray-500 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {categories.map((category) => (
                            <tr key={category.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-gray-900">{category.id}</td>
                                <td className="px-6 py-4 text-gray-900 font-medium">{category.name}</td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleEdit(category)}
                                        className="text-blue-600 hover:text-blue-800 mr-4"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                    Belum ada kategori data pelajaran.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SubjectCategoryPage;
