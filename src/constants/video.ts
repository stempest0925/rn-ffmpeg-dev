import {Dimensions} from 'react-native';

const {width: VIEWPORT_WIDTH} = Dimensions.get('window');
const STANDARD_RADIO = 9 / 16;

export const VIDEO_HEIGHT = Math.floor(VIEWPORT_WIDTH * STANDARD_RADIO);
