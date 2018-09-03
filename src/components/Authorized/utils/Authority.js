// 获取用户的权限
// 暂时从 localStoreage 获取, 可以改成从服务端获取, 支持 Promise 化
export function getAuthority() {
  // return localStorage.getItem('chronicle-authority') || ['admin', 'user'];
  return localStorage.getItem('chronicle-authority') || 'user';
}

export function setAuthority(authority) {
  return localStorage.setItem('chronicle-authority', authority);
}
