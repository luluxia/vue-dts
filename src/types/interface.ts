export interface GameState {
  showHover: boolean
  hoverType: '' |
             'find-item' |
             'find-enemy' | 'attack-enemy' | 'attacked-by-enemy' |
             'map' | 
             'crafting' |
             'sleep' | 'heal' |
             'tactics' |
             'shop'
  hoverHeight?: number
  loading?: boolean
}