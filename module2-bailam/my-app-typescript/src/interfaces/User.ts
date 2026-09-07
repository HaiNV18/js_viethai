type ID = number | string;
type Status = "active" | "inactive" | "pending";
type Role = 'ADMIN' | 'VIEWER' | 'EDITOR';

export interface User {
    readonly id: ID;
    username: string;
    email: string;
    age: any;
    avatar?: string;
    status: Status;
    role: Role;
}
