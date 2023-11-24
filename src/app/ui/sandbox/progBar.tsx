import { useState } from "react"

export default function ProgBar({taskElementArray} : {taskElementArray: React.JSX.Element[]}){


    return (
        <div className="sandbox-body">
        <div className="sandbox-body-content">
          <div className="prog-bar">
            {taskElementArray}
          </div>
        </div>
      </div>
    )
}