/**
 * 演示如何在Chrome扩展中使用Rettiwt-API
 * 这个文件应该放在background script中
 */

import { Rettiwt } from 'rettiwt-api';

// 初始化Rettiwt实例
const rettiwt = new Rettiwt({
  useChromeExtension: true,
  logging: true
});

// 监听来自popup或content script的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'fetchUserDetails':
      fetchUserDetails(message.username)
        .then(user => sendResponse({ success: true, user }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true; // 保持消息通道开放，等待异步响应
      
    case 'fetchUserTweets':
      fetchUserTweets(message.username, message.count)
        .then(tweets => sendResponse({ success: true, tweets }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
      
    case 'postTweet':
      postTweet(message.text, message.media)
        .then(tweetId => sendResponse({ success: true, tweetId }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
      
    case 'likeTweet':
      likeTweet(message.tweetId)
        .then(result => sendResponse({ success: true, result }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
  }
});

/**
 * 获取用户详情
 * @param {string} username - 用户名
 * @returns {Promise<Object>} 用户信息对象
 */
async function fetchUserDetails(username) {
  if (!username) {
    throw new Error('用户名不能为空');
  }
  
  const user = await rettiwt.user.details(username);
  return user;
}

/**
 * 获取用户推文
 * @param {string} username - 用户名
 * @param {number} count - 要获取的推文数量，默认20
 * @returns {Promise<Array>} 推文数组
 */
async function fetchUserTweets(username, count = 20) {
  if (!username) {
    throw new Error('用户名不能为空');
  }
  
  const tweets = await rettiwt.user.tweets(username, count);
  return tweets;
}

/**
 * 发送推文，可选附加媒体
 * @param {string} text - 推文内容
 * @param {ArrayBuffer} [mediaBuffer] - 媒体文件的ArrayBuffer
 * @returns {Promise<string>} 发送成功的推文ID
 */
async function postTweet(text, mediaBuffer = null) {
  if (!text || text.trim().length === 0) {
    throw new Error('推文内容不能为空');
  }
  
  let mediaId;
  if (mediaBuffer) {
    try {
      mediaId = await rettiwt.tweet.upload(mediaBuffer);
    } catch (error) {
      console.error('媒体上传失败:', error);
      throw new Error(`媒体上传失败: ${error.message}`);
    }
  }
  
  const tweetOptions = {
    text: text,
    media: mediaId ? { ids: [mediaId] } : undefined
  };
  
  const tweetId = await rettiwt.tweet.post(tweetOptions);
  return tweetId;
}

/**
 * 给推文点赞
 * @param {string} tweetId - 推文ID
 * @returns {Promise<boolean>} 是否点赞成功
 */
async function likeTweet(tweetId) {
  if (!tweetId) {
    throw new Error('推文ID不能为空');
  }
  
  const result = await rettiwt.tweet.like(tweetId);
  return result;
}

// 作为示例，导出这些功能，以便在扩展的其他部分使用
export {
  fetchUserDetails,
  fetchUserTweets,
  postTweet,
  likeTweet
}; 