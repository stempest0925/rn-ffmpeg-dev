import {FFmpegKit, FFprobeKit} from 'ffmpeg-kit-react-native';

export default class FFmepg {
  static transcoding(
    targetFile: string,
    outFile: string,
    completeCallback: () => void,
    progressCallback?: (progress: number) => void,
    command: FFmpegCommand = new FFmpegCommand(targetFile, outFile).add('-s 1920x1080').add('-r 30'),
  ) {
    try {
      const commandStr = command.getCommand();

      if (progressCallback) {
        FFmepg.getDuration(targetFile).then(duration => {
          FFmpegKit.executeAsync(commandStr, completeCallback, undefined, statistics => {
            const progress = Math.floor((statistics.getTime() / duration) * 100);
            progressCallback(progress);
          });
        });
      } else {
        FFmpegKit.executeAsync(commandStr, completeCallback);
      }
    } catch (error) {
      console.error('transcoding error', error instanceof Error ? error.message : error);
    }
  }

  static async getDuration(targetFile: string) {
    const mediaSession = await FFprobeKit.getMediaInformation(targetFile);
    return Math.floor(mediaSession.getMediaInformation().getDuration() * 1000);
  }
}

export class FFmpegCommand {
  targetFile: string;
  outFile: string;
  optionStr: string;

  constructor(targetFile: string, outFile: string) {
    this.targetFile = targetFile;
    this.outFile = outFile;
    this.optionStr = '';
  }

  add(options: string | string[]): FFmpegCommand {
    if (Array.isArray(options)) {
      for (let item = 0; item < options.length; item++) {
        this.optionStr += `${options[item].trim()} `;
      }
    } else {
      this.optionStr += `${options.trim()} `;
    }
    return this;
  }

  getCommand(): string {
    return `-i ${this.targetFile} ${this.optionStr.trim()} ${this.outFile}`;
  }
}
