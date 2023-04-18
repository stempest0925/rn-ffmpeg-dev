import { types } from "mobx-state-tree";

const Progress = types.model({
  visible: types.boolean,
  text: types.string,
  num: types.number,
});

const ProgressStore = Progress.create({ visible: true, text: "文件转码中，请稍后....", num: 0 });

export default ProgressStore;
