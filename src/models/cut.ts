import { types } from "mobx-state-tree";

const Cut = types.model({
  assetsId: types.identifier,
  start: types.number,
  end: types.number,
});

export default Cut;
