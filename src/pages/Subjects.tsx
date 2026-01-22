import { useEffect, useState } from 'react';
import { subjectService } from '../services/subjectService';
import type { Subject } from '../services/subjectService';
import { subjectCategoryService } from '../services/categoryService';
import type { SubjectCategory } from '../services/categoryService';

const Subjects: React.FC = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [categories, setCategories] = useState<SubjectCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

    // Form state
    const [name, setName] = useState('');
    const [categoryId, setCategoryId] = useState<number | ''>('');
    const [sortOrder, setSortOrder] = useState(0);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [subjectsData, categoriesData] = await Promise.all([
                subjectService.getAll(),
                subjectCategoryService.getAll()
            ]);
            setSubjects(subjectsData);
            setCategories(categoriesData);
        } catch (error) {
            console.error('Failed to fetch data', error);
            alert('Gagal mengambil data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                name,
                category_id: categoryId === '' ? null : Number(categoryId),
                sort_order: sortOrder
            };

            if (editingSubject) {
                await subjectService.update(editingSubject.id, payload);
            } else {
                await subjectService.create(payload);
            }
            closeModal();
            fetchData();
        } catch (error) {
            console.error('Failed to save subject', error);
            alert('Gagal menyimpan mata pelajaran');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus mata pelajaran ini?')) return;
        try {
            await subjectService.delete(id);
            fetchData();
        } catch (error) {
            console.error('Failed to delete subject', error);
            alert('Gagal menghapus mata pelajaran');
        }
    };

    const openModal = (subject?: Subject) => {
        if (subject) {
            setEditingSubject(subject);
            setName(subject.name);
            setCategoryId(subject.category_id ?? '');
            setSortOrder(subject.sort_order);
        } else {
            setEditingSubject(null);
            setName('');
            setCategoryId('');
            setSortOrder(0);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingSubject(null);
        setName('');
        setCategoryId('');
        setSortOrder(0);
    };

    // Helper to group subjects by category
    const getSubjectsByCategory = (catId: number | null) => {
        return subjects.filter(s => s.category_id === catId);
    };

    if (isLoading) return <div className="p-4">Loading...</div>;

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Mata Pelajaran</h1>
                <button
                    onClick={() => openModal()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                    + Tambah Mapel
                </button>
            </div>

            <div className="space-y-8">
                {categories.map((cat) => {
                    const catSubjects = getSubjectsByCategory(cat.id);
                    if (catSubjects.length === 0) return null;

                    return (
                        <div key={cat.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                            <div className="bg-gray-100 px-6 py-3 border-b">
                                <h2 className="text-lg font-semibold text-gray-700">
                                    {cat.sort_order}. {cat.name}
                                </h2>
                            </div>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Urutan</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mata Pelajaran</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {catSubjects.map((subject) => (
                                        <tr key={subject.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subject.sort_order}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{subject.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => openModal(subject)}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(subject.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    );
                })}

                {/* Uncategorized Group */}
                {getSubjectsByCategory(null).length > 0 && (
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="bg-gray-100 px-6 py-3 border-b">
                            <h2 className="text-lg font-semibold text-gray-700">Tanpa Kategori</h2>
                        </div>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Urutan</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mata Pelajaran</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {getSubjectsByCategory(null).map((subject) => (
                                    <tr key={subject.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subject.sort_order}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{subject.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => openModal(subject)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(subject.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">
                            {editingSubject ? 'Edit Mapel' : 'Tambah Mapel'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Mata Pelajaran</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value === '' ? '' : Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">-- Pilih Kategori --</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Urutan Cetak (Sort Order)</label>
                                <input
                                    type="number"
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">Urutan mapel di dalam kategori saat cetak rapor.</p>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Subjects;
