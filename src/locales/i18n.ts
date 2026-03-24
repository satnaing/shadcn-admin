import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

enum LocalEnum {
	en_US = "en_US",
	zh_CN = "zh_CN",
}

import en_US from "./lang/en_US";
import zh_CN from "./lang/zh_CN";

// 从 localStorage 读取语言设置，如果没有则使用中文
const storedLng = typeof window !== 'undefined' ? localStorage.getItem('i18nextLng') : null;
const defaultLng = storedLng || "zh_CN";

// 初始化时设置HTML lang属性，否则系统语言和设定不同时会弹出浏览器的翻译提示
if (typeof document !== 'undefined') {
	document.documentElement.lang = defaultLng;
}

i18n
	// 加载翻译文件
	// .use(Backend)
	// detect user language
	// learn more: https://github.com/i18next/i18next-browser-languagedetector
	.use(LanguageDetector)
	// pass the i18n instance to react-i18next.
	.use(initReactI18next)
	// init i18next
	// for all options read: https://www.i18next.com/overview/configuration-options
	.init({
		debug: import.meta.env.DEV,
		lng: defaultLng, // localstorage -> i18nextLng: en_US
		fallbackLng: LocalEnum.en_US,
		// backend: {
		// 	loadPath: './lang/{{lng}}/{{ns}}.json', // 翻译文件路径
		// },
		interpolation: {
			escapeValue: false, // not needed for react as it escapes by default
		},
		react: {
			useSuspense: false,
		},
		resources: {
			en_US: en_US,
			zh_CN: zh_CN,
		},
		detection: {
			order: ['localStorage', 'navigator'],
			caches: ['localStorage'],
		},
	});

export const { t } = i18n;
export default i18n;
