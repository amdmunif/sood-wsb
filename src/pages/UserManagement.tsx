import React, { useEffect, useState } from 'react';
import { userService } from '../services/userService';
import type { UserData as User } from '../services/userService';
import { pkbmService } from '../services/pkbmService';
import type { PKBM } from '../services/pkbmService';

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [pkbms, setPkbms] = useState<PKBM[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<User>>({ name: '', email: '', role: 'Admin PKBM', pkbm_id: undefined });
    const [password, setPassword] = useState('');

    const fetchData = async () => {
        const [userData, pkbmData] = await Promise.all([userService.getAll(), pkbmService.getAll()]);
        setUsers(userData);
        setPkbms(pkbmData);
    };

    useEffect(() => { fetchData(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const dataToSubmit = { ...formData, password: password || undefined };
            if (formData.id) {
                await userService.update(formData.id, dataToSubmit);
            } else {
                await userService.create(dataToSubmit);
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            alert('Gagal menyimpan user');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Hapus user ini?')) return;
        try {
            await userService.delete(id);
            fetchData();
        } catch (error) {
            alert('Gagal menghapus');
        }
    };

    const openModal = (user?: User) => {
        setFormData(user ? { ...user } : { name: '', email: '', role: 'Admin PKBM', pkbm_id: undefined });
        setPassword('');
        setIsModalOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manajemen Pengguna</h1>
                <button onClick={() => openModal()} className="bg-blue-600 text-white px-4 py-2 rounded">
                    + Tambah User
                </button>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PKBM</th>
                            <th className="px-6 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                    <div className="text-sm text-gray-500">{user.email}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{user.role}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {pkbms.find(p => p.id === user.pkbm_id)?.name || '-'}
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button onClick={() => openModal(user)} className="text-indigo-600">Edit</button>
                                    <button onClick={() => handleDelete(user.id)} className="text-red-600">Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-lg">
                        <h2 className="text-xl font-bold mb-4">{formData.id ? 'Edit' : 'Tambah'} User</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Nama Lengkap</label>
                                <input className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Email</label>
                                <input type="email" className="w-full border p-2 rounded" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Password {formData.id && '(Isi hanya jika ingin mengubah)'}</label>
                                <input type="password" className="w-full border p-2 rounded" value={password} onChange={e => setPassword(e.target.value)} required={!formData.id} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Role</label>
                                <select className="w-full border p-2 rounded" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value as any })}>
                                    <option value="Admin PKBM">Admin PKBM</option>
                                    <option value="Super Admin">Super Admin</option>
                                    <option value="Student">Siswa</option>
                                </select>
                            </div>
                            {formData.role === 'Admin PKBM' && (
                                <div>
                                    <label className="block text-sm font-medium">Assign ke PKBM</label>
                                    <select
                                        className="w-full border p-2 rounded"
                                        value={formData.pkbm_id || ''}
                                        onChange={e => setFormData({ ...formData, pkbm_id: Number(e.target.value) })}
                                        required
                                    >
                                        <option value="">Pilih PKBM...</option>
                                        {pkbms.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
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

export default UserManagement;
