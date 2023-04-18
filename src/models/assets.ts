import { types, getRoot } from "mobx-state-tree";

const Assets = types
  .model({
    id: types.string,
    path: types.string,
    thumbnails: types.array(types.string),
  })
  .actions(self => ({}));

export { Assets };
