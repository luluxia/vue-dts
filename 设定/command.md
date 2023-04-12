# 移动
mode: command
command: move
subcmd: 
search: 搜寻
moveto: 1【坐标ID】
(empty)
(empty)
(empty)
(empty)
(empty)
(empty)
itemmix: 道具合成
itemmerge: 整理包裹
itemdrop: 道具移动
itemdrop: 道具丢弃
sp_weapon: 武器模式
rest1: 睡眠
rest2: 治疗
teammake: 组建队伍
teamjoin: 加入队伍
sp_shop: 商店
sp_skpts: 升级技能
# 搜寻
mode: command
command: search
subcmd: 
search: 搜寻
moveto: main
(empty)
(empty)
(empty)
(empty)
itemmix: 道具合成
itemmerge: 整理包裹
itemdrop: 道具移动
itemdrop: 道具丢弃
sp_weapon: 武器模式
rest1: 睡眠
rest2: 治疗
teammake: 组建队伍
teamjoin: 加入队伍
sp_skpts: 升级技能
# 拾取
mode: itemmain
command: itemget
itemget: 拾取
dropitm0: 丢弃
# 丢弃
mode: itemmain
command: dropitm3【drop物品】
submit: 确定并丢弃
# 返回/确定
mode: command
command: back
submit: 确定
# 物品整理
mode: itemmain
command: itemmove
from: 1
to: 4
submit: 提交
submit: 放弃
# 攻击
message: attack!【信息】
mode: combat
command: F【攻击方式】
w1: 释放灵力攻击
back: 逃跑

message: 
mode: revcombat
command: F

# 战斗中武器切换
message: 
mode: revcombat
command: changewep
# 逃跑
message: 【信息】
mode: combat
command: back
w1: 投掷
back: 逃跑
# 使用/装备道具
mode: command
command: itm1【道具变量名】
subcmd: 
search: 搜寻
moveto: main
(empty)
(empty)
(empty)
(empty)
(empty)
(empty)
itemmix: 道具合成
itemmerge: 整理包裹
itemdrop: 道具移动
itemdrop: 道具丢弃
sp_weapon: 武器模式
rest1: 睡眠
rest2: 治疗
teammake: 组建队伍
teamjoin: 加入队伍
sp_skpts: 升级技能
# 卸下
mode: itemmain
command: offwep
subcmd: 
search: 搜寻
moveto: main
(empty)
(empty)
(empty)
(empty)
(empty)
(empty)
itemmix: 道具合成
itemmerge: 整理包裹
itemdrop: 道具移动
itemdrop: 道具丢弃
sp_weapon: 武器模式
rest1: 睡眠
rest2: 治疗
teammake: 组建队伍
teamjoin: 加入队伍
sp_skpts: 升级技能
# 合成
mode: itemmain
command: itemmix
mitm1: 1
mitm2: 2
mitm3: 3
mitm4: 4
mitm5: 5
mitm6: 6
# 治疗足部
mode: special
command: inff
subcmd: 
search: 搜寻
moveto: main
(empty)
(empty)
(empty)
(empty)
itemmix: 道具合成
itemmerge: 整理包裹
itemdrop: 道具移动
itemdrop: 道具丢弃
sp_weapon: 武器模式
rest1: 睡眠
rest2: 治疗
teammake: 组建队伍
teamjoin: 加入队伍
sp_skpts: 升级技能
# 选择称号
mode: special
command: clubsel1【称号】
subcmd: 
search: 搜寻
moveto: main
(empty)
(empty)
(empty)
(empty)
(empty)
itemmix: 道具合成
itemmerge: 整理包裹
itemdrop: 道具移动
itemdrop: 道具丢弃
sp_weapon: 武器模式
rest1: 睡眠
rest2: 治疗
teammake: 组建队伍
teamjoin: 加入队伍
sp_skpts: 升级技能
# 选择姿态
mode: special
command: pose3【姿态】
subcmd: 
search: 搜寻
moveto: main
(empty)
(empty)
(empty)
(empty)
(empty)
itemmix: 道具合成
itemmerge: 整理包裹
itemdrop: 道具移动
itemdrop: 道具丢弃
sp_weapon: 武器模式
rest1: 睡眠
rest2: 治疗
teammake: 组建队伍
teamjoin: 加入队伍
sp_skpts: 升级技能
# 选择策略
mode: special
command: tac3【策略】
subcmd: 
search: 搜寻
moveto: main
(empty)
(empty)
(empty)
(empty)
(empty)
itemmix: 道具合成
itemmerge: 整理包裹
itemdrop: 道具移动
itemdrop: 道具丢弃
sp_weapon: 武器模式
rest1: 睡眠
rest2: 治疗
teammake: 组建队伍
teamjoin: 加入队伍
sp_skpts: 升级技能
# 选择称号
mode: special
command: clubsel1
subcmd: 
search: 搜寻
moveto: main
# 开启合成
mode: command
command: itemmain
itemcmd: itemmix
search: 搜寻
moveto: main
# 睡眠
mode: command
command: rest1
subcmd: 
search: 搜寻
moveto: main
# 组建队伍
mode: command
command: team
teamcmd: teammake
# 提交队伍
mode: team
command: teammake
nteamID: 
nteamPass: 
submit: 提交