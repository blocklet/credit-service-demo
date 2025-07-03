import { flatten } from 'flat';

export default flatten({
  name: 'Name',
  avatar: 'Avatar',
  did: 'DID',
  email: 'Email',
  role: 'Role',
  lastLogin: 'Last Login',
  createdAt: 'Created At',
  passports: 'Passports',
  profile: 'Profile',

  // Home page translations
  home: {
    title: 'Video Streaming Platform',
    subtitle: 'Credit-based Watch Time Management',
    welcome: {
      loggedIn: 'Welcome back, {name}!',
      guest: 'Please log in to access full features. Currently in guest mode.',
    },
    balance: {
      title: 'Watch Time Balance',
      refresh: 'Refresh',
    },
    player: {
      title: 'Video Player',
    },
    features: {
      title: '💡 Core Features',
      smartBilling: {
        title: 'Smart Billing Management',
        description: 'Real-time watch time balance display with precise playback control',
      },
      newUserGift: {
        title: 'New User Gift',
        description: 'New users get 3 minutes of free watch time',
      },
      minuteBilling: {
        title: 'Per-minute Billing',
        description: 'Unified settlement when playback ends, rounded up by minute',
      },
      dataTracking: {
        title: 'Data Tracking',
        description: 'Automatically record playback data for accurate billing',
      },
    },
    guide: {
      title: '📖 User Guide',
      freeTime: {
        title: 'Get Free Time',
        description: 'New users can claim 3 minutes of free watch time',
      },
      startWatching: {
        title: 'Start Watching',
        description: 'Select video to play, system automatically manages time',
      },
      smartBilling: {
        title: 'Smart Billing',
        description: 'Billing based on actual watch time when playback ends',
      },
    },
    tech: {
      title: '🔧 Technical Architecture',
      balanceSystem: {
        title: 'Balance System',
        description: 'Blockchain-based credit balance management',
      },
      billingEngine: {
        title: 'Billing Engine',
        description: 'Precise playback time billing statistics',
      },
      antiFraud: {
        title: 'Anti-fraud Mechanism',
        description: 'Auto settlement when page leaves to prevent evasion',
      },
      realTimeSync: {
        title: 'Real-time Sync',
        description: 'Real-time sync of playback status and balance',
      },
    },
    techStack: {
      title: 'Tech Stack',
      creditSystem: 'Credit System',
      meterEngine: 'Meter Engine',
      reactMui: 'React + MUI',
      blocklet: 'Blocklet',
    },
    footer: 'Blockchain-based Smart Video Service Platform • Powered by Blocklet',
    mobileInfo: 'App Info',
    projectInfo: {
      title: '🔗 Project Info',
      viewSource: 'View Source Code',
      description: 'Credit-based Smart Video Service Platform',
      copyright: '© 2025 Powered by Blocklet',
    },
  },

  // Credit Balance component
  creditBalance: {
    title: 'Watch Time Balance',
    refresh: 'Refresh',
    loading: 'Loading balance information...',
    availableTime: 'Available watch time:',
    currentAvailableTime: 'Current available time',
    topup: 'Top up',
    topupInProgress: 'Processing...',
    topupNow: 'Top up now',
    redirecting: 'Redirecting...',
    currencyType: 'Currency type',

    // 新用户欢迎区域
    newUser: {
      welcomeTitle: '🎉 Welcome New User!',
      welcomeDescription: 'Get 3 minutes of free watch time on your first login',
      claimButton: 'Claim Free Time Now',
      claiming: 'Claiming...',
      claim: 'Claim trial',
      welcome: 'Welcome new user! Click to claim 3 minutes of free trial time',
    },

    // 提示信息
    insufficientBalance: 'Insufficient watch time, please top up to continue watching',
    lowBalance: 'Low watch time remaining, consider topping up',

    // 错误信息
    errors: {
      grantBonusFailed: 'Failed to create trial reward',
      grantBonusError: 'Error occurred while creating trial reward',
      createCheckoutFailed: 'Failed to create top-up order',
      createCheckoutError: 'Error occurred while creating top-up order',
    },
  },

  // Video Player component
  videoPlayer: {
    title: '🎬 Video Player',
    selectVideo: 'Select Video',
    demoVideo: 'Demo Video',
    duration: 'Duration',
    size: 'Size',
    current: 'Current',
    statusLabel: 'Status',
    retry: 'Retry',
    limitReached:
      'Playback time has reached your available quota limit. Please top up more watch time to continue enjoying videos.',
    currentWatch: 'Current session',
    remaining: 'Remaining',
    used: 'used',
    availableTime: 'You have <strong>{minutes} minutes</strong> of watch time available',

    // 播放状态
    status: {
      playing: 'Playing',
      paused: 'Playback paused',
      stopped: 'Playback stopped',
      ready: 'Ready to play',
      cannotPlay: 'Cannot play',
      limitReached: 'Watch time limit reached',
    },

    // 播放控制说明
    controls: {
      insufficientBalance: 'Insufficient balance, cannot start playback',
      clickToPause: 'Click pause button to pause playback',
      clickToContinue: 'Click play button to continue playback',
      clickToStart: 'Click play button to start playback',
      endPlay: 'End play',
    },

    // 计费规则
    billing: {
      title: '💰 Billing Rules',
      pauseRule: '✅ <strong>Pause Playback</strong>: No billing, can continue playing',
      stopRule: '⚠️ <strong>Stop Playback</strong>: Immediate billing based on playback time',
      pageCloseRule: '🚨 <strong>Page Refresh/Close</strong>: Immediate billing when user confirms leaving',
      limitRule:
        '📏 <strong>Playback Limit</strong>: Can play complete remaining minutes (2 minutes remaining allows 120 seconds)',
      standardRule:
        '💰 <strong>Billing Standard</strong>: Any playback time is rounded up to minutes (1 second of play billed as 1 minute)',
    },

    // 播放统计
    stats: {
      title: '📊 Current Session Stats',
      watchTime: 'Watch time',
      billedTime: 'Billed time',
      minutes: 'minutes',
      remainingTime: 'Remaining playback',
      playbackStatus: 'Playback status',
      playing: '▶️ Playing',
      paused: '⏸️ Paused',
      playingWarning: '⏰ Playing: {remaining} remaining, will be billed for {billed} minutes',
      pausedInfo: '⏸️ Paused: Currently no billing, stopping playback will bill for {billed} minutes',
    },
  },

  // Layout component
  layout: {
    appTitle: 'Professional Video Player',
    appSubtitle: 'Credit System Demo',
    nav: {
      home: 'Home',
      videos: 'Videos',
      balance: 'Balance',
    },
    user: {
      login: 'Login',
      logout: 'Logout',
      profile: 'Profile',
      settings: 'Settings',
      defaultName: 'User',
      loginPrompt: 'Login to access full features',
      loginNow: 'Login now',
      loggedIn: 'Logged in',
    },
    tooltip: {
      viewSource: 'View source code',
    },
    drawer: {
      title: 'Video Player',
    },
    footer: {
      title: 'Professional Video Player Demo',
      subtitle: 'Built with @blocklet/payment-js',
      openSource: 'Open Source',
      creditSystem: 'Credit System',
      copyright: '© 2025 Blocklet',
    },
  },

  // Video tracking hook
  tracking: {
    playbackStarted: 'Video playback started',
    sessionId: 'Session ID',
    playbackPaused: 'Playback paused',
    playbackStopped: 'Playback stopped',
    playbackResumed: 'Playback resumed',
    timeLimitReached: 'Watch time limit reached',
    sessionSettled: 'Session settlement completed',
    autoSettlement: 'Auto settlement completed',
    pageUnloadBilling: 'Page leave billing',
    pageHiddenBilling: 'Page hidden billing',
    settlementSkipped: 'Session already settled, skipping report',
    success: 'Success',
    failed: 'Failed',
    playingSeconds: 'Playing {seconds} seconds',
    billingMinutes: 'Billing {minutes} minutes',
    settlementReason: {
      timeLimitReached: 'time_limit_reached',
      pageUnload: 'page_unload_confirmed',
      pageHidden: 'page_hidden',
    },
  },
});
