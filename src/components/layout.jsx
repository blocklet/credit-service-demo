import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import Header from '@blocklet/ui-react/lib/Header';
import { SmartDisplay } from '@mui/icons-material';
import { Avatar, Box, Container, Fade, Typography, alpha, useTheme } from '@mui/material';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { useSessionContext } from '../libs/session';

export default function Layout() {
  const theme = useTheme();
  const { t } = useLocaleContext();

  const { events } = useSessionContext();
  useEffect(() => {
    events.once('logout', () => {
      window.location.href = '/home';
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'background.paper' }}>
      {/* 现代化AppBar */}
      <Header brand={null} description={null} maxWidth={false} />

      {/* 主要内容区域 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 7, sm: 8 }, // 为AppBar留出空间
          backgroundColor: 'background.paper',
        }}>
        <Fade in timeout={800}>
          <Box>
            <Outlet />
          </Box>
        </Fade>
      </Box>

      {/* 底部信息 */}
      <Box
        component="footer"
        sx={{
          backgroundColor: alpha(theme.palette.background.paper, 0.85),
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          py: 3,
        }}>
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box display="flex" alignItems="center">
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 32, height: 32 }}>
                <SmartDisplay />
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  {t('layout.footer.title')}
                </Typography>
                <Typography
                  variant="caption"
                  onClick={() => {
                    window.open('https://www.arcblock.io/docs/arcblock-payment-kit/capabilities-payment-js', '_blank');
                  }}
                  sx={{ cursor: 'pointer', color: 'text.secondary', '&:hover': { textDecoration: 'underline' } }}>
                  {t('layout.footer.subtitle')}
                </Typography>
              </Box>
            </Box>

            <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {t('layout.footer.copyright')}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
