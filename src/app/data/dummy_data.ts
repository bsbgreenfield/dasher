import { Role, Task, User } from "../lib/definitions/types";

const user1: User = {
    role: Role.developer,
    username: "benji",
  };
  const colorArray: string[] = ["red", "blue", "yellow"];
  const dummyTasks : Task[]  = [
    {
        id: "0",
        name: "first",
        description: "This is a test description",
        owner: user1,
        height: 50, index: 0
      },
      {
        id: "1",
        name: "second",
        description: "This is a another test description",
        owner: user1,
        height: 100, index: 1
      },
      {
        id: "2",
        name: "third",
        description: "This is a third test description!!",
        owner: user1,
        height: 200, index: 2
      }
  ]

  export {colorArray, dummyTasks, user1}
  