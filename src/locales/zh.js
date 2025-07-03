import { flatten } from 'flat';

export default flatten({
  name: '姓名',
  avatar: '头像',
  did: 'DID',
  email: '邮箱',
  role: '角色',
  lastLogin: '上次登录',
  createdAt: '创建时间',
  passports: '通行证',
  profile: '个人信息',

  // Home page translations
  home: {
    title: '视频观看平台',
    subtitle: '基于 Credit 系统的观看时长管理',
    welcome: {
      loggedIn: '欢迎回来，{name}！',
      guest: '请登录以使用完整功能，当前为访客模式。',
    },
    balance: {
      title: '观看时长余额',
      refresh: '刷新',
    },
    player: {
      title: '视频播放器',
    },
    features: {
      title: '💡 核心特性',
      smartBilling: {
        title: '智能计费管理',
        description: '实时显示观看时长余额，精准控制播放权限',
      },
      newUserGift: {
        title: '新用户礼包',
        description: '新用户免费获得3分钟试看时长',
      },
      minuteBilling: {
        title: '按分钟计费',
        description: '播放结束统一结算，按分钟向上取整',
      },
      dataTracking: {
        title: '数据追踪',
        description: '自动记录播放数据，确保计费准确',
      },
    },
    guide: {
      title: '📖 使用指南',
      freeTime: {
        title: '获取免费时长',
        description: '新用户可领取3分钟免费观看时长',
      },
      startWatching: {
        title: '开始观看',
        description: '选择视频播放，系统自动管理时长',
      },
      smartBilling: {
        title: '智能计费',
        description: '播放结束时按实际观看时长计费',
      },
    },
    tech: {
      title: '🔧 技术架构',
      balanceSystem: {
        title: '余额系统',
        description: '基于区块链的信用余额管理',
      },
      billingEngine: {
        title: '计费引擎',
        description: '精确的播放时长计费统计',
      },
      antiFraud: {
        title: '防作弊机制',
        description: '页面离开时自动结算防止逃费',
      },
      realTimeSync: {
        title: '实时同步',
        description: '播放状态与余额实时同步更新',
      },
    },
    techStack: {
      title: '技术栈',
      creditSystem: 'Credit System',
      meterEngine: 'Meter Engine',
      reactMui: 'React + MUI',
      blocklet: 'Blocklet',
    },
    footer: '基于 Credit 系统的智能视频服务平台 • Powered by Blocklet',
    mobileInfo: '应用信息',
    projectInfo: {
      title: '🔗 项目信息',
      viewSource: '查看源代码',
      description: '基于 Credit 系统的智能视频服务平台',
      copyright: '© 2025 Powered by Blocklet',
    },
  },

  // Credit Balance component
  creditBalance: {
    title: '观看时长余额',
    refresh: '刷新',
    loading: '正在获取余额信息...',
    availableTime: '可用观看时长：',
    currentAvailableTime: '当前可用时长',
    topup: '充值',
    topupInProgress: '处理中...',
    topupNow: '立即充值',
    redirecting: '跳转中...',
    currencyType: '货币类型',

    // 新用户欢迎区域
    newUser: {
      welcomeTitle: '🎉 欢迎新用户！',
      welcomeDescription: '首次登录即可免费获得 3 分钟观看时长',
      claimButton: '立即领取免费时长',
      claiming: '领取中...',
      claim: '领取试看',
      welcome: '欢迎新用户！点击领取3分钟免费试看时长',
    },

    // 提示信息
    insufficientBalance: '观看时长不足，请充值后继续观看',
    lowBalance: '观看时长较少，建议提前充值',

    // 错误信息
    errors: {
      grantBonusFailed: '创建试听奖励失败',
      grantBonusError: '创建试听奖励时发生错误',
      createCheckoutFailed: '创建充值订单失败',
      createCheckoutError: '创建充值订单时发生错误',
    },
  },

  // Video Player component
  videoPlayer: {
    title: '🎬 视频播放器',
    selectVideo: '选择视频',
    demoVideo: '演示视频',
    duration: '时长',
    size: '大小',
    current: '当前',
    statusLabel: '状态',
    retry: '重试',
    limitReached: '播放时间已达到您的可用额度上限。请充值更多观看时长以继续享受视频。',
    currentWatch: '本次观看',
    remaining: '剩余',
    used: '已使用',
    availableTime: '您还有 <strong>{minutes} 分钟</strong> 的观看时长可用',

    // 播放状态
    status: {
      playing: '正在播放',
      paused: '播放已暂停',
      stopped: '播放已停止',
      ready: '准备播放',
      cannotPlay: '无法播放',
      limitReached: '播放时长已达上限',
    },

    // 播放控制说明
    controls: {
      insufficientBalance: '余额不足，无法开始播放',
      clickToPause: '点击暂停按钮暂停播放',
      clickToContinue: '点击播放按钮继续播放',
      clickToStart: '点击播放按钮开始播放',
      endPlay: '结束播放',
    },

    // 计费规则
    billing: {
      title: '💰 计费规则说明',
      pauseRule: '✅ <strong>暂停播放</strong>：不计费，可继续播放',
      stopRule: '⚠️ <strong>停止播放</strong>：立即按播放时长计费',
      pageCloseRule: '🚨 <strong>页面刷新/关闭</strong>：用户确认离开时立即计费',
      limitRule: '📏 <strong>播放限制</strong>：可播放完整的剩余分钟数（剩余2分钟可播放120秒）',
      standardRule: '💰 <strong>计费标准</strong>：播放任何时长都按分钟向上取整（播放1秒按1分钟计费）',
    },

    // 播放统计
    stats: {
      title: '📊 本次观看统计',
      watchTime: '观看时长',
      billedTime: '计费时长',
      minutes: '分钟',
      remainingTime: '剩余播放',
      playbackStatus: '播放状态',
      playing: '▶️ 播放中',
      paused: '⏸️ 已暂停',
      playingWarning: '⏰ 正在播放：还可播放 {remaining}，将按 {billed} 分钟计费',
      pausedInfo: '⏸️ 已暂停：当前不计费，停止播放将按 {billed} 分钟计费',
    },
  },

  // Layout component
  layout: {
    appTitle: '专业视频播放器',
    appSubtitle: 'Credit 系统演示',
    nav: {
      home: '首页',
      videos: '视频',
      balance: '余额',
    },
    user: {
      login: '登录',
      logout: '退出登录',
      profile: '个人资料',
      settings: '设置',
      defaultName: '用户',
      loginPrompt: '登录以获取完整功能',
      loginNow: '立即登录',
      loggedIn: '已登录',
    },
    tooltip: {
      viewSource: '查看源代码',
    },
    drawer: {
      title: '视频播放器',
    },
    footer: {
      title: '专业视频播放器 Demo',
      subtitle: '基于 @blocklet/payment-js 构建',
      openSource: '开源项目',
      creditSystem: 'Payment Kit',
      copyright: '© 2025 Blocklet',
    },
  },

  // Video tracking hook
  tracking: {
    playbackStarted: '开始播放视频',
    sessionId: '会话ID',
    playbackPaused: '暂停播放',
    playbackStopped: '停止播放',
    playbackResumed: '恢复播放',
    timeLimitReached: '播放时长已达上限',
    sessionSettled: '会话结算完成',
    autoSettlement: '自动结算完成',
    pageUnloadBilling: '页面离开计费',
    pageHiddenBilling: '页面隐藏计费',
    settlementSkipped: '会话已结算，跳过上报',
    success: '成功',
    failed: '失败',
    playingSeconds: '播放{seconds}秒',
    billingMinutes: '计费{minutes}分钟',
    settlementReason: {
      timeLimitReached: 'time_limit_reached',
      pageUnload: 'page_unload_confirmed',
      pageHidden: 'page_hidden',
    },
  },
});
