class Logger {
    static typeColor(type = 'default') {
        let color = '';
        switch (type) {
            case 'default':
                color = '#35495E';
                break;
            case 'primary':
                color = '#3f51b5';
                break;
            case 'success':
                color = '#43B883';
                break;
            case 'warning':
                color = '#e6a23c';
                break;
            case 'danger':
                color = '#f56c6c';
                break;
            default:
                break;
        }
        return color;
    }

    static capsule(title, info, type = 'primary') {
        console.log(
            `%c ${title} %c ${info} %c`,
            'background:#35495E; padding: 1px; border-radius: 3px 0 0 3px; color: #fff;',
            `background:${this.typeColor(type)}; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff;`,
            'background:transparent'
        );
    }

    static colorful(textArr) {
        console.log(
            `%c${textArr.map(t => t.text || '').join('%c')}`,
            ...textArr.map(t => `color: ${this.typeColor(t.type)};`)
        );
    }

    static default(text) {
        this.colorful([{text}]);
    }

    static primary(text) {
        this.colorful([{text, type: 'primary'}]);
    }

    static success(text) {
        this.colorful([{text, type: 'success'}]);
    }

    static warning(text) {
        this.colorful([{text, type: 'warning'}]);
    }

    static danger(text) {
        this.colorful([{text, type: 'danger'}]);
    }

//     static admin(text) {
//         let info = `
//  ________      ___    ___ ________  ________  _____ ______   ___  ________
// |\\_____  \\    |\\  \\  /  /|\\   __  \\|\\   ___ \\|\\   _ \\  _   \\|\\  \\|\\   ___  \\
//  \\|___/  /|   \\ \\  \\/  / | \\  \\|\\  \\ \\  \\_|\\ \\ \\  \\\\\\__\\ \\  \\ \\  \\ \\  \\\\ \\  \\
//      /  / /    \\ \\    / / \\ \\   __  \\ \\  \\ \\\\ \\ \\  \\\\|__| \\  \\ \\  \\ \\  \\\\ \\  \\
//     /  /_/__    \\/  /  /   \\ \\  \\ \\  \\ \\  \\_\\\\ \\ \\  \\    \\ \\  \\ \\  \\ \\  \\\\ \\  \\
//    |\\________\\__/  / /      \\ \\__\\ \\__\\ \\_______\\ \\__\\    \\ \\__\\ \\__\\ \\__\\\\ \\__\\
//     \\|_______|\\___/ /        \\|__|\\|__|\\|_______|\\|__|     \\|__|\\|__|\\|__| \\|__|
//              \\|___|/
//
// `
//         this.colorful([{text: info, type: 'primary'}]);
//     }
    static admin(text) {
        let info = `
.----------------------------------------------------------. 
|  *******************ZYAdmin启动成功********************* |
|  项目版本: v1.0.0                                        |
|  Node版本: v20.9.0                                       |
|  项目作者: ZHOUYI                                        |
|  作者主页: https://gitee.com/Z568_568                    |
|  ******************************************************  |
'----------------------------------------------------------'
`
        this.colorful([{text: info, type: 'primary'}]);
    }
}

export default Logger;
