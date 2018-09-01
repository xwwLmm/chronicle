import React from 'react';
import Exception from '../Exception';
import CheckPermissions from './CheckPermissions';
/**
 * 默认的 错误页面
 */
const Exception403 = () => <Exception type="403" style={{ minHeight: 500, height: '80%' }} />;

const checkIsInstantiation = target => {
  if (!React.isValidElement(target)) {
    return target;
  }
  return () => target;
};

/**
 * 用于判断是否拥有权限访问此view权限
 * authority 支持传入  string ,funtion:()=>boolean|Promise
 * e.g. 'user' 只有user用户能访问
 * e.g. 'user,admin' user和 admin 都能访问
 * e.g. ()=>boolean 返回true能访问,返回false不能访问
 * e.g. Promise  then 能访问   catch不能访问
 * @param {string | function | Promise} authority
 * @param {ReactNode} error 非必需参数
 */
const authorize = (authority, error) => {
  /**
   * 防止传入字符串时找不到staticContext造成报错
   */
  let classError = false;
  if (error) {
    classError = () => error;
  }
  if (!authority) {
    throw new Error('authority is required');
  }
  return function decideAuthority(target) {
    const component = CheckPermissions(authority, target, classError || Exception403);
    return checkIsInstantiation(component);
  };
};

export default authorize;
