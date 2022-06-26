import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import {
  BookOutlined,
  CrownOutlined,
  HomeOutlined,
  LinkOutlined,
  SmileOutlined,
  TableOutlined,
} from '@ant-design/icons';
import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { MenuDataItem } from '@umijs/route-utils';
import type { RunTimeLayoutConfig } from 'umi';
import { history, Link } from 'umi';
import defaultSettings from '../config/defaultSettings';
import { queryCurrentUser } from './services/sessions';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

const IconMap = {
  home: <HomeOutlined />,
  smile: <SmileOutlined />,
  crown: <CrownOutlined />,
  table: <TableOutlined />,
};

const parseMenuItems = (menuItems: MenuDataItem[]): MenuinitialStateDataItem[] => {
  return menuItems.map((menuItem) => ({
    ...menuItem,
    icon: IconMap[menuItem.icon],
    children: menuItem.children && parseMenuItems(menuItem.children),
  }));
};
parseMenuItems([]);
/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: DASHBOARD_API.CurrentUser;
  loading?: boolean;
  permissions: string[];
  fetchUserInfo?: () => Promise<DASHBOARD_API.CurrentUser | undefined>;
}> {
  console.log('getInitialState');
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();
      return msg;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };

  // 如果当前在登录状态下访问/user/login页面，会重定向到首页
  const fetchUserInfoForLoginPage = async () => {
    try {
      const msg = await queryCurrentUser();
      history.replace('/');
      return msg;
    } catch (error) {
      // history.push(loginPath);
    }
    return undefined;
  };

  const fetchPermissions = async (): Promise<string[]> => {
    const permissions = await fetch('http://localhost:3000/api/permissions').then((res) =>
      res.json(),
    );
    return permissions;
  };
  let currentUser;
  if (history.location.pathname !== loginPath) {
    currentUser = await fetchUserInfo();
    const currentPermissions = await fetchPermissions();
    return {
      fetchUserInfo,
      permissions: currentPermissions,
      currentUser,
      settings: defaultSettings,
    };
  }
  currentUser = await fetchUserInfoForLoginPage();
  return {
    currentUser,
    fetchUserInfo,
    settings: defaultSettings,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.username,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    links: isDev
      ? [
          <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
          <Link to="/~docs" key="docs">
            <BookOutlined />
            <span>业务组件文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {/* {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )} */}
        </>
      );
    },
    // menuDataRender: async () => {
    //   const menus = await fetch('http://localhost:3000/api/menus').then(res => res.json());
    //   console.log(parseMenuItems(menus));
    //   return parseMenuItems(menus);
    // },
    // menu: {
    //   request: async () => {
    //   const menus = await fetch('http://localhost:3000/api/menus').then(res => res.json());
    //   console.log(parseMenuItems(menus));
    //   return parseMenuItems(menus);
    // }},
    ...initialState?.settings,
  };
};
