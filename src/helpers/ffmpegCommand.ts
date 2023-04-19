export default class FFmpegCommand {
  inputFile: string;
  outputFile: string;
  optionStr: string;

  constructor(inputFile: string, outputFile: string) {
    this.inputFile = inputFile;
    this.outputFile = outputFile;
    this.optionStr = "";
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
    return `-i ${this.inputFile} ${this.optionStr.trim()} ${this.outputFile}`;
  }
}
