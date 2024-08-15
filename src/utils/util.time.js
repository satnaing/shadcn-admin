// util.time.js

export class TimeUtils {
    static formatTime(date, fmt = 'yyyy-MM-dd hh:mm:ss') {
        let crtTime = new Date(date);
        let o = {
            "M+": crtTime.getMonth() + 1,               //月份
            "d+": crtTime.getDate(),                    //日
            "h+": crtTime.getHours(),                   //小时
            "m+": crtTime.getMinutes(),                 //分
            "s+": crtTime.getSeconds(),                 //秒
            "q+": Math.floor((crtTime.getMonth() + 3) / 3), //季度
            "S": crtTime.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (crtTime.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (let k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }


    static formatRelativeTime(date) {
        const now = new Date();
        const diff = now - new Date(date);

        if (diff < 60000) {
            return '刚刚';
        } else if (diff < 3600000) {
            const minutes = Math.floor(diff / 60000);
            return `${minutes} 分钟前`;
        } else if (diff < 86400000) {
            const hours = Math.floor(diff / 3600000);
            return `${hours} 小时前`;
        } else {
            return this.formatTime(date);
        }
    }
}

