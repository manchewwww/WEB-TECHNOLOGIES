export interface IUserOption {
    value: string;
    label: string;
}

export interface IUser {
    id: string;
    username: string;
}

export interface IProject {
    _id: string;
    name: string;
    description?: string;
    createdBy: string;
    members: string[];
  }