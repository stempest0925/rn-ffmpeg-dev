import { Platform } from "react-native";
import RNFS from "react-native-fs";

class fileSystem {
  static readonly ROOT_PREFIX = Platform.OS === "android" ? "file://" : "";
  static readonly CACHE_ROOT_DIR = fileSystem.ROOT_PREFIX + RNFS.CachesDirectoryPath + "/";
  static readonly DOCUMENT_ROOT_DIR = fileSystem.ROOT_PREFIX + RNFS.DocumentDirectoryPath + "/";

  /**
   * 检查路径是否存在。
   * @param path
   */
  static exists(path: string): Promise<boolean> {
    return RNFS.exists(path);
  }

  /**
   * 基于mkdir，循环创建层级文件夹。
   * @param dir
   * @param root
   */
  static mkdir(dir: string, root: "cache" | "document"): Promise<boolean> {
    return new Promise(async resolve => {
      const dirs: string[] = dir.split("/").filter(item => item !== "");
      if (dirs.length > 0) {
        const rootDir = root === "document" ? fileSystem.DOCUMENT_ROOT_DIR : fileSystem.CACHE_ROOT_DIR;
        for (let item = 1; item <= dirs.length; item++) {
          const path = rootDir + dirs.slice(0, item).join("/") + "/";
          const isExists = await fileSystem.exists(path);

          if (!isExists) {
            await RNFS.mkdir(path);
          } else {
            continue;
          }
        }
      }
      resolve(true);
    });
  }

  /**
   * 基于copyFile，覆盖模式下ios先删除后copy，后缀模式下，基于时间戳存储(可调整)。
   * @param filepath
   * @param destPath
   * @param mode
   */
  static copy(filepath: string, destPath: string, mode: "overwrite" | "suffix" = "overwrite"): Promise<boolean> {
    return new Promise(async resolve => {
      if (mode === "overwrite") {
        if (Platform.OS === "android") {
          await RNFS.copyFile(filepath, destPath);
          resolve(true);
        } else {
          const _deleteStatus = await fileSystem.delete(destPath);
          if (_deleteStatus) {
            await RNFS.copyFile(filepath, destPath);
            resolve(true);
          } else {
            resolve(false);
          }
        }
      } else {
        const _regexp = new RegExp(/[^\/]+(?=\.[\w]+$)/);
        const _match = destPath.match(_regexp);
        if (_match) {
          const _filename = _match && _match[0];
          const _suffix = new Date().getTime();
          const _destPath = destPath.replace(_regexp, `${_filename}_${_suffix}`);
          await RNFS.copyFile(filepath, _destPath);
          resolve(true);
        } else {
          resolve(false);
        }
      }
    });
  }

  /**
   * 基于unlink，增加exists功能解决目标不存在抛出的异常。
   * 目标不存在: true
   * 目标存在 & 删除成功: true
   * 目标存在 & 删除失败: false
   * @param path
   */
  static delete(path: string): Promise<boolean> {
    return new Promise(async resolve => {
      const isExists = await fileSystem.exists(path);
      if (isExists) {
        try {
          await RNFS.unlink(path);
          resolve(true);
        } catch (error) {
          resolve(false);
        }
      } else {
        resolve(true);
      }
    });
  }

  /**
   * 清除缓存。
   * @param dir
   */
  static clearCache(dir?: string): Promise<boolean> {
    return new Promise(async resolve => {
      const _deleteStatus = await fileSystem.delete(fileSystem.CACHE_ROOT_DIR + (dir ? dir : ""));

      resolve(_deleteStatus);
    });
  }

  /**
   * 获取文件名称
   * @param filepath
   * @returns
   */
  static getFileName(filepath: string) {
    try {
      const index = filepath.lastIndexOf("/") + 1;
      const file = filepath.substring(index, filepath.length);
      const fileTuple = file.split(".");
      if (fileTuple.length === 2 && fileTuple[0] !== "" && fileTuple[1]) {
        return { name: fileTuple[0], ext: fileTuple[1] };
      } else throw new Error("无效的文件路径");
    } catch (error) {
      console.error(error);
    }
  }
}

export default fileSystem;
