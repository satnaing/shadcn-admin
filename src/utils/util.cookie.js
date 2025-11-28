// 设置Cookie
// 示例：设置名为"username"的Cookie，值为"John Doe"，有效期为7天
// setCookie('username', 'John Doe', 7);
export const setCookie = function (name, value, days) {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/`;
}

// 获取特定Cookie的值
// 示例：获取名为"username"的Cookie的值
// const username = getCookie('username');
export const getCookie = function (name) {
    const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith(`${name}=`));

    if (cookieValue) {
        return decodeURIComponent(cookieValue.split('=')[1]);
    }

    return null; // 如果未找到该Cookie，则返回null
}
