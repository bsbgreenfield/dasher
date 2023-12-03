export interface iDraggable {
    move(divId: HTMLDivElement, xPos: number, yPos: number): void;
    startMoving(divId: HTMLDivElement, container: HTMLDivElement, originalPosition: { xPos: number, yPos: number}): void;
    stopMoving(container: HTMLDivElement, divId: HTMLDivElement): {newX: number, newY: number} | null;
}

export class Draggable implements iDraggable {
    public currentPosition = {xPos: 0, yPos: 0};
    move(divId: HTMLDivElement, xPos: number, yPos: number): void {
        
        divId.style.left = xPos + 'px';
        divId.style.top = yPos + 'px';
    }
         startMoving(divId: HTMLDivElement, container: HTMLDivElement, originalPosition:{ xPos: number, yPos: number}): void{

        const containerBounds = container.getBoundingClientRect();
        this.currentPosition = originalPosition;
        
        let divWidth: number = divId.clientWidth; //width of draggable div
        let divHeight: number = divId.clientHeight; // height of draggable div
        let containerWidth: number = container.clientWidth; // width of containing box
        let containerHeight: number = container.clientHeight; // height of containing box

 /*        const leaveHandler = () => {
            container.removeEventListener("mousemove", moveHandler as () => void);
            const newPosition = this.stopMoving(container, divId);
            if (newPosition) {
                console.log("moving back to", this.currentPosition.yPos)
                this.move(divId, containerWidth/2 - divWidth/2, this.currentPosition.yPos)

            }
            container.removeEventListener("mouseleave", leaveHandler);
        }; */

        const moveHandler   = (e:MouseEvent) => {
            let posX: number =e.clientX - containerBounds.left - divWidth/2; // mouse x position
            let posY: number = e.clientY - containerBounds.top - divHeight/2; // mouse y position
            if (posX + divWidth > containerWidth) {
                posX = containerWidth - divWidth ;
            }
            if(posX < 0){
                posX = 0;
            }
            if (posY + divHeight > containerHeight) {
                posY = containerHeight - divHeight;
            }
            if (posY < 0){
                posY = 0;
            }
            this.move(divId, posX, posY);
        }

        const stopMovingHandler: EventListener = () => {
            container.removeEventListener("mousemove", moveHandler as () => void);
            container.removeEventListener("mouseup", stopMovingHandler);
        }
  
        container.addEventListener("mousemove",moveHandler as () => void);
        container.addEventListener("mouseup", stopMovingHandler) 
        
        
    }
    stopMoving(container: HTMLDivElement, divId: HTMLDivElement): { newX: number; newY: number } | null {
        const containerBounds = container.getBoundingClientRect();
        const divBounds = divId.getBoundingClientRect();

        const newX =  divBounds.left - containerBounds.left ;
        const newY = divBounds.top - containerBounds.top;
        return { newX, newY };
    }
   
}