import { types } from "mobx-state-tree";

const Progress = types
  .model({
    visible: types.boolean,
    text: types.string,
    num: types.number,
  })
  .actions(self => ({
    openProgress(text: string) {
      self.visible = true;
      self.text = text;
      self.num = 0;
    },
    setProgress(progress: number) {
      self.num = progress;
    },
    closeProgress() {
      self.visible = false;
      self.text = "";
      self.num = 0;
    },
  }));

const ProgressStore = Progress.create({ visible: false, text: "", num: 0 });

export default ProgressStore;
