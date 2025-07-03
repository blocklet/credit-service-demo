/* eslint-disable react/no-unstable-nested-components */
import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import {
  AccountBalance,
  Analytics,
  Close,
  GitHub,
  Login,
  MenuBook,
  PlayCircleOutline,
  SmartDisplay,
  Speed,
  Star,
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  Fab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useState } from 'react';

import CreditBalance from '../../components/credit-balance';
import VideoPlayer from '../../components/video-player';
import { BalanceProvider } from '../../contexts/balance-context';
import { useSessionContext } from '../../libs/session';
import './index.css';

function Home() {
  const theme = useTheme();
  const { session } = useSessionContext();
  const { t } = useLocaleContext();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [infoDrawerOpen, setInfoDrawerOpen] = useState(false);

  const isLoggedIn = session?.user;

  // 核心功能特性
  const features = [
    {
      icon: <AccountBalance />,
      title: t('home.features.smartBilling.title'),
      description: t('home.features.smartBilling.description'),
      color: theme.palette.primary.main,
    },
    {
      icon: <Star />,
      title: t('home.features.newUserGift.title'),
      description: t('home.features.newUserGift.description'),
      color: theme.palette.warning.main,
    },
    {
      icon: <Speed />,
      title: t('home.features.minuteBilling.title'),
      description: t('home.features.minuteBilling.description'),
      color: theme.palette.secondary.main,
    },
    {
      icon: <Analytics />,
      title: t('home.features.dataTracking.title'),
      description: t('home.features.dataTracking.description'),
      color: theme.palette.success.main,
    },
  ];

  // 信息面板内容
  function InfoPanel() {
    return (
      <Stack spacing={3}>
        {/* 使用指南 - 放到第一块 */}
        <Box>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.primary,
              mb: 2,
              fontWeight: 600,
            }}>
            {t('home.guide.title')}
          </Typography>

          <List dense disablePadding>
            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Star sx={{ color: theme.palette.warning.main, fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary={t('home.guide.freeTime.title')}
                secondary={t('home.guide.freeTime.description')}
                primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                secondaryTypographyProps={{ variant: 'caption' }}
              />
            </ListItem>
            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <PlayCircleOutline sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary={t('home.guide.startWatching.title')}
                secondary={t('home.guide.startWatching.description')}
                primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                secondaryTypographyProps={{ variant: 'caption' }}
              />
            </ListItem>
            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Speed sx={{ color: theme.palette.secondary.main, fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary={t('home.guide.smartBilling.title')}
                secondary={t('home.guide.smartBilling.description')}
                primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                secondaryTypographyProps={{ variant: 'caption' }}
              />
            </ListItem>
          </List>
        </Box>

        <Divider sx={{ borderColor: theme.palette.divider }} />

        {/* 核心特性 */}
        <Box>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.primary,
              mb: 2,
              fontWeight: 600,
            }}>
            {t('home.features.title')}
          </Typography>

          <Stack spacing={2}>
            {features.map((feature) => (
              <Box key={feature.title}>
                <Box display="flex" alignItems="center" mb={0.5}>
                  <Box
                    sx={{
                      mr: 1,
                      color: feature.color,
                      minWidth: 20,
                    }}>
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: theme.palette.text.primary,
                      fontWeight: 600,
                    }}>
                    {feature.title}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    ml: 3,
                  }}>
                  {feature.description}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        <Divider sx={{ borderColor: theme.palette.divider }} />

        {/* GitHub links and project info */}
        <Box>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.primary,
              mb: 2,
              fontWeight: 600,
            }}>
            {t('home.projectInfo.title')}
          </Typography>

          <Stack spacing={2}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                {t('home.projectInfo.viewSource')}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<GitHub />}
                href="https://github.com/blocklet/credit-usaged-demo"
                target="_blank"
                sx={{ fontSize: '0.8rem' }}>
                GitHub
              </Button>
            </Box>

            <Box>
              <Typography variant="body2" color="text.primary" gutterBottom>
                {t('home.projectInfo.description')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('home.projectInfo.copyright')}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Stack>
    );
  }

  return (
    <BalanceProvider>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box
          display="flex"
          gap={4}
          sx={{
            flexDirection: { xs: 'column', md: 'row' },
          }}>
          {/* 主内容区域 - 居中显示 */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              maxWidth: 800,
              mx: 'auto',
            }}>
            <Stack spacing={4}>
              {/* 页面头部 */}
              <Box textAlign="center">
                <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 32, height: 32 }}>
                    <SmartDisplay />
                  </Avatar>
                  <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                    }}>
                    {t('home.title')}
                  </Typography>
                </Box>
                <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary }}>
                  {t('home.subtitle')}
                </Typography>
              </Box>

              {/* 用户状态 - 更柔和的样式 */}
              {isLoggedIn ? (
                <Alert
                  severity="success"
                  variant="outlined"
                  sx={{
                    backgroundColor: `${theme.palette.success.light}20`,
                    borderColor: `${theme.palette.success.main}40`,
                  }}>
                  <Typography variant="body2">
                    {t('home.welcome.loggedIn', { name: session.user.fullName || session.user.did })}
                  </Typography>
                </Alert>
              ) : (
                <Alert
                  severity="info"
                  variant="outlined"
                  sx={{
                    backgroundColor: `${theme.palette.info.light}20`,
                    borderColor: `${theme.palette.info.main}40`,
                  }}
                  action={
                    <Button
                      color="inherit"
                      size="small"
                      variant="outlined"
                      startIcon={<Login />}
                      onClick={() => session.login()}
                      sx={{
                        borderColor: 'currentColor',
                        '&:hover': {
                          borderColor: 'currentColor',
                          backgroundColor: 'rgba(33, 150, 243, 0.1)',
                        },
                      }}>
                      {t('layout.user.loginNow')}
                    </Button>
                  }>
                  <Typography variant="body2">{t('home.welcome.guest')}</Typography>
                </Alert>
              )}

              {/* 余额管理区域 - 去掉Card包裹 */}
              <CreditBalance showWelcomeBonus />

              <Divider sx={{ borderColor: theme.palette.divider }} />

              {/* 视频播放器区域 - 去掉Card包裹 */}
              <Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <PlayCircleOutline
                    sx={{
                      mr: 1.5,
                      color: theme.palette.primary.main,
                    }}
                  />
                  <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                    {t('home.player.title')}
                  </Typography>
                </Box>
                <VideoPlayer />
              </Box>

              {/* 底部信息 */}
              <Box textAlign="center" sx={{ pt: 2 }}>
                <Typography variant="caption" sx={{ color: theme.palette.text.disabled }}>
                  {t('home.footer')}
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* 信息面板区域 - 桌面端固定宽度，移动端不显示 */}
          {!isMobile && (
            <Box sx={{ width: 280, flexShrink: 0 }}>
              <Box sx={{ position: 'sticky', top: 24 }}>
                <Paper
                  elevation={0}
                  variant="outlined"
                  sx={{
                    p: 3,
                    backgroundColor: theme.palette.background.default,
                    borderColor: theme.palette.divider,
                  }}>
                  <InfoPanel />
                </Paper>
              </Box>
            </Box>
          )}
        </Box>

        {/* 移动端信息抽屉 */}
        {isMobile && (
          <>
            <Fab
              color="primary"
              size="medium"
              sx={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                zIndex: 1000,
              }}
              onClick={() => setInfoDrawerOpen(true)}>
              <MenuBook />
            </Fab>

            <Drawer
              anchor="bottom"
              open={infoDrawerOpen}
              onClose={() => setInfoDrawerOpen(false)}
              PaperProps={{
                sx: {
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  maxHeight: '75vh',
                },
              }}>
              <Box sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {t('home.mobileInfo')}
                  </Typography>
                  <Fab
                    size="small"
                    onClick={() => setInfoDrawerOpen(false)}
                    sx={{ backgroundColor: theme.palette.grey[100] }}>
                    <Close />
                  </Fab>
                </Box>
                <InfoPanel />
              </Box>
            </Drawer>
          </>
        )}
      </Container>
    </BalanceProvider>
  );
}

export default Home;
