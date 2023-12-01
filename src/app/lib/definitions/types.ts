import React, { MouseEvent } from "react";

export type Task = {
    id: string,
    name: string,
    description: string,
    owner: User,
    size: number,
    index: number,
}
export type ProgBarTask = {
    id: string, 
    name: string, 
    description: string,
    owner: User,
    size: number,
    pos: {xPos: number, yPos: number },
    positionMap: Map<number, [number, number]>
    index: number,
}
export type TaskMap = {
    task: Task,
    index: number,
    yPos: number,
}
export type User = {
    username: string,
    role: Role
}

export enum Role {
    developer, 
    manager,
    team_member, 
    other,
}
