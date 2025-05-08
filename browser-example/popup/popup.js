/**
 * Rettiwt Chrome扩展的Popup脚本
 * 负责UI交互和与background script的通信
 */

// 在DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  // 初始化标签页切换
  initTabs();
  
  // 初始化表单提交处理
  initSearchForm();
  initPostForm();
  initActionForm();
});

/**
 * 初始化标签页切换功能
 */
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // 移除所有活跃状态
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // 激活当前标签
      button.classList.add('active');
      const tabName = button.getAttribute('data-tab');
      document.getElementById(`${tabName}-tab`).classList.add('active');
    });
  });
}

/**
 * 初始化搜索表单
 */
function initSearchForm() {
  const searchForm = document.getElementById('search-form');
  const resultContainer = document.getElementById('search-result');
  
  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const countInput = document.getElementById('count').value.trim();
    const count = countInput ? parseInt(countInput, 10) : 10;
    
    if (!username) {
      showError(resultContainer, '请输入用户名');
      return;
    }
    
    // 显示加载状态
    resultContainer.innerHTML = '正在获取数据...';
    
    try {
      // 发送消息到background script
      const response = await chrome.runtime.sendMessage({
        action: 'fetchUserTweets',
        username: username,
        count: count
      });
      
      if (response.success) {
        displayTweets(resultContainer, response.tweets);
      } else {
        showError(resultContainer, `错误: ${response.error}`);
      }
    } catch (error) {
      showError(resultContainer, `请求失败: ${error.message}`);
    }
  });
}

/**
 * 初始化发推表单
 */
function initPostForm() {
  const postForm = document.getElementById('post-form');
  const resultContainer = document.getElementById('post-result');
  
  postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const tweetText = document.getElementById('tweet-text').value.trim();
    const mediaFile = document.getElementById('media-file').files[0];
    
    if (!tweetText) {
      showError(resultContainer, '请输入推文内容');
      return;
    }
    
    // 显示加载状态
    resultContainer.innerHTML = '正在发送推文...';
    
    try {
      let mediaArrayBuffer = null;
      
      // 如果有文件，读取为ArrayBuffer
      if (mediaFile) {
        mediaArrayBuffer = await readFileAsArrayBuffer(mediaFile);
      }
      
      // 发送消息到background script
      const response = await chrome.runtime.sendMessage({
        action: 'postTweet',
        text: tweetText,
        media: mediaArrayBuffer
      });
      
      if (response.success) {
        showSuccess(resultContainer, `推文已发送! ID: ${response.tweetId}`);
        postForm.reset();
      } else {
        showError(resultContainer, `发送失败: ${response.error}`);
      }
    } catch (error) {
      showError(resultContainer, `请求失败: ${error.message}`);
    }
  });
}

/**
 * 初始化推文操作表单
 */
function initActionForm() {
  const actionForm = document.getElementById('action-form');
  const resultContainer = document.getElementById('action-result');
  
  actionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const tweetId = document.getElementById('tweet-id').value.trim();
    const actionType = document.querySelector('input[name="action"]:checked').value;
    
    if (!tweetId) {
      showError(resultContainer, '请输入推文ID');
      return;
    }
    
    // 显示加载状态
    resultContainer.innerHTML = '正在执行操作...';
    
    try {
      // 发送消息到background script
      const actionMessage = actionType === 'like' ? 
        { action: 'likeTweet', tweetId } : 
        { action: 'retweetTweet', tweetId };
      
      const response = await chrome.runtime.sendMessage(actionMessage);
      
      if (response.success) {
        const actionText = actionType === 'like' ? '点赞' : '转发';
        showSuccess(resultContainer, `${actionText}成功!`);
      } else {
        showError(resultContainer, `操作失败: ${response.error}`);
      }
    } catch (error) {
      showError(resultContainer, `请求失败: ${error.message}`);
    }
  });
}

/**
 * 将文件读取为ArrayBuffer
 */
function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * 显示推文列表
 */
function displayTweets(container, tweets) {
  if (!tweets || tweets.length === 0) {
    container.innerHTML = '没有找到推文';
    return;
  }
  
  const tweetsHTML = tweets.data.map(tweet => {
    return `
      <div style="border-bottom: 1px solid #ccc; padding-bottom: 8px; margin-bottom: 8px;">
        <strong>${tweet.tweetBy.name}</strong> 
        <small>@${tweet.tweetBy.userName}</small>
        <p>${tweet.text}</p>
        <small>ID: ${tweet.id} · ${new Date(tweet.createdAt).toLocaleString()}</small>
      </div>
    `;
  }).join('');
  
  container.innerHTML = `
    <div>找到 ${tweets.data.length} 条推文:</div>
    ${tweetsHTML}
  `;
}

/**
 * 显示错误消息
 */
function showError(container, message) {
  container.innerHTML = `<div class="error">${message}</div>`;
}

/**
 * 显示成功消息
 */
function showSuccess(container, message) {
  container.innerHTML = `<div class="success">${message}</div>`;
} 