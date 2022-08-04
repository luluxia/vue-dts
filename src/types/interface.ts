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
  debuff: [string]
}
/** 地区状态 */
export interface AreaState {
  /** 当前地区 */
  nowArea: string,
  /** 剩余人数 */
  remain: number,
  /** 天气 */
  weather: string,
}