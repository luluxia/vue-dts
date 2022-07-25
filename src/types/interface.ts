/** 游戏状态 */
export interface GameState {
  /** 是否显示抽屉 */
  showDrawer: boolean
  /** 抽屉类别 */
  drawerType: '' |
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
  loading?: boolean
}