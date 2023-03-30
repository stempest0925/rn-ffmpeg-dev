import {PermissionsAndroid, type Permission} from 'react-native';

export async function requestPermission(permissions: Permission | Permission[]) {
  if (Array.isArray(permissions)) {
    // const passedArray = await permissions.map(async permission => {
    //   const passed = await PermissionsAndroid.check(permission);
    //   return passed;
    // });

    let CheckPromises = [];
    for (let item = 0; item < permissions.length; item++) {
      CheckPromises.push(PermissionsAndroid.check(permissions[item]));
    }
    const CheckPromiseArray = await Promise.all(CheckPromises);

    const multipleCheck = CheckPromiseArray.every(passed => passed);

    if (!multipleCheck) {
      const requestStatusArray = await PermissionsAndroid.requestMultiple(permissions);
      return Object.values(requestStatusArray).every(status => status === 'granted');
    }

    return multipleCheck;
  } else {
    const singleCheck = await PermissionsAndroid.check(permissions);

    if (!singleCheck) {
      const requestStatus = await PermissionsAndroid.request(permissions);
      return requestStatus === 'granted';
    }

    return singleCheck;
  }
}
