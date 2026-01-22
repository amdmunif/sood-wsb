import React, { useEffect, useState, useRef } from 'react';
import { reportService } from '../../services/reportService';
import type { MatrixData } from '../../services/reportService';
import { useReactToPrint } from 'react-to-print';
import { studentService } from '../../services/studentService';
import type { Student } from '../../services/studentService';
import { gradeService } from '../../services/gradeService';

// Komponen Rapor yang akan dicetak
class ReportPrintComponent extends React.Component<{ student: Student, grades: any, subjects: any[] }> {
    render() {
        const { student, grades, subjects } = this.props;
        return (
            <div className="p-8 print-content font-serif">
                <div className="text-center border-b-2 border-black pb-4 mb-6">
                    <h1 className="text-2xl font-bold">LAPORAN HASIL BELAJAR</h1>
                    <h2 className="text-xl">PKBM {(student as any).pkbm_name || '...'}</h2>
                </div>

                <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p>Nama Peserta Didik: <strong>{student.name}</strong></p>
                        <p>Nomor Induk: <strong>{student.id.toString().padStart(6, '0')}</strong></p>
                    </div>
                    <div className="text-right">
                        <p>Tahun Pelajaran: 2024/2025</p>
                    </div>
                </div>

                <table className="w-full border-collapse border border-black text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-black p-2 text-center w-10">No</th>
                            <th className="border border-black p-2 text-left">Mata Pelajaran</th>
                            <th className="border border-black p-2 text-center w-20">Nilai Akhir</th>
                            <th className="border border-black p-2 text-center w-24">Predikat</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjects.map((sub, idx) => {
                            // Calculate average of modules for this subject
                            const subGrades = sub.modules.map((m: any) => grades[m.id] || 0);
                            const avg = subGrades.length ? subGrades.reduce((a: number, b: number) => a + b, 0) / subGrades.length : 0;
                            const predikat = avg >= 90 ? 'A' : avg >= 80 ? 'B' : avg >= 70 ? 'C' : 'D';

                            return (
                                <tr key={sub.id}>
                                    <td className="border border-black p-2 text-center">{idx + 1}</td>
                                    <td className="border border-black p-2">{sub.name}</td>
                                    <td className="border border-black p-2 text-center">{Math.round(avg)}</td>
                                    <td className="border border-black p-2 text-center">{predikat}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <div className="mt-16 flex justify-between text-center">
                    <div>
                        <p>Mengetahui,</p>
                        <p>Orang Tua/Wali</p>
                        <br /><br /><br />
                        <p>(.........................)</p>
                    </div>
                    <div>
                        <p>Wonosobo, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        <p>Kepala Sekolah</p>
                        <br /><br /><br />
                        <p><strong>{(student as any).headmaster_name || '.........................'}</strong></p>
                    </div>
                </div>
            </div>
        );
    }
}

const Reports: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'matrix' | 'print'>('matrix');
    const [matrixData, setMatrixData] = useState<MatrixData | null>(null);

    // Print State
    const [students, setStudents] = useState<Student[]>([]); // Initialize as empty array
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [studentGrades, setStudentGrades] = useState<any>({});

    const componentRef = useRef<ReportPrintComponent>(null);
    const handlePrint = useReactToPrint({
        contentRef: componentRef, // Fix: Use correct prop name for newer versions or standard ref
    } as any); // Type cast due to potential version mismatch in types

    useEffect(() => {
        const loadRequests = async () => {
            if (activeTab === 'matrix') {
                const data = await reportService.getMatrix();
                setMatrixData(data);
            } else {
                const sData = await studentService.getAll();
                setStudents(sData);
                // Load basic matrix structure to get subjects for printing even if in print tab
                const mData = await reportService.getMatrix(); // reusing this to get subjects structure
                setMatrixData(mData);
            }
        };
        loadRequests();
    }, [activeTab]);

    const handleStudentSelect = async (studentId: string) => {
        if (!studentId) {
            setSelectedStudent(null);
            return;
        }
        const student = students.find(s => s.id === Number(studentId)) || null;
        setSelectedStudent(student);
        if (student) {
            const g = await gradeService.getByStudent(student.id);
            setStudentGrades(g);
        }
    };

    const downloadCSV = () => {
        if (!matrixData) return;

        let csv = 'Nama Siswa,PKBM,';
        const modules: any[] = [];
        matrixData.subjects.forEach(sub => {
            sub.modules.forEach(mod => {
                csv += `${sub.name} - ${mod.name},`;
                modules.push(mod.id);
            });
        });
        csv += '\n';

        matrixData.matrix.forEach(row => {
            csv += `"${row.name}","${row.pkbm}",`;
            modules.forEach(mid => {
                csv += `${row.grades[mid] || 0},`;
            });
            csv += '\n';
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'matriks_nilai_sood.csv';
        a.click();
    };

    return (
        <div>
            <div className="flex space-x-4 border-b mb-6">
                <button
                    className={`py-2 px-4 font-medium ${activeTab === 'matrix' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('matrix')}
                >
                    Matriks Nilai
                </button>
                <button
                    className={`py-2 px-4 font-medium ${activeTab === 'print' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('print')}
                >
                    Cetak Rapor
                </button>
            </div>

            {activeTab === 'matrix' && matrixData && (
                <div className="bg-white p-4 shadow rounded-lg overflow-x-auto">
                    <div className="flex justify-end mb-4">
                        <button onClick={downloadCSV} className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">
                            Export Excel (CSV)
                        </button>
                    </div>
                    <table className="min-w-full divide-y divide-gray-200 border text-xs">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 border sticky left-0 bg-gray-50">Nama</th>
                                {matrixData.subjects.map(sub => (
                                    <th key={sub.id} colSpan={sub.modules.length} className="px-4 py-2 border text-center font-bold">
                                        {sub.name}
                                    </th>
                                ))}
                            </tr>
                            <tr>
                                <th className="px-4 py-2 border sticky left-0 bg-gray-50"></th>
                                {matrixData.subjects.map(sub => (
                                    sub.modules.map(mod => (
                                        <th key={mod.id} className="px-2 py-1 border text-gray-500 font-normal truncate w-20" title={mod.name}>
                                            {mod.name.substring(0, 10)}...
                                        </th>
                                    ))
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {matrixData.matrix.map(row => (
                                <tr key={row.id}>
                                    <td className="px-4 py-2 border sticky left-0 bg-white font-medium">{row.name}</td>
                                    {matrixData.subjects.map(sub => (
                                        sub.modules.map(mod => (
                                            <td key={mod.id} className="px-2 py-1 border text-center">
                                                {row.grades[mod.id] || '-'}
                                            </td>
                                        ))
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'print' && (
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white p-6 shadow rounded-lg mb-6 ignore-print">
                        <label className="block text-sm font-medium mb-2">Pilih Siswa untuk Dicetak</label>
                        <div className="flex space-x-4">
                            <select
                                className="flex-1 border p-2 rounded"
                                onChange={(e) => handleStudentSelect(e.target.value)}
                            >
                                <option value="">-- Pilih Siswa --</option>
                                {students.map(s => (
                                    <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                                ))}
                            </select>
                            <button
                                onClick={handlePrint}
                                disabled={!selectedStudent}
                                className="bg-blue-600 text-white px-6 py-2 rounded disabled:bg-gray-400"
                            >
                                Cetak PDF
                            </button>
                        </div>
                    </div>

                    {selectedStudent && matrixData && (
                        <div className="bg-white p-8 shadow-lg border">
                            <ReportPrintComponent
                                ref={componentRef}
                                student={selectedStudent}
                                grades={studentGrades}
                                subjects={matrixData.subjects}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Reports;
