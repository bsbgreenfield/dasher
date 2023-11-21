import React, { MouseEvent } from "react";

export type Task = {
    id: string,
    name: string,
    description: string,
    owner: User
    height: number
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


export interface iDraggable {
    move(divId: HTMLDivElement, xPos: number, yPos: number): void;
    startMoving(divId: HTMLDivElement, container: HTMLDivElement, evt: React.MouseEvent, originalPos: {x: number, y: number}): void;
    stopMoving(container: HTMLDivElement, divId: HTMLDivElement): {newX: number, newY: number} | null;
}

export class Draggable implements iDraggable {
    move(divId: HTMLDivElement, xPos: number, yPos: number): void {
        divId.style.left = xPos + 'px';
        divId.style.top = yPos + 'px';
    }
    startMoving(divId: HTMLDivElement, container: HTMLDivElement, evt: React.MouseEvent, originalPos: {x: number, y: number}): void{
        const containerBounds = container.getBoundingClientRect();
        let divWidth: number = divId.clientWidth; //width of draggable div
        let divHeight: number = divId.clientHeight; // height of draggable div
        let containerWidth: number = container.clientWidth; // width of containing box
        let containerHeight: number = container.clientHeight; // height of containing box

        const moveHandler   = (e:MouseEvent) => {
            let posX: number = e.clientX - containerBounds.left - divWidth/2; // mouse x position
            let posY: number = e.clientY - containerBounds.top - divHeight/2; // mouse y position
            if (posX + divWidth -5 > containerWidth) {
                posX = containerWidth - divWidth -5;
            }
            if(posX < 5){
                posX = 5;
            }
            if (posY + divHeight > containerHeight) {
                posY = containerHeight - divHeight;
            }
            if (posY < 0){
                posY = 0;
            }
            
            this.move(divId, posX, posY)
        }
        const stopMovingHandler: EventListener = () => {
            container.removeEventListener("mousemove", moveHandler as () => void);
            container.removeEventListener("mouseup", stopMovingHandler);
            const newPos = this.stopMoving(container, divId);
            if (newPos) {
                this.move(divId, containerWidth/2 - divWidth/2, originalPos.y);
            }
        }

        container.addEventListener("mousemove",moveHandler as () => void);
        container.addEventListener("mouseup", stopMovingHandler)      
        
    }
    stopMoving(container: HTMLDivElement, divId: HTMLDivElement): { newX: number; newY: number } | null {
        console.log("stop");
        const containerBounds = container.getBoundingClientRect();
        const divBounds = divId.getBoundingClientRect();

        const newX = divBounds.left - containerBounds.left;
        const newY = divBounds.top - containerBounds.top;

        return { newX, newY };
    }
    
}

