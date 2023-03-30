export default class FFmpegCommand {
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
