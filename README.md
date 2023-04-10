### [问题 1] 使用 seek()函数跳转到指定位置进度会回退

解决方案:
在 ReactVideoView.java 中使用 mMediaPlayer.seekTo 替代父类 seekTo 进行跳转。
[(相关链接)](https://github.com/react-native-video/react-native-video/issues/2230#issuecomment-892982288)

### 关于 gesture move 事件（VideoView.tsx）

1.  onUpdate/onChange 与 onEnd 是相互独立的回调，即 onEnd 结束后两者回调依旧会在后续短暂触发，但 onChange 差距尽可能的小，因此采用该回调。
2.  由于 onChange 差距较小，最后一次回调，约等于 onEnd 的数据手势数据，所以 onEnd 可以省略一次计算，直接获取 moveTime 进行设置。
3.  回调节流会有数据上的延迟，因此取消。
4.  onUpdate & onChange 均有第一次的起始无移动数据的回调，即 translationX Or Y 都是 0，跳过该无效数据。
