import api from './api';

export interface GradeMap {
    [moduleId: number]: number;
}

export const gradeService = {
    getByStudent: async (studentId: number) => {
        const response = await api.get<GradeMap>(`/grades.php?student_id=${studentId}`);
        return response.data;
    },

    saveGrades: async (studentId: number, grades: GradeMap) => {
        const response = await api.post('/grades.php', {
            student_id: studentId,
            grades: grades
        });
        return response.data;
    }
};
