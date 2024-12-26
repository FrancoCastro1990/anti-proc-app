type Card = {
    id: number;
    title: string;
    section: string;
    position: number;
    createdAt: Date;
    updatedAt: Date;
};

type Section = {
    id: number;
    title: string;
    color?: string;
};