import copy from './modules/copy'
import permission from './modules/permission'
import debounce from './modules/debounce'


// 自定义指令
const directives = {
    copy,
    permission,
    debounce
};

// 这种写法可以批量注册指令
export default {
    install(app) {
        Object.keys(directives).forEach((key) => {
            app.directive(key, directives[key]);
        });
    },
};
