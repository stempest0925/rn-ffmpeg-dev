import { types } from "mobx-state-tree";

const Progress = types
  .model({
    visible: types.boolean,
    text: types.string,
    num: types.number,
  })
  .actions(self => ({
    setProgress(progress: number) {
      self.num = progress;
    },
  }));

const ProgressStore = Progress.create({ visible: false, text: "文件转码中，请稍后....", num: 0 });

export default ProgressStore;
