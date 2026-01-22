import api from './api';

export interface MatrixData {
    subjects: {
        id: number;
        name: string;
        category_name: string;
        modules: { id: number; name: string }[];
    }[];
    matrix: {
        id: number;
        name: string;
        pkbm: string;
        grades: { [moduleId: number]: number };
    }[];
}

export const reportService = {
    getMatrix: async (pkbmId?: number) => {
        const url = pkbmId
            ? `/reports.php?type=matrix&pkbm_id=${pkbmId}`
            : '/reports.php?type=matrix';
        const response = await api.get<MatrixData>(url);
        return response.data;
    }
};
