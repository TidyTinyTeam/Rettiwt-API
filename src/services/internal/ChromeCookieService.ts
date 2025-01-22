export class ChromeCookieService {
  private static async getTwitterCookies(): Promise<string[]> {
    return new Promise((resolve) => {
      chrome.cookies.getAll({ domain: "x.com" }, (cookies) => {
        const cookieStrings = cookies.map(
          (cookie) => `${cookie.name}=${cookie.value}`
        );
        resolve(cookieStrings as string[]);
      });
    });
  }

  public static async getAuthHeaders(): Promise<Record<string, string>> {
    const cookies = await this.getTwitterCookies();
    const csrfCookie = cookies
      .map(cookie => {
        const [name, value] = cookie.split('=');
        return { name, value };
      })
      .find(c => c.name === 'ct0');
    
    const authCookie = cookies
      .map(cookie => {
        const [name, value] = cookie.split('=');
        return { name, value };
      })
      .find(c => c.name === 'auth_token');

    if (!csrfCookie || !authCookie) {
      throw new Error('Required cookies not found');
    }

    return {
      'authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
      'x-csrf-token': csrfCookie.value,
      'x-twitter-auth-type': 'OAuth2Session',
      'x-twitter-active-user': 'yes'
    };
  }

  public static async getCookieString(): Promise<string> {
    const cookies = await this.getTwitterCookies();
    return cookies.join('; ');
  }
  
}