import React, { useEffect, useState } from 'react';
import { pkbmService } from '../services/pkbmService';
import type { PKBM } from '../services/pkbmService';

const PKBMManagement: React.FC = () => {
    const [list, setList] = useState<PKBM[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<PKBM>>({ name: '', npsn: '', address: '', headmaster_name: '' });

    const fetchList = async () => {
        const data = await pkbmService.getAll();
        setList(data);
    };

    useEffect(() => { fetchList(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (formData.id) {
                await pkbmService.update(formData.id, formData);
            } else {
                await pkbmService.create(formData);
            }
            setIsModalOpen(false);
            fetchList();
        } catch (error) {
            alert('Gagal menyimpan PKBM');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Hapus PKBM ini?')) return;
        try {
            await pkbmService.delete(id);
            fetchList();
        } catch (error) {
            alert('Gagal menghapus');
        }
    };

    const openModal = (item?: PKBM) => {
        setFormData(item ? { ...item } : { name: '', npsn: '', address: '', headmaster_name: '' });
        setIsModalOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manajemen PKBM</h1>
                <button onClick={() => openModal()} className="bg-blue-600 text-white px-4 py-2 rounded">
                    + Tambah PKBM
                </button>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NPSN</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kepala Sekolah</th>
                            <th className="px-6 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {list.map((item) => (
                            <tr key={item.id}>
                                <td className="px-6 py-4">{item.name}</td>
                                <td className="px-6 py-4">{item.npsn}</td>
                                <td className="px-6 py-4">{item.headmaster_name}</td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button onClick={() => openModal(item)} className="text-indigo-600">Edit</button>
                                    <button onClick={() => handleDelete(item.id)} className="text-red-600">Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-lg">
                        <h2 className="text-xl font-bold mb-4">{formData.id ? 'Edit' : 'Tambah'} PKBM</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Nama PKBM</label>
                                <input className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">NPSN</label>
                                <input className="w-full border p-2 rounded" value={formData.npsn} onChange={e => setFormData({ ...formData, npsn: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Kepala Sekolah</label>
                                <input className="w-full border p-2 rounded" value={formData.headmaster_name} onChange={e => setFormData({ ...formData, headmaster_name: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Alamat</label>
                                <textarea className="w-full border p-2 rounded" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
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

export default PKBMManagement;
