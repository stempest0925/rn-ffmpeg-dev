export const SET_VIDEO_URI = 'videoEditor/SET_VIDEO_URI';
export interface SetVideoUriAction {
  type: typeof SET_VIDEO_URI;
  uri: string;
}

export function setVideoUri(uri: string): SetVideoUriAction {
  return {type: SET_VIDEO_URI, uri};
}

export type VideoEditorAction = SetVideoUriAction;
