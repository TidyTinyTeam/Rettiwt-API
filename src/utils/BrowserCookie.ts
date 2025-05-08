/**
 * 浏览器环境中替代cookiejar库的简单实现
 */

/**
 * 简单的Cookie类，用于替代cookiejar中的Cookie类
 */
export class Cookie {
  public name: string;
  public value: string;
  public properties: Record<string, string>;
  
  /**
   * 创建一个新的Cookie实例
   * @param cookieString - Cookie字符串，例如 "name=value"
   */
  constructor(cookieString: string) {
    this.properties = {};
    
    if (typeof cookieString !== 'string') {
      this.name = '';
      this.value = '';
      return;
    }
    
    const [nameValue, ...attrs] = cookieString.split(';').map(s => s.trim());
    const [name, value] = nameValue.split('=');
    
    this.name = name;
    this.value = value || '';
    
    // 存储cookie属性
    this.properties[name] = value || '';
    
    // 解析其他属性
    for (const attr of attrs) {
      const [attrName, attrValue] = attr.split('=');
      this.properties[attrName] = attrValue || '';
    }
  }
  
  /**
   * 将cookie转换为字符串
   */
  toString(): string {
    return `${this.name}=${this.value}`;
  }
  
  /**
   * 解析cookie字符串
   * @param cookieString - 完整的cookie字符串
   */
  static parse(cookieString: string): Cookie {
    return new Cookie(cookieString);
  }
}

/**
 * 解析多个cookie
 * @param cookiesString - 多个cookie组成的字符串，用分号分隔
 */
export function parseCookies(cookiesString: string): Cookie[] {
  if (!cookiesString) return [];
  
  // 分割cookie字符串并创建Cookie对象
  return cookiesString.split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .map(s => new Cookie(s));
}

/**
 * 从Chrome扩展的cookie API创建Cookie对象数组
 * @param chromeCookies - 从chrome.cookies.getAll获取的cookie对象数组
 */
export function fromChromeCookies(chromeCookies: chrome.cookies.Cookie[]): Cookie[] {
  return chromeCookies.map(cookie => {
    const cookieObj = new Cookie(`${cookie.name}=${cookie.value}`);
    cookieObj.properties[cookie.name] = cookie.value;
    return cookieObj;
  });
} 