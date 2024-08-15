import dbUtils from "./util.strotage";

/**
 * 16进制颜色转换透明度后的16进制颜色值
 * @param {string} color 原始颜色 #FFFFFF
 * @param {number} opacity 颜色透明度 10 20
 * @returns {string} 转换后的颜色值
 */
export const adjustColorOpacity = function (color, opacity) {
    // 移除 # 号（如果有）
    color = color.replace("#", "");

    // 将十六进制颜色值转换为 RGB 值
    let r = parseInt(color.substring(0, 2), 16);
    let g = parseInt(color.substring(2, 4), 16);
    let b = parseInt(color.substring(4, 6), 16);

    // 将透明度转换为 0 到 1 之间的值
    opacity = opacity / 100;

    // 计算插值后的颜色值
    let interpolatedR = Math.round((1 - opacity) * 255 + opacity * r);
    let interpolatedG = Math.round((1 - opacity) * 255 + opacity * g);
    let interpolatedB = Math.round((1 - opacity) * 255 + opacity * b);

    // 将插值后的 RGB 值转换回十六进制颜色值
    let result = "#" + (interpolatedR < 16 ? "0" : "") + interpolatedR.toString(16);
    result += (interpolatedG < 16 ? "0" : "") + interpolatedG.toString(16);
    result += (interpolatedB < 16 ? "0" : "") + interpolatedB.toString(16);

    return result;
}

/**
 * 判断空对象
 * @param {Object} obj 原始对象
 * @returns {Boolean} 返回true/false
 */
export const isEmptyObject = function (obj) {
    return JSON.stringify(obj) === '{}';
}


/**
 * 替换字符串中间的数字为指定字符
 * @param {string} str 原始字符串
 * @param {string} replaceChar 替换的字符，默认为'*'
 * @param {number} numDigits 保留的数字位数，默认为1
 * @returns {string} 替换后的字符串
 */
export const replaceMiddleDigits = (str, replaceChar = '*', numDigits = 1) => {
    if (str.length < numDigits + 2) {
        return str;
    }
    const firstPart = str.substring(0, numDigits);
    const lastPart = str.substring(str.length - numDigits);
    const middlePart = replaceChar.repeat(str.length - numDigits * 2);

    return firstPart + middlePart + lastPart;
}


/**
 * 判断本地存储用户的权限信息作对比
 * @param {string} permission 权限标识 ‘sys:demon:list’
 * @returns {Boolean} 返回true/false
 */
export const hasPerms = function (permission) {
    const permissionList = dbUtils.get('perms');
    if (permissionList.includes('*')) return true
    return permissionList.includes(permission)
}


