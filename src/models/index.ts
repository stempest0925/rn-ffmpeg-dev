import { types } from "mobx-state-tree";
import uuid from "uuid";

import { Assets } from "./assets";
import Cut from "./cut";

const Task = types.model({
  id: types.string,
  cutQueue: types.array(Cut),
});

const VideoStore = types
  .model({
    tasks: types.array(Task),
    assets: types.array(Assets),
  })
  .actions(self => ({
    createTask: () => {
      self.tasks.push({ id: uuid.v1(), cutQueue: [] });
    },
    deleteTask: (id: string) => {
      const index = self.tasks.findIndex(item => item.id === id);
      self.tasks.splice(index, 1);
    },
  }));

const videoStore = VideoStore.create();

export default videoStore;
