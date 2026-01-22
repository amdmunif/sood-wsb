import React, { useEffect, useState } from 'react';
import { studentService } from '../../services/studentService';
import type { Student } from '../../services/studentService';
import { subjectService } from '../../services/subjectService';
import type { Subject } from '../../services/subjectService';
import { gradeService } from '../../services/gradeService';
import type { GradeMap } from '../../services/gradeService';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';

const GradeInput: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState<number | ''>('');
    const [grades, setGrades] = useState<GradeMap>({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadInitialData = async () => {
            const [studentData, subjectData] = await Promise.all([
                studentService.getAll(),
                subjectService.getAll()
            ]);
            setStudents(studentData);
            setSubjects(subjectData);
        };
        loadInitialData();
    }, []);

    const handleStudentChange = async (studentId: number) => {
        setSelectedStudentId(studentId);
        if (!studentId) {
            setGrades({});
            return;
        }
        setLoading(true);
        try {
            const gradeData = await gradeService.getByStudent(studentId);
            setGrades(gradeData);
        } catch (error) {
            console.error('Failed to load grades', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGradeChange = (moduleId: number, value: string) => {
        // Allow empty string or numbers 0-100
        if (value === '' || (Number(value) >= 0 && Number(value) <= 100)) {
            setGrades(prev => ({ ...prev, [moduleId]: value === '' ? 0 : Number(value) }));
        }
    };

    const handleSave = async () => {
        if (!selectedStudentId) return;
        setSaving(true);
        try {
            // Filter out 0/empty if needed, or send as is
            await gradeService.saveGrades(Number(selectedStudentId), grades);
            alert('Nilai berhasil disimpan');
        } catch (error) {
            alert('Gagal menyimpan nilai');
        } finally {
            setSaving(false);
        }
    };

    // Group subjects by Category
    const groupedSubjects = subjects.reduce((acc, subject) => {
        const catName = subject.category_name || 'Uncategorized';
        if (!acc[catName]) acc[catName] = [];
        acc[catName].push(subject);
        return acc;
    }, {} as Record<string, Subject[]>);

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Input Nilai</h1>

            <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Peserta Didik</label>
                <select
                    className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
                    value={selectedStudentId}
                    onChange={(e) => handleStudentChange(Number(e.target.value))}
                >
                    <option value="">-- Pilih Siswa --</option>
                    {students.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                    ))}
                </select>
            </div>

            {selectedStudentId && (
                <div className="space-y-4">
                    {loading ? (
                        <p>Loading grades...</p>
                    ) : (
                        Object.entries(groupedSubjects).map(([category, categorySubjects]) => (
                            <div key={category} className="border rounded-lg bg-white overflow-hidden shadow-sm">
                                <Disclosure>
                                    {({ open }) => (
                                        <>
                                            <Disclosure.Button className="flex justify-between w-full px-4 py-3 text-sm font-medium text-left text-blue-900 bg-blue-100 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
                                                <span>{category}</span>
                                                <ChevronUpIcon
                                                    className={`${open ? 'transform rotate-180' : ''} w-5 h-5 text-blue-500`}
                                                />
                                            </Disclosure.Button>
                                            <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                                                {categorySubjects.map(sub => (
                                                    <div key={sub.id} className="mb-6">
                                                        <h4 className="font-semibold text-gray-800 mb-2 border-b pb-1">{sub.name}</h4>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                                            {sub.modules.map(mod => (
                                                                <div key={mod.id}>
                                                                    <label className="block text-xs font-medium text-gray-600 mb-1">{mod.name}</label>
                                                                    <input
                                                                        type="number"
                                                                        className="w-full border-gray-300 rounded-md shadow-sm p-2 text-sm border focus:ring-blue-500 focus:border-blue-500"
                                                                        placeholder="0-100"
                                                                        min="0" max="100"
                                                                        value={grades[mod.id] ?? ''}
                                                                        onChange={(e) => handleGradeChange(mod.id, e.target.value)}
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </Disclosure.Panel>
                                        </>
                                    )}
                                </Disclosure>
                            </div>
                        ))
                    )}

                    <div className="flex justify-end pt-4 pb-12">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className={`px-8 py-3 rounded-md text-white font-medium ${saving ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} transition shadow-lg`}
                        >
                            {saving ? 'Menyimpan...' : 'Simpan Semua Nilai'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GradeInput;
