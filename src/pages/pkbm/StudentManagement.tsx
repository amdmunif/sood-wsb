import React, { useEffect, useState } from 'react';
import { studentService } from '../../services/studentService';
import type { Student } from '../../services/studentService';

const StudentManagement: React.FC = () => {
    const [list, setList] = useState<Student[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<{ id?: number, name: string, email: string, nik: string }>({ name: '', email: '', nik: '' });

    const fetchList = async () => {
        try {
            const data = await studentService.getAll();
            setList(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => { fetchList(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate NIK
        if (formData.nik && (formData.nik.length !== 16 || !/^\d+$/.test(formData.nik))) {
            alert('NIK harus terdiri dari 16 digit angka.');
            return;
        }

        try {
            if (formData.id) {
                await studentService.update(formData.id, formData);
            } else {
                await studentService.create(formData);
            }
            setIsModalOpen(false);
            fetchList();
        } catch (error) {
            alert('Gagal menyimpan peserta didik');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Hapus peserta didik ini? Data nilai juga akan terhapus.')) return;
        try {
            await studentService.delete(id);
            fetchList();
        } catch (error) {
            alert('Gagal menghapus');
        }
    };

    const openModal = (item?: Student) => {
        setFormData(item ? { id: item.id, name: item.name, email: item.email, nik: item.nik || '' } : { name: '', email: '', nik: '' });
        setIsModalOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manajemen Peserta Didik</h1>
                <button onClick={() => openModal()} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition">
                    + Tambah Siswa
                </button>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profile</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIS / NIK</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit PKBM</th>
                            <th className="px-6 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {list.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">Belum ada data siswa.</td>
                            </tr>
                        ) : list.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                    <div className="text-xs text-gray-500">{item.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900">NIS: {item.nis || '-'}</div>
                                    <div className="text-xs text-gray-500">NIK: {item.nik || '-'}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{item.pkbm_name}</td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button onClick={() => openModal(item)} className="text-indigo-600 hover:text-indigo-900 font-medium">Edit</button>
                                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900 font-medium">Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
                        <h2 className="text-xl font-bold mb-4">{formData.id ? 'Edit' : 'Tambah'} Siswa</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                                <input
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">NIK (Nomor Induk Kependudukan)</label>
                                <input
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.nik}
                                    onChange={e => setFormData({ ...formData, nik: e.target.value })}
                                    placeholder="16 digit NIK"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email (Username Login)</label>
                                <input
                                    type="email"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    required={!formData.id}
                                />
                                {!formData.id && <p className="text-xs text-gray-500 mt-1">Password default akan sama dengan Email.</p>}
                            </div>

                            <div className="flex justify-end space-x-2 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Batal</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentManagement;
