import React, { useEffect, useState } from 'react';
import { announcementService } from '../services/announcementService';
import type { Announcement } from '../services/announcementService';
import api from '../services/api';

const AnnouncementManagement: React.FC = () => {
    const [list, setList] = useState<Announcement[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ id: 0, title: '', content: '' });

    const fetchList = async () => {
        const data = await announcementService.getAll();
        setList(data);
    };

    useEffect(() => { fetchList(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (formData.id) {
                await api.put('/announcements.php', formData);
            } else {
                await api.post('/announcements.php', formData);
            }
            setIsModalOpen(false);
            fetchList();
        } catch (error) {
            alert('Gagal menyimpan pengumuman');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Hapus pengumuman ini?')) return;
        try {
            await api.delete(`/announcements.php?id=${id}`);
            fetchList();
        } catch (error) {
            alert('Gagal menghapus');
        }
    };

    const openModal = (item?: Announcement) => {
        setFormData(item ? { ...item } : { id: 0, title: '', content: '' });
        setIsModalOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manajemen Pengumuman</h1>
                <button onClick={() => openModal()} className="bg-blue-600 text-white px-4 py-2 rounded">
                    + Tambah Pengumuman
                </button>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                            <th className="px-6 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {list.map((item) => (
                            <tr key={item.id}>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{item.title}</div>
                                    <div className="text-sm text-gray-500 truncate max-w-xs">{item.content}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{new Date(item.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                                    <button onClick={() => openModal(item)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-lg">
                        <h2 className="text-xl font-bold mb-4">{formData.id ? 'Edit' : 'Tambah'} Pengumuman</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Judul</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Isi</label>
                                <textarea
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    rows={4}
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded">Batal</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnnouncementManagement;
