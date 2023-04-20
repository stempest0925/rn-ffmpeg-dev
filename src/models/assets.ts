import { types, getRoot } from "mobx-state-tree";

const Assets = types
  .model({
    id: types.string,
    path: types.string,
    thumbnails: types.optional(types.array(types.string), []),
  })
  .actions(self => ({}));

export { Assets };
