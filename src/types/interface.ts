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
}

export interface PlayerInfo {
  /** 姓名 */
  name: string
  /** 性别 */
  sex: string
  /** 编号 */
  id: number
}

export interface PlayerState {
  /** 玩家信息 */
  playerInfo: PlayerInfo
  level: {
    /** 当前等级 */
    nowLevel: number
    /** 经验 */
    exp: number
    /** 升级经验 */
    upgradeExp: number
  }
  hp: {
    /** 当前生命 */
    nowHp: number
    /** 最大生命 */
    maxHp: number
  }
  mp: {
    /** 当前体力 */
    nowMp: number
    /** 最大体力 */
    maxMp: number
  }
}