import produce from 'immer';
import {VideoEditorAction} from './action';

interface VideoEditorState {
  uri: string | null;
  thumbnailList: string[] | null;
}

export const initialState: VideoEditorState = {
  uri: null,
  thumbnailList: null,
};

export function reducer(state: VideoEditorState, action: VideoEditorAction) {
  return produce(state, draft => {
    switch (action.type) {
      case 'videoEditor/SET_VIDEO_URI': {
        draft.uri = action.uri;
        break;
      }
      case 'videoEditor/SET_THUMBNAIL_LIST': {
        draft.thumbnailList = action.list;
        break;
      }
    }
  });
}
