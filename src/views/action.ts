export const SET_VIDEO_URI = 'videoEditor/SET_VIDEO_URI';
export const SET_THUMBNAIL_LIST = 'videoEditor/SET_THUMBNAIL_LIST';
export interface SetVideoUriAction {
  type: typeof SET_VIDEO_URI;
  uri: string;
}
export function setVideoUri(uri: string): SetVideoUriAction {
  return {type: SET_VIDEO_URI, uri};
}

export interface SetThumbnailListAction {
  type: typeof SET_THUMBNAIL_LIST;
  list: string[];
}
export function SetThumbnailList(list: string[]): SetThumbnailListAction {
  return {type: SET_THUMBNAIL_LIST, list};
}

export type VideoEditorAction = SetVideoUriAction | SetThumbnailListAction;
