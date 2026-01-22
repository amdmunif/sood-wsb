import { useEffect, useState } from 'react';
import { subjectCategoryService } from '../services/categoryService';
import type { SubjectCategory } from '../services/categoryService';

const SubjectCategories: React.FC = () => {
    const [categories, setCategories] = useState<SubjectCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<SubjectCategory | null>(null);

    // Form state
    const [name, setName] = useState('');
    const [sortOrder, setSortOrder] = useState(0);

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            const data = await subjectCategoryService.getAll();
            setCategories(data);
        } catch (error) {
            console.error('Failed to fetch categories', error);
            alert('Gagal mengambil data kategori');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await subjectCategoryService.update(editingCategory.id, { name, sort_order: sortOrder });
            } else {
                await subjectCategoryService.create({ name, sort_order: sortOrder });
            }
            closeModal();
            fetchCategories();
        } catch (error) {
            console.error('Failed to save category', error);
            alert('Gagal menyimpan kategori');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus kategori ini?')) return;
        try {
            await subjectCategoryService.delete(id);
            fetchCategories();
        } catch (error) {
            console.error('Failed to delete category', error);
            alert('Gagal menghapus kategori');
        }
    };

    const openModal = (category?: SubjectCategory) => {
        if (category) {
            setEditingCategory(category);
            setName(category.name);
            setSortOrder(category.sort_order);
        } else {
            setEditingCategory(null);
            setName('');
            setSortOrder(categories.length + 1); // Auto increment implementation hint
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
        setName('');
        setSortOrder(0);
    };

    if (isLoading) return <div className="p-4">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Kategori Mata Pelajaran</h1>
                <button
                    onClick={() => openModal()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                    + Tambah Kategori
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urutan</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Kategori</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {categories.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">Belum ada kategori</td>
                            </tr>
                        ) : (
                            categories.map((cat) => (
                                <tr key={cat.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cat.sort_order}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cat.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => openModal(cat)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cat.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">
                            {editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Urutan (Sort Order)</label>
                                <input
                                    type="number"
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">Angka lebih kecil akan muncul di atas saat cetak rapor.</p>
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

export default SubjectCategories;
