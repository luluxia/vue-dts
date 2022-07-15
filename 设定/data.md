## 左侧区域信息 profile
$main     游戏状态，若为battle则切换至战斗界面
### 个人信息
$nick       称号
$name       昵称
$sexinfo    性别信息
$gd         性别id
$sNo        玩家id
$wthinfo    天气信息
$weather    天气id
$gamestate  40为连斗，50为死斗
$iconImg    头像
$lvl        等级
$wp         殴熟
$wk         斩熟
$wg         射熟
$wc         投熟
$wd         爆熟
$wf         灵熟
$infinfo    受伤状态列表
$inf        受伤状态信息
$hp         血量，剩余50%警告，剩余20%进入危险状态，0以下死亡
$mhp        血量上限
$newspimg   疑似体力图
$newhpimg   疑似血量图
$exp        经验
$upexp      升级所需经验
$teamID     队伍id，当gamestate小于40时显示
$clubinfo   内定称号信息
$club       内定称号id
$clubavl    内定称号可选列表信息
$att        攻击力
$wepe       武器攻击力
$money      金钱
$def        防御力
$ardef      防具防御力
$poseinfo   基础姿态信息
$pose       基础姿态id
$sp         体力，剩余50%黄色，剩余20%灰色
$msp        体力上限
$rage       怒气，大于30为黄色
$tacinfo    应战策略信息
$tactic     应战策略id
$skillpoint 技能点
$ss         歌魂，剩余50%黄色，剩余20%红色
$mss        歌魂上限
$killnum    击杀数
### 装备
$mltwk      泛用武器
$iteminfo   物品信息
$noitm      无物品

$weps       武器相关
$wep        武器名
$nowep      空手
$wepk_words 武器类别
$wepsk_words属性
$wepe       效果
$weps       耐久

$arbs       防具相关
$arb
$noarb      内衣
$arbsk_words
$arbe
$arbs

$arhs
$arh
$arhsk_words
$arhe
$arhs

$aras
$ara
$arask_words
$arae
$aras

$arfs
$arf
$arfsk_words
$arfe
$arfs

$arts
$art
$artk_words
$artsk_words
$arte
$arts

$itmk1_words  道具用途
$itm1         名称
$itmsk1_words 属性
$itme1        效果
$itms1        耐久

## 战斗信息
$w_lvl        敌方等级
$w_name       敌方姓名
$w_sNoinfo    敌方称号
$w_iconImg    敌方头像
$w_ragestate  敌方怒气
$w_spstate    敌方体力
$w_hpstate    敌方生命
$w_wepestate  敌方攻击
$iteminfo[$w_wepk]  敌方武器种类
$w_wep        敌方武器
$tacinfo[$w_tactic] 敌方应战策略
$poseinfo[$w_pose]  敌方基础姿态
$w_infdata    敌方受伤部位
$battle_title 战斗状态[发现敌人/战斗发生]

$attinfo      攻击手段
$wepk         武器种类key

## 右侧区域信息
### 标题栏信息
$plsinfo  地区信息
$pls      当前所在地id
$alivenum 当前所在地存活人数
### 内容
$log      显示行动信息
### 行动
$hp       血量，若为0显示死亡信息death模板
$state    若为1、2、3显示rest模板
$itms0    若不为空，显示itemfind模板
$cmd      若不为空，输出$cmd
          若不符合以上条件，显示command模板

## 死亡信息
$stateinfo[$state]  死亡方式
$dinfo[$state]      详细信息
$dtime              死亡时间
$kname              杀手，非空且$state为20,21,22,23,24,28,29显示

## 休息信息
$restinfo[$state]   休息信息

## 发现物品信息
$itm0         发现的物品
$itmk0        发现物品类型
$itmk0_words  发现物品类型（具体）
$itmsk0_words 发现物品属性
$itme0        发现物品效果
$itms0        发现物品耐久

## 特殊
$command  当前触发指令
$mode     当前模式
$cmd      当前命令

## 地图相关
$arealist    禁区列表
$areanum     禁区数量
$areaadd     禁区增加数量
$hack        是否畅通禁区