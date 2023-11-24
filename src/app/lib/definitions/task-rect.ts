export interface iDraggable {
    move(divId: HTMLDivElement, xPos: number, yPos: number): void;
    startMoving(divId: HTMLDivElement, container: HTMLDivElement, evt: React.MouseEvent, originalPos: {x: number, y: number}): void;
    stopMoving(container: HTMLDivElement, divId: HTMLDivElement): {newX: number, newY: number} | null;
}

export class Draggable implements iDraggable {
    public finalPosition: number = -1;
    public originalPosition: {x: number, y:number} = {x: 0, y: 0};
    move(divId: HTMLDivElement, xPos: number, yPos: number): void {
        divId.style.left = xPos + 'px';
        divId.style.top = yPos + 'px';
    }
    startMoving(divId: HTMLDivElement, container: HTMLDivElement, evt: React.MouseEvent, originalPos: {x: number, y: number}): void{
        this.originalPosition = originalPos;
        const containerBounds = container.getBoundingClientRect();
        let divWidth: number = divId.clientWidth; //width of draggable div
        let divHeight: number = divId.clientHeight; // height of draggable div
        let containerWidth: number = container.clientWidth; // width of containing box
        let containerHeight: number = container.clientHeight; // height of containing box

        const leaveHandler = () => {
            container.removeEventListener("mousemove", moveHandler as () => void);
            const newPosition = this.stopMoving(container, divId);
            if (newPosition) {
                this.move(divId, containerWidth/2 - divWidth/2, this.originalPosition.y)
            }
        };

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
            // if the mouse leaves the container
            if (
                e.clientX < containerBounds.left ||
                e.clientX > containerBounds.right ||
                e.clientY < containerBounds.top ||
                e.clientY > containerBounds.bottom
            ) {
                leaveHandler();
            } else {
                this.move(divId, posX, posY);
            }
        }

        const stopMovingHandler: EventListener = () => {
            container.removeEventListener("mousemove", moveHandler as () => void);
            container.removeEventListener("mouseup", stopMovingHandler);
            container.removeEventListener("mouseleave", leaveHandler);
        }
  
        container.addEventListener("mousemove",moveHandler as () => void);
        container.addEventListener("mouseup", stopMovingHandler) 
        container.addEventListener("mouseleave", leaveHandler);
        
        
    }
    stopMoving(container: HTMLDivElement, divId: HTMLDivElement): { newX: number; newY: number } | null {
        const containerWidth= container.clientWidth
        const divWidth= divId.clientWidth
        const containerBounds = container.getBoundingClientRect();
        const divBounds = divId.getBoundingClientRect();

        const newX = divBounds.left - containerBounds.left;
        const newY = divBounds.top - containerBounds.top;
        this.move(divId, containerWidth/2 - divWidth/2, this.originalPosition.y)
        return { newX, newY };
    }
   
}