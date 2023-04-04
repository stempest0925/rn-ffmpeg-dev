import {Platform} from 'react-native';
import RNFS from 'react-native-fs';

class fileSystem {
  static readonly ROOT_PREFIX = Platform.OS === 'android' ? 'file://' : '';

  static exists(filepath: string): Promise<boolean> {
    return RNFS.exists(filepath);
  }

  /**
   * 基于copyFile，覆盖模式下ios先删除后copy，后缀模式下，基于时间戳存储(可调整)。
   * @param filepath
   * @param destPath
   * @param mode
   */
  static copy(filepath: string, destPath: string, mode: 'overwrite' | 'suffix' = 'overwrite'): Promise<boolean> {
    return new Promise(async resolve => {
      if (mode === 'overwrite') {
        if (Platform.OS === 'android') {
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
   * @param filepath
   */
  static delete(filepath: string): Promise<boolean> {
    return new Promise(async resolve => {
      const _exists = await fileSystem.exists(filepath);
      if (_exists) {
        try {
          await RNFS.unlink(filepath);
          resolve(true);
        } catch (error) {
          resolve(false);
        }
      } else {
        resolve(true);
      }
    });
  }

  static clearCache(dir?: string): Promise<boolean> {
    return new Promise(async resolve => {
      const _cacheRoot = fileSystem.ROOT_PREFIX + RNFS.CachesDirectoryPath + '/';
      const _deleteStatus = await fileSystem.delete(dir ? _cacheRoot + dir : _cacheRoot);

      resolve(_deleteStatus);
    });
  }
}

export default fileSystem;
