import { FFmpegKit, FFprobeKit } from "ffmpeg-kit-react-native";
import FFmpegCommand from "./ffmpegCommand";

const RESOLUTION_PRESET = {
  qHD: "640x360",
  qFHD: "960x540",
  HD: "1280x720",
  FHD: "1920x1080",
  QHD: "2560x1440",
  UHD: "3840x2160",
};

export default class FFmepg {
  /**
   * 转码
   * @param inputFile
   * @param outputFile
   * @param completeCallback
   * @param progressCallback
   * @param command
   */
  static transcoding(
    inputFile: string,
    outputFile: string,
    completeCallback: () => void,
    progressCallback?: (progress: number) => void,
    command: FFmpegCommand = new FFmpegCommand(inputFile, outputFile).add(`-s ${RESOLUTION_PRESET.HD}`).add("-r 30"),
  ) {
    try {
      const commandStr = command.getCommand();

      if (progressCallback) {
        FFmepg.getInfo(inputFile).then(info => {
          const duration = Math.floor(info.getDuration() * 1000);
          FFmpegKit.executeAsync(commandStr, completeCallback, undefined, statistics => {
            const progress = Math.floor((statistics.getTime() / duration) * 100);
            progressCallback(progress);
          });
        });
      } else {
        FFmpegKit.executeAsync(commandStr, completeCallback);
      }
    } catch (error) {
      console.error("transcoding error", error instanceof Error ? error.message : error);
    }
  }

  /**
   * 获取信息
   * @param file
   * @returns
   */
  static async getInfo(file: string) {
    const session = await FFprobeKit.getMediaInformation(file);
    return session.getMediaInformation();
  }
}
