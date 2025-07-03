import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import { AccountBalanceWallet, AddOutlined, GifOutlined, Refresh, ShoppingCart, Star } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import { useBalance } from '../contexts/balance-context';

// eslint-disable-next-line react/prop-types
function CreditBalance({ showWelcomeBonus = true }) {
  const { t } = useLocaleContext();
  const [grantingBonus, setGrantingBonus] = useState(false);
  const [creatingCheckout, setCreatingCheckout] = useState(false);

  // 从 BalanceContext 获取所有余额相关状态和方法
  const {
    balance,
    loading,
    error,
    isNewUser,
    availableMinutes,
    refreshBalance,
    grantWelcomeBonus: grantBonusFromContext,
    createCheckout,
    formatBalance: formatBalanceFromContext,
    getBalanceColor: getBalanceColorFromContext,
    setError,
  } = useBalance();

  // 为新用户创建试听奖励（使用 Context 方法）
  const handleGrantWelcomeBonus = async () => {
    try {
      setGrantingBonus(true);
      const result = await grantBonusFromContext();

      if (!result.success) {
        setError(result.error || t('creditBalance.errors.grantBonusFailed'));
      }
    } catch (err) {
      console.error('创建试听奖励失败:', err);
      setError(t('creditBalance.errors.grantBonusError'));
    } finally {
      setGrantingBonus(false);
    }
  };

  // 处理充值订单创建
  const handleCreateCheckout = async () => {
    try {
      setCreatingCheckout(true);
      const result = await createCheckout();

      if (!result.success) {
        setError(result.error || t('creditBalance.errors.createCheckoutFailed'));
      }
    } catch (err) {
      console.error('创建充值订单失败:', err);
      setError(t('creditBalance.errors.createCheckoutError'));
    } finally {
      setCreatingCheckout(false);
    }
  };

  if (loading) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="center" py={2}>
            <CircularProgress size={24} />
            <Typography variant="body2" sx={{ ml: 1 }}>
              {t('creditBalance.loading')}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Stack spacing={2}>
          {/* 错误信息 */}
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* 新用户优先：免费领取区域 */}
          {isNewUser && showWelcomeBonus ? (
            <Box>
              {/* 醒目的新用户欢迎 */}
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)',
                  borderRadius: 2,
                  p: 3,
                  mb: 2,
                  color: 'white',
                  textAlign: 'center',
                }}>
                <Star sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {t('creditBalance.newUser.welcomeTitle')}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                  {t('creditBalance.newUser.welcomeDescription')}
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleGrantWelcomeBonus}
                  disabled={grantingBonus}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: 3,
                    px: 4,
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.3)',
                    },
                  }}>
                  {grantingBonus ? (
                    <>
                      <CircularProgress size={16} sx={{ mr: 1, color: 'white' }} />
                      {t('creditBalance.newUser.claiming')}
                    </>
                  ) : (
                    <>
                      <GifOutlined sx={{ mr: 1 }} />
                      {t('creditBalance.newUser.claimButton')}
                    </>
                  )}
                </Button>
              </Box>

              {/* 新用户的余额显示（弱化） */}
              {balance && (
                <Box
                  sx={{
                    bgcolor: 'grey.50',
                    borderRadius: 1,
                    p: 2,
                    opacity: 0.7,
                  }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                    <Typography variant="caption" color="text.secondary">
                      {t('creditBalance.currentAvailableTime')}
                    </Typography>
                    <Button
                      variant="text"
                      size="small"
                      startIcon={<Refresh />}
                      onClick={refreshBalance}
                      disabled={loading}
                      sx={{ fontSize: '0.7rem' }}>
                      {t('creditBalance.refresh')}
                    </Button>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {formatBalanceFromContext(balance)}
                  </Typography>
                </Box>
              )}
            </Box>
          ) : (
            /* 老用户：正常的余额显示 */
            <Box>
              {/* 简化的标题 */}
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box display="flex" alignItems="center">
                  <AccountBalanceWallet sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" component="h2">
                    {t('creditBalance.title')}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={refreshBalance}
                    disabled={loading}
                    sx={{ color: 'primary.main', ml: 1 }}>
                    <Refresh />
                  </IconButton>
                </Box>
                <Button
                  variant="text"
                  size="medium"
                  startIcon={<AddOutlined />}
                  onClick={handleCreateCheckout}
                  disabled={creatingCheckout}>
                  {t('creditBalance.topup')}
                </Button>
              </Box>

              {/* 余额显示 */}
              {balance && (
                <Box>
                  <Box display="flex" alignItems="center" mb={2} justifyContent="space-between">
                    <Box display="flex" alignItems="center">
                      <Chip
                        label={formatBalanceFromContext(balance)}
                        color={getBalanceColorFromContext()}
                        size="large"
                        sx={{
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                          px: 2,
                          py: 1,
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              )}

              {/* 余额不足提示 */}
              {balance && availableMinutes === 0 && (
                <Alert
                  severity="warning"
                  action={
                    <Button
                      color="inherit"
                      size="small"
                      startIcon={<ShoppingCart />}
                      onClick={handleCreateCheckout}
                      disabled={creatingCheckout}>
                      {creatingCheckout ? t('creditBalance.redirecting') : t('creditBalance.topupNow')}
                    </Button>
                  }>
                  <Typography variant="body2">{t('creditBalance.insufficientBalance')}</Typography>
                </Alert>
              )}

              {/* 余额较低提示 */}
              {balance && availableMinutes > 0 && availableMinutes < 1 && (
                <Alert
                  severity="info"
                  action={
                    <Button
                      color="inherit"
                      size="small"
                      startIcon={<ShoppingCart />}
                      onClick={handleCreateCheckout}
                      disabled={creatingCheckout}>
                      {creatingCheckout ? t('creditBalance.redirecting') : t('creditBalance.topup')}
                    </Button>
                  }>
                  <Typography variant="body2">{t('creditBalance.lowBalance')}</Typography>
                </Alert>
              )}
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default CreditBalance;
