import produce from 'immer';
import {VideoEditorAction} from './action';

interface VideoEditorState {
  uri: string | null;
}

export const initialState: VideoEditorState = {uri: null};

export function reducer(state: VideoEditorState, action: VideoEditorAction) {
  return produce(state, draft => {
    switch (action.type) {
      case 'videoEditor/SET_VIDEO_URI': {
        draft.uri = action.uri;
        break;
      }
    }
  });
}
