/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(
  initialState: { currentUser?: API.CurrentUser; permissions: string[] } | undefined,
) {
  const { currentUser, permissions } = initialState ?? {};
  console.log(currentUser);
  console.log('permissions', permissions);
  return {
    canAdmin: permissions?.includes('canAdminSubPage'),
    canList: permissions?.includes('canList'),
    canAdminSubPage: permissions?.includes('canAdminSubPage'),
  };
}
