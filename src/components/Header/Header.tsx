import { Divider, Typography } from '@mui/joy';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { t } = useTranslation();
  return (
    <>
      <Typography level="h1" padding={1}>
        {t('pages.exam.title')}
      </Typography>
      <Divider inset="none" />
    </>
  );
};

export default Header;
