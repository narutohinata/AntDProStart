import { DefaultFooter } from '@ant-design/pro-layout';
import { useIntl } from 'umi';

const Footer: React.FC = () => {
  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: 'app.copyright.produced',
    defaultMessage: '椰岛技术支持部出品',
  });

  const currentYear = new Date().getFullYear();

  return <DefaultFooter copyright={`${currentYear} ${defaultMessage}`} />;
};

export default Footer;
