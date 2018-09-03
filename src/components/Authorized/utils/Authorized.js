import { getAuthority } from './Authority';
import RenderAuthorized from '../index';

let Authorized = RenderAuthorized(getAuthority()); // eslint-disable-line

// 重新加载正确的组件
const reloadAuthorized = () => {
  Authorized = RenderAuthorized(getAuthority());
};

export { reloadAuthorized };
export default Authorized;
