export type IUserTableRow = {
    id: number;
    name: string;
    email: string;
    image?: string;
    role: string;
    status: "active" | "inactive";
    lastLogin: string;
};
