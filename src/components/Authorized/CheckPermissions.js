/**
 * 根据路由的 authority, 去检查当前用户的权限是否符合要求
 * authority 支持 string array function promise
 * 1. 符合要求, 返回对应的路由 target
 * 2. 不符合要求, 返回对应的 exception 页面
 */
import React from 'react'
import PromiseRender from './PromiseRender'
import { CURRENT } from './RenderAuthorize'

function isPromise(obj) {
  return (
    !!obj &&
    (typeof obj === 'object' || typeof obj === 'function') &&
    typeof obj.then === 'function'
  )
}

/**
 * 通用权限检查方法
 * @param { 路由需要的权限 string |array | Promise | Function } authority
 * @param { 用户的权限 type:string} currentAuthority
 * @param { 通过的组件 } target
 * @param { 未通过的组件 } Exception
 */
const checkPermissions = (authority, currentAuthority, target, Exception) => {
  // 没有判定权限.默认查看所有
  if (!authority) {
    return target
  }

  if (Array.isArray(authority)) {
    if (authority.indexOf(currentAuthority) >= 0) {
      return target
    }
    if (Array.isArray(currentAuthority)) {
      for (let i = 0; i < currentAuthority.length; i += 1) {
        const element = currentAuthority[i]
        if (authority.indexOf(element) >= 0) {
          return target
        }
      }
    }
    return Exception
  }

  // string 处理
  if (typeof authority === 'string') {
    if (authority === currentAuthority) {
      return target
    }
    if (Array.isArray(currentAuthority)) {
      for (let i = 0; i < currentAuthority.length; i += 1) {
        const element = currentAuthority[i]
        if (authority.indexOf(element) >= 0) {
          return target
        }
      }
    }
    return Exception
  }

  // 支持权限检查的方法返回 Promise
  if (isPromise(authority)) {
    return <PromiseRender ok={target} error={Exception} promise={authority} />
  }

  // 支持权限检查是一个 function
  if (typeof authority === 'function') {
    try {
      const bool = authority(currentAuthority)
      // 函数执行后返回值是 Promise
      if (isPromise(bool)) {
        return <PromiseRender ok={target} error={Exception} promise={bool} />
      }
      if (bool) {
        return target
      }
      return Exception
    } catch (error) {
      throw error
    }
  }
  throw new Error('unsupported parameters')
}

export { checkPermissions }

const check = (authority, target, Exception) => {
  return checkPermissions(authority, CURRENT, target, Exception)
}

export default check
