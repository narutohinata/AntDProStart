import { TOKEN } from '@/constants';
import { Button, Space } from 'antd';
import React, { useCallback } from 'react';
import { history, SelectLang, useModel } from 'umi';
import styles from './index.less';

export type SiderTheme = 'light' | 'dark';

const logOut = async () => {
  window.localStorage.removeItem(TOKEN);
};

const GlobalHeaderRight: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const handleLogoutBtnClick = useCallback(async () => {
    await logOut();
    setInitialState((s) => ({
      ...s,
      currentUser: null,
    }));
    history.push('/user/login');
  }, []);

  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }
  return (
    <Space className={className}>
      {/* <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="站内搜索"
        defaultValue="umi ui"
        options={[
          { label: <a href="https://umijs.org/zh/guide/umi-ui.html">umi ui</a>, value: 'umi ui' },
          {
            label: <a href="next.ant.design">Ant Design</a>,
            value: 'Ant Design',
          },
          {
            label: <a href="https://protable.ant.design/">Pro Table</a>,
            value: 'Pro Table',
          },
          {
            label: <a href="https://prolayout.ant.design/">Pro Layout</a>,
            value: 'Pro Layout',
          },
        ]}
        // onSearch={value => {
        //   console.log('input', value);
        // }}
      /> */}
      {/* <span
        className={styles.action}
        onClick={() => {
          window.open('https://pro.ant.design/docs/getting-started');
        }}
      >
        <QuestionCircleOutlined />
      </span> */}
      {/* <Avatar /> */}
      <h4 className={`${styles.name} anticon`}>{initialState.currentUser?.username}</h4>
      {initialState.currentUser?.username && (
        <Button onClick={handleLogoutBtnClick} size="small" danger ghost>
          登出
        </Button>
      )}
      <SelectLang className={styles.action} />
    </Space>
  );
};
export default GlobalHeaderRight;
