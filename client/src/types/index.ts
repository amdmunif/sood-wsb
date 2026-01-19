export interface SubjectCategory {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface Subject {
    id: number;
    name: string;
    category_id: number | null;
    category?: SubjectCategory;
}

export interface Student {
    id: number;
    nik: string | null;
    name: string;
    email: string;
    pkbm_id: number;
}
