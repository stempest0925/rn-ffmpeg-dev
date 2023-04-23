import { destroy, types, flow } from "mobx-state-tree";
import uuid from "uuid";
import md5 from "md5";

import { Assets } from "./assets";
import Cut from "./cut";

import fileSystem from "../helpers/fileSystem";
import { autorun } from "mobx";

const Task = types.model({
  id: types.string,
  cutQueue: types.array(Cut),
});

const VideoStore = types
  .model({
    tasks: types.array(Task),
    assets: types.array(Assets),
  })
  .views(self => ({
    getAssets(uid: string, isName: boolean = false) {
      uid = isName ? md5(uid) : uid;
      return self.assets.find(item => item.id === uid);
    },
  }))
  .actions(self => ({
    createTask() {
      self.tasks.push({ id: uuid.v1(), cutQueue: [] });
    },
    removeTask(id: string) {
      const index = self.tasks.findIndex(item => item.id === id);
      self.tasks.splice(index, 1);
    },
    addAssets: flow(function* (name: string) {
      const assetsId = md5(name);
      const assetsIndex = self.assets.findIndex(item => item.id === assetsId);
      if (assetsIndex === -1) {
        yield fileSystem.mkdir(`/videos/${assetsId}`, "document");
        self.assets.push({ id: assetsId, path: `${fileSystem.DOCUMENT_ROOT_DIR}/videos/${assetsId}/${name}` });
      }
    }),
    removeAssets(assets: typeof Assets) {
      destroy(assets);
    },
  }));

const videoStore = VideoStore.create();

export default videoStore;
