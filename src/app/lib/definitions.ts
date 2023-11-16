export type Task = {
    id: String,
    name: String,
    description: String,
    owner: User
}

export type User = {
    username: String,
    role: Role
}

export enum Role {
    developer, 
    manager,
    team_member, 
    other,
}