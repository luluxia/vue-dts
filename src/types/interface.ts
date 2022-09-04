/** 游戏状态 */
export interface GameState {
  /** 是否显示抽屉 */
  showDrawer?: boolean
  /** 抽屉类别 */
  drawerType?: '' |
             'find-item' |
             'find-enemy' | 'attack-enemy' | 'attacked-by-enemy' |
             'map' | 
             'crafting' |
             'sleep' | 'heal' |
             'tactics' |
             'shop'
  /** 抽屉高度 */
  drawerHeight?: number
  /** 加载状态 */
  loading?: boolean,
  /** 玩家状态 */
  playerState?: PlayerState
  /** 地区状态 */
  areaState?: AreaState
  /** 游戏日志 */
  log?: {
    /** 时间 */
    time: string,
    /** 内容 */
    content: string,
  }[],
  /** 搜寻状态 */
  searchState?: SearchState
}
/** 物品 */
export interface Item {
  /** 类型 */
  type: string,
  /** 名称 */
  name: string,
  /** 属性 */
  props: string,
  /** 品质 */
  quality: number,
  /** 耐久 */
  durability: number,
}
/** 玩家状态 */
export interface PlayerState {
  /** 玩家信息 */
  playerInfo: {
    /** 姓名 */
    name: string
    /** 性别 */
    sex: string
    /** 编号 */
    id: number
  }
  /** 等级 */
  level: {
    /** 当前等级 */
    nowLevel: number
    /** 经验 */
    exp: number
    /** 升级经验 */
    upgradeExp: number
  }
  /** 生命 */
  hp: {
    /** 当前生命 */
    nowHp: number
    /** 最大生命 */
    maxHp: number
  }
  /** 体力 */
  mp: {
    /** 当前体力 */
    nowMp: number
    /** 最大体力 */
    maxMp: number
  }
  /** 怒气 */
  rage: number
  /** 内定称号 */
  gift: string
  /** 基础姿态 */
  tactic: string
  /** 应战策略 */
  pose: string,
  /** 攻击力 */
  attack: number,
  /** 防御力 */
  defense: number,
  /** 团队 */
  team: string,
  /** 熟练度 */
  proficiency: {
    /** 殴熟 */
    melee: number,
    /** 斩熟 */
    slash: number,
    /** 射熟 */
    shoot: number,
    /** 投熟 */
    throw: number,
    /** 爆熟 */
    blast: number,
    /** 灵熟 */
    spirit: number,
  },
  /** 负面状态 */
  debuff: string[],
  /** 装备 */
  equipment: {
    /** 武器 */
    weapon: Item,
    /** 装甲 */
    armor: Item,
    /** 护臂 */
    arm: Item,
    /** 头盔 */
    helmet: Item,
    /** 靴子 */
    boot: Item,
    /** 饰品 */
    accessory: Item,
  },
  /** 背包 */
  bag: {
    [key: string]: Item | null,
    item1: Item | null,
    item2: Item | null,
    item3: Item | null,
    item4: Item | null,
    item5: Item | null,
    item6: Item | null,
  },
  /** 金钱 */
  money: number,
}
/** 地区状态 */
export interface AreaState {
  /** 当前地区 */
  nowArea: string,
  /** 通行状态 */
  passage: string,
  /** 剩余人数 */
  remain: number,
  /** 天气 */
  weather: string,
}
/** 搜寻状态 */
export interface SearchState {
  /** 发现物品 */
  findItem: Item | null,
  /** 发现敌人 */
  findEnemy: {
    /** 敌方等级 */
    level: number,
    /** 敌方姓名 */
    name: string,
    /** 敌方称号 */
    sub: string,
    /** 敌方头像 */
    avatar: string,
    /** 敌方怒气 */
    rage: number,
    /** 敌方体力 */
    mp: number,
    /** 敌方生命 */
    hp: number,
    /** 敌方攻击 */
    attack: number,
    /** 敌方武器种类 */
    weaponType: string,
    /** 敌方武器 */
    weapon: string,
    /** 敌方应战策略 */
    pose: string,
    /** 敌方基础姿态 */
    tactic: string,
    /** 敌方受伤部位 */
    hurt: string,
    /** 战斗状态 */
    battleState: string,
  } | null,
}