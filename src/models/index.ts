import { types } from "mobx-state-tree";

import { Assets } from "./assets";
// import { Progress } from "./progress";
import Cut from "./cut";

const Task = types.model({
  id: types.string,
  cutQueue: types.array(Cut),
});

const VideoStore = types.model({
  tasks: types.array(Task),
  assets: types.array(Assets),
  // progress: Progress,
});

const videoStore = VideoStore.create();

export default videoStore;
