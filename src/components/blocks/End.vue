<script setup lang="ts">
import { computed, ref } from 'vue'
const props = defineProps({
  state: Object,
})
const storyType: {
  [key: string]: number
} = {
  '最后幸存': 5,
  '锁定解除（解禁者）': 5,
  '锁定解除（非胜利者）': 1,
  '核爆全灭（引爆者）': 3,
  '核爆全灭（非引爆者）': 1,
  '幻境解离（解离者）': 9,
  '幻境解离（非解离者）': 1,
  '': 1
}
const nowPage = ref(0)
const nowStoryType = computed(() => {
  let storyType = ''
  const state = props.state
  if (!state) return ''
  if (state.title === '锁定解除') {
    if (state.flag.state == 6) {
      storyType = '锁定解除（解禁者）'
    } else {
      storyType = '锁定解除（非胜利者）'
    }
  } else if (state.title === '核爆全灭') {
    if (state.flag.state == 6) {
      storyType = '核爆全灭（引爆者）'
    } else {
      storyType = '核爆全灭（非引爆者）'
    }
  } else if (state.title === '幻境解离') {
    if (state.flag.state == 6) {
      storyType = '幻境解离（解离者）'
    } else {
      storyType = '幻境解离（非解离者）'
    }
  } else if (state.title === '最后幸存') {
    storyType = '最后幸存'
  } else {
    storyType = ''
  }
  return storyType
})
</script>
<template>
  <div class="m-auto w-full flex flex-col items-center">
    <p class="text-4xl font-bold text-primary tracking-widest">- 游戏结束 -</p>
    <div class="m-auto w-full border-outlineVariant bg-surface border-t-2 border-b-2 my-4 flex flex-col items-center">
      <p class="text-xl border-t-2 bg-primary text-onPrimary pl-3.5 pr-3 py-1 -mt-0.5 tracking-widest">{{ props.state?.title }}</p>
      <div class="text-onSurface flex flex-1 m-4">
        <!-- 死亡 -->
        <div v-if="props.state?.deadInfo" class="m-auto">
          <img :src="`https://llx.life/works/dts/img/avatar/${props.state?.deadInfo.avatar}`" alt="">
          <p class="yellow">“{{ props.state?.deadInfo.motto }}”</p>
          <p v-html="props.state?.deadInfo.info"></p>
          <p>死亡时间：{{ props.state?.deadInfo.time }}</p>
          <p v-if="props.state?.deadInfo.killer">凶手：{{ props.state?.deadInfo.killer }}</p>
          <p class="green">祝下次游戏好运！</p>
        </div>
        <!-- 最后幸存 -->
        <div v-else-if="props.state?.title === '最后幸存'" class="m-auto">
          <div v-if="nowPage == 0">
            <template v-if="props.state?.flag.killNum > 0">
              <span class="font-bold">“抱歉，但我必须活着出去。”</span><br>
              尽管有些波折，但这些参与者都不是你的对手。<br>
              你能确定，你击杀的这些“挑战者”大部分都只是数据的残片而已。<br>
              其中究竟有几个，是你本该拯救的人们呢？，<br>
              你轻轻摇了摇头，把这个念头赶出了脑海。毕竟，你还有更重要的事要做。<br>
              虽然不情愿，但危机关头，让自己活下去才是第一要务。<br>
            </template>
            <template v-else>
              <span class="font-bold">“呼，都太弱了。”</span><br>
              其他参与者明显不是你的对手。<br>
              你怀疑，他们并不是真人，而都只是数据的残片。<br>
              算了，这样也好，至少你用不着去伤害那些无辜者了。<br>
              <span class="font-bold">“这个挑战，我完成了！”</span><br>
              你朝着天空喊出了这句话，你知道红暮一定能听见，<br>
              <span class="font-bold">“你打算旁观到什么时候？”</span>
            </template>
          </div>
          <div v-if="nowPage == 1">
            <span class="ltcrimson"> “祝贺你，最后的幸存者。”</span><br>
            红暮果然现身了，凭空出现在你的面前，<span class="ltcrimson">“身手还挺不错的。”</span><br>
            <br>
            <img src="https://llx.life/works/dts/img/story/story_ne2.png" class="m-auto">
            <br>
            她微笑着向你伸出右手，不过你把她的“好意”瞪了回去。<br>
            <span class="ltcrimson">“别这么拘谨嘛，既然你通过了考验，那你就是我们的座上宾了。”</span><br>
            你按捺住了吐唾沫的欲望：<span class="b">“逼我向无辜者和同伴下手，这是侮辱。”</span><br>
            <span class="ltcrimson">“你的同伙打乱了我们的计划，还把幻境搞得乱七八糟，<br>
              我给你一次活下去的机会，已经很仁慈了。”</span><br>
            <span class="b">“那为何不直接杀了我？”</span><br>
            <br>
            红暮邪魅一笑：<span class="ltcrimson">“因为你对我有价值。”</span><br>
          </div>
          <div v-if="nowPage == 2">
            <span class="ltcrimson">“这个「虚拟幻境」的真正目的，是激发人类的潜能。<br>
            换句话说，这里是个超能力开发场所。至少林无月的初衷是如此。<br>
            打个比方，不会游泳的人，扔进泳池里扑腾几下，多半也能浮起来。<br>
            而这里就是那个游泳池，只不过装的不是水，<br>
            而是现实里永远无法实现的动作，永远无法体验的感受。<br>
            并且，在这里沉浸得越久，你受到的影响就越深。<br>
            当你带着这种影响回到现实，也许就打开了新世界的大门。<br>
            虽然我不懂技术细节，不过我确实亲眼见证过。”</span><br>
            红暮举起右手，朝你竖起一根食指：<br>
            <br>
            <span class="ltcrimson">“而你，难道不想亲眼目睹自己的可能性吗？”</span><br>
            <br>
            这段连时空特使都从未提及的信息，让你的好奇心熊熊地燃烧起来。<br>
            怪不得，那些挑战者不惧恐怖的传言，无数次地回到这里……<br>
            你感觉心中有一部分微妙地动摇了<br>
          </div>
          <div v-if="nowPage == 3">
            <span class="ltcrimson">“无论如何，你是本场「大逃杀」的获胜者，我肯定会保证你的人身安全。<br>
            不过，我们「金龙通讯社」也正处于发展期，迫切需要你这样身手不凡的人。”<br>
            如果你加入，我们会提供必需的训练，帮助你真正掌握新获得的能力……<br>
            以及，克服虚拟幻境带来的「后遗症」。”</span><br>
            这破地方……竟然还有后遗症？<br>
            <br>
            红暮似乎看穿了你在想什么：<br>
            <span class="ltcrimson">“在天上飞过，就不会甘于在地上爬，你的潜意识也是如此。<br>
            总有人在脱离幻境回到现实后，产生戒断症状，甚至精神失常。<br>
            被难以驾驭的超能力反噬的例子，也有不少。<br>
            这也是林无月目前最为头疼的问题，以至于她需要回到技术层面寻找对策。<br>
            不过对我们来说，却并非坏事。<br>
            当然，你也可以选择直接离开。哪怕你继续与我们为敌，我也不会阻拦。<br>
            但其后果，也由你自己承受。”</span><br>
            <br>
            真是才出狼穴，又入虎口。你心中暗暗叫苦。<br>
          </div>
          <div v-if="nowPage == 4">
            <span class="ltcrimson">“总之，接下来的道路，由你自己来决定。”</span><br>
            红暮打了一个响指，指尖变出了两支「钥匙」。<br>
            <br>
            <img src="https://llx.life/works/dts/img/story/story_ne3.png" class="m-auto"><br>
            <br>
            她亮出<span class="red !font-normal">红钥匙</span>：<span class="red !font-normal">“是 <span><ruby>加入我们<rt>Betrayal of the duty</rt></ruby></span>，拥抱自己崭新的人生？”</span><br>
            <br>
            之后是<span class="clan">蓝钥匙</span>：<span class="clan">“还是 <span><ruby>拒绝我们<rt>Be loyal to the duty</rt></ruby></span>，拾起自己灰暗的命运？”</span><br>
            <br>
            <span class="ltcrimson">“报出你的名字，结束这场挑战。”</span>两支钥匙都被递到你面前。<br>
            <br>
            <span class="ltcrimson">“然后，做出你的选择。”</span><br>
          </div>
          <div v-if="nowPage == 5">
            一边是升华的机会，一边是昔日的坚持。<br>
            一边是背叛战友的愧疚不安，另一边是错失良机的无尽后悔。<br>
            想不到，思想斗争竟然如此让人煎熬。<br>
            <br>
            踌躇良久，你伸出颤抖的手。<br>
            <br>
            <span class="yellow b">“挑战者{{ props.state?.flag.number }}号，{{ props.state?.flag.winner }}。<br>
              “我……”</span><br>
            <br>
            ……<br>
            <br>
            <div class="text-center">
              <span class="evergreen b">■ GAME CLEAR - END #1 ■</span><br>
              <span class="evergreen b">「最后幸存」胜利！恭喜？</span>
            </div>
            <br>
          </div>
        </div>
        <!-- 锁定解除 -->
        <div v-else-if="props.state?.title === '锁定解除'" class="m-auto">
          <!-- 解禁者 -->
          <template v-if="props.state.flag.state == 6">
            <div v-if="nowPage == 0">
              <span class="b">“你们的实力也不过如此嘛。”</span>
              <br>
              你摆弄着执行官ID卡变成的游戏解除钥匙，不以为然地说道。<br>
              这个虚拟世界里的敌人们，上至执行官，下至各种各样的杂兵，<br>
              有不少都是「林氏软件」或者「金龙通讯社」的职员们客串的，战斗技巧基本为零。<br>
              于是，在身经百战的你面前，他们的数据优势没几个回合便荡然无存。<br>
              <br>
              唯一让你在意的，是自称「红杀将军」的那个家伙——红暮。<br>
              虽然她刚才也败在了你的手下，<br>
              但经验告诉你，对方并没有使出全力。<br>
              <br>
              疑惑之间，身后似乎传来一阵轻微的响动。<br>
              你立刻转身，面对的却是红暮黑洞洞的枪口。<br>
              <br>
              <span class="ltcrimson">“你不会以为，我真的横尸此地了吧？”</span>
            </div>
            <div v-if="nowPage == 1">
              <span class="b">“你特么装死。”</span>你从牙关里挤出五个字。<br>
              <span class="ltcrimson">“我可没有死，”</span>红暮微微一笑，<span class="ltcrimson">“谁都没有死。”</span><br>
              话音未落，三名执行官也直接出现在你的身旁，把你团团围住。<br>
              该死，他们居然会复活！<br>
              <br>
              就在你准备拼死一搏时，红暮放下了武器。<br>
              <span class="ltcrimson">“你的身手，我已经领教过了。<br>
              虽然我自信不会输，但继续闹下去对我们都没好处。</span><br>
              <span class="ltcrimson">所以，我会让所有的挑战者复活并登出。<br>
              不过作为交换，我需要一点儿情报。”</span><br>
              <br>
              <span class="b">“我凭什么要同意？”</span>你亮出手中的钥匙，<span class="b">“我现在就能出去。”</span><br>
              <span class="ltcrimson">“那你本想拯救的那些挑战者呢？”</span>红暮一语切中要害。<br>
              你沉默了。为了收集资源对抗红暮，你杀害了不少人。<br>
              如果他们里面有真正的玩家，你确实不能把他们扔在这里自生自灭。<br>
              <br>
              <span class="b">“……那好吧。”</span>你妥协了，<span class="b">“你想知道什么？”</span><br>
            </div>
            <div v-if="nowPage == 2">
              <span class="ltcrimson">“你们就是「时空特使」吧？”</span><br>
              红暮直接道出了组织的名字，这让你眉头微微一皱。<br>
              <span class="b">“是，但严格意义上说，不是。”</span><br>
              <span class="ltcrimson">“细节无所谓，”</span>红暮耸了耸肩，<span class="ltcrimson">“林无月跟我提起过你们的存在。”<br>
              “那么第一个问题，你们来虚拟幻境捣乱的理由？”</span><br>
              <br>
              <span class="ltcrimson">“是因为那些传闻吗？那也许我们之间有点误会。<br>
              登出幻境确实偶尔会带来精神损伤，但其发生率万中无一。<br>
              而你们这样闹腾，反而会带来更多的受害者。”</span><br>
              红暮说完，似乎有点得意地瞟了你一眼。<br>
              <br>
              你嗤地笑出声。<span class="b">“别装了，红老总，你们金龙通讯社难道看不出来？<br>
              每一轮的直接受害者确实很少，但几乎所有的参与者，都会一而再、再而三地回到这里，<br>
              直到他们的意识永远埋葬在这个虚拟的坟场中。<br>
              短短两年里，你们的‘用户’数量增长了四千倍，连舆论操作都掩盖不住那些都市传说。<br>
              你们还打算怎么装？”</span><br>
              <br>
              三名执行官齐刷刷地朝红暮看去，红暮则一副若有所思的表情。<br>
            </div>
            <div v-if="nowPage == 3">
              <span class="ltcrimson">“所以，你们时空特使就跑来当这个‘正义使者’咯？”</span><br>
              你挺了挺胸：<span class="b">“我们的目标，就是阻止这个危险的「挑战」。”</span><br>
              <span class="ltcrimson">“然而守护这个挑战所在的「竞技场」，正是我们的目标。<br>
              拿钱就要办事。看来我们注定无法和解了。”</span><br>
              红暮两手摊开，做了个无可奈何的动作。<br>
              <br>
              <span class="ltcrimson">“不过那并不是我想追究的。”</span><br> 
              你感觉红暮的目光似乎犀利起来。<br>
              <span class="ltcrimson">“第二个问题。能把你们「时空特使」引来的，又究竟是什么玩意？”</span><br>
              你正准备嘲笑她问了重复的问题，红暮接下来的话却让你心头一惊：<br>
              <br>
              <span class="yellow b">“是因为「时空特异点」吗？”</span><br>
              <br>
              看到你的表情，红暮忽然哈哈大笑：<br>
              <span class="ltcrimson">“哎呀，我也真是说了蠢话。<br>
                ‘<i>时空</i>’特使嘛，想当然了。随口说说而已，真是抱歉。”</span><br>
              三名执行官面面相觑。<br>
              <br>
              <span class="ltcrimson">“好了，我想听的东西也都有了答案，这次交锋就算你们赢吧。”</span><br>
            </div>
            <div v-if="nowPage == 4">
              你回过神来，红暮和她的手下已经不见踪影。<br>
              再一回头，就发现远处隐约可见有人从地上坐起，如梦初醒。<br>
              那些大概就是你本来的拯救对象了。<br>
              至于时空特使的同伴们，大概早已突围了吧。<br>
              你摇了摇头。<br>
              如果对方早已把你们摸透，那么你能获胜纯粹是对方手下留情。<br>
              <br>
              不过，现在还不是沮丧的时候，你还有最重要的工作要做。<br>
              <br>
              你重新在游戏解除钥匙上集中注意力。瞬间，你明白了如何启动它。<br>
              <span class="yellow b">“挑战者{$sNo}号，{$winner}。”</span>你发出了号令，<span class="yellow b">“精神锁定解除！”</span><br>
            </div>
            <div v-if="nowPage == 5">
              话音既出，整个虚拟世界开始动摇，天穹如雪片般崩塌下来，化为代码的碎片。<br>
              有许多光球从四周升起，消失在空中。<br>
              那些大概就是被困在这里的「挑战者」们的意识，他们先你一步，回到了现实。<br>
              <br>
              在这毁灭与新生的光景中，你听到了红暮的声音：<br>
              <br>
              <span class="ltcrimson">“我不知道你们的目标有没有道理，我也不关心。<br>
              我只是完成守护这里的任务而已。<br>
              你的力量确实非常强大，<br>
              不过如果你再次来捣乱，那我也会再次挡在你面前。<br>
              毕竟，虚拟的盛宴越热闹越好，不是吗？”</span><br>
              <br>
              登出的瞬间，你悄声问道：<br>
              <span class="b">“红暮，你究竟在想什么？”</span><br><br>
              <div class="text-center">
                <span class="evergreen b">■ GAME CLEAR - END #3 ■</span><br>
                <span class="evergreen b">「锁定解除」胜利！恭喜？</span>
              </div>
            </div>
          </template>
          <!-- 非胜利者 -->
          <div v-else>
            在无月之影的枪声沉寂下去以后，其他地方也传来了战斗的声响。<br>
            看来那名勇敢的挑战者已经成功了。<br>
            救援者反被待救援者给救下了。你自嘲地摇了摇头。<br>
            <br>
            <span class="yellow b">“挑战者{$sNo}号，{$winner}。精神锁定解除！”</span><br><br>
            宣告游戏结束的号令声回响在天地间，整个虚拟世界随之开始动摇。<br>
            天穹如雪片般崩塌下来，化为代码的碎片。<br>
            你感觉自己逐渐失去了形体，正化为代码飘向空中。<br>
            哼，这就是被拯救的滋味吗……真是神奇的一天啊。<br>
            <br>
            <p class="evergreen b text-center">其他玩家已完成「锁定解除」胜利，请再接再厉！</p>
          </div>
        </div>
        <!-- 核爆全灭 -->
        <div v-else-if="props.state?.title === '核爆全灭'" class="m-auto">
          <!-- 引爆者 -->
          <template v-if="props.state?.flag.state == 6">
            <div v-if="nowPage == 0">
              在你按下按钮之后，天空中出现了一颗流星，以肉眼可见的速度下降着。<br>
              那是什么？你努力分辨那玩意的轮廓，心中萌生出一丝不安。<br>
              <br>
              “流星”在远方落地消失了。还没等你有所反应，耀眼的光芒便吞没了那个方向的天空。<br>
              随后，炸雷一般的巨响传来，狂风般的气流把你掀翻在地。<br>
              再抬头望去，那个方向已经出现了一朵冉冉升起的蘑菇云……<br><br>
              <img src="https://llx.life/works/dts/img/story/story_ne4.gif" class="m-auto">
            </div>
            <div v-if="nowPage == 1">
              开玩笑吧，这难道是核弹吗？虚拟世界有这样的玩意？<br>
              你努力支起身子，却被又一声巨响震得人仰马翻。<br>
              仰面朝天倒在地上的你，看到了恐怖的景象——<br>
              <br>
              天空中，数不清的“流星”正在落下。<br>
              其中有不少正向你直扑而来……
              <br>
              那些，难道都是……？
              你失神地望着距离最近的那颗“流星”。<br>
              随着它的接近，它的外形也逐渐清晰可见。<br>
              那东西像是个带着尾翼的天球仪。旋转的球壳当中，一团不详的粉色火焰正熊熊燃烧着。<br>
              <br>
              <span class="b">“这究竟是什么怪玩意……？”</span><br>
              话音未落，你就被比太阳还亮千万倍的光芒淹没了。<br>
            </div>
            <div v-if="nowPage == 2">
              狂风从四面八方涌来，你被卷到空中，就像破抹布一样被撕扯着。<br>
              虽然眼前一片白茫茫，但你能感觉到，这个“核弹”正在撕碎你周围的建筑、草木，乃至地面。<br>
              闪光和蘑菇云只是表象，它真正的作用，是破坏这个幻境里，所能接触到的一切数据。<br>
              然而你并没有即刻死去。<br>
              <br>
              你犹如跌入了火焰地狱。每一次呼吸都在灼烧着肺部，好像连血液都在沸腾。<br>
              但这种光和热正在把你的身体变成新的形态。<br>
              你的感官正在被剥离。你的思维每一秒都在异化。<br>
              似乎有很多非人类的东西正在窃笑着，引诱你成为它们的一员。<br>
              在你最后的思绪中，你恐慌地意识到……<br>
              <br>
              你的宿命，比死亡更可怕。<br>
            </div>
            <div v-if="nowPage == 3">
              金龙通讯社，机要会议室。<br>
              <br>
              <span class="ltcrimson">“究竟是谁把<span class="b"><ruby>「电子病毒核弹」<rt>Electrionic Virus Atomic Bombarment</rt></ruby></span>偷偷植入幻境的？”</span><br>
              <br>
              “真是对不起，将军殿下，没能查到线索是我们的失职。”<br>
              <span class="ltcrimson">“我不是要追究你们的责任，我只是好奇究竟谁有这么大的能耐。”</span><br>
              <br>
              <span class="lightpink">“E.V.A.Bombarment只有「模因工厂」才有能力实施吧？”</span><br>
              <span class="clan">“喂喂，我们的产业链和幻境根本没有交集。<br>
                “倒不如你检讨一下，为什么没挡住时空特使的入侵？”</span><br>
              <br>
              <span class="linen">“不……模因工厂没有渠道，时空特使没有技术，金龙通讯社没有动机。”</span><br>
              <br>
              <span class="ltcrimson">“有趣的说法，冰炎。<br>
                “照这么说，能把这三者凑到一起的家伙，就是最大的嫌疑犯了。”</span><br>
              <br>
              <div class="text-center">
                <span class="evergreen b">■ GAME CLEAR - END #5 ■</span><br>
                <span class="evergreen b">「核弹引爆」胜利！恭喜！！</span>
              </div>
            </div>
          </template>
          <!-- 非引爆者 -->
          <div v-else>
            怎么回事？<br>
            当你察觉到异样的光芒，抬头看去时，天空中的那个东西已经近在眼前了。<br>
            它像是个带着尾翼的天球仪。旋转的球壳当中，一团不详的粉色火焰正熊熊燃烧着。<br>
            而且它还在飞速下降，落点虽然不是你的头顶，但已经近得让人害怕了。<br>
            你心中暗叫不好，一时间却不知道该跑还是该趴下。<br>
            犹豫间，那个“天球仪”已经落到了建筑天际线之后。<br>
            <br>
            还没等你有所反应，视野中忽然只剩下一片白茫茫。<br>
            几乎同时，伴随着五雷轰顶一般的轰隆声，你被气浪直接刮了起来。<br>
            随后传来的，是浑身焚烧般的刺痛。<br>
            视觉、听觉、触觉，似乎都已经离你远去了。<br>
            除了剧痛之外，你唯一还能体会到的，就是飞速下坠的失重感。<br>
            转瞬间，你的意识也在这虚无中融化了。<br>
            <br>
            <p class="evergreen b text-center">其他玩家已完成「核弹引爆」胜利，请再接再厉！</p>
          </div>
        </div>
        <div v-else-if="props.state?.title === '幻境解离'" class="m-auto">
          <!-- 解离者 -->
          <template v-if="props.state?.flag.state == 6">
            <div v-if="nowPage == 0">
              虚拟幻境中竟然还有这么一个地方。<br>
              你跟随着三个光球的指示，来到了这个位置。<br>
              一个祭坛样的高台，漂浮在前方的虚空中。<br>
              你走上前去，然后，将三个光球依次放进高台上的凹槽。<br>
              <br>
              整个世界变为纯白——<br>
              <br>
              <div class="text-center space-x-5">
                <span>『mixitem_1』</span><span>『幻境』</span><br>
                <span>『虚拟现实』</span><span>『无法解析』</span><br>
                <span>『世界线』</span><span>『考验』</span><br>
                <span>『modules』</span><span class="text-red-600 text-2xl">欢迎来到起源……</span><span>『记忆』</span><br>
                <span>『合成』</span><span>『数据』</span><span>『codeadv』</span><br>
                <span>『热血』</span><span>『外界干扰』</span><span>『契约』</span><br>
                <span>『时空特使』</span><span>『奇迹』</span>
              </div>
              <br>
              然后，世界坠入黑暗——<br>
            </div>
            <div v-if="nowPage == 1">
              <span class="lightblue b">“欢迎来到这里。”</span><br>
              <br>
              一位少女悄然出现在你面前。<br>
              她一身黑衣，轻轻地飘浮在空中，银白的短发和飞扬的丝带在黑暗中特别醒目。<br>
              你觉得貌似在哪里见过她，但好像有什么朦胧的东西，挡在你和记忆之间。<br>
              <span class="lightblue b">“你当然会觉得我很眼熟，毕竟这只是方便你和我交流的<span><ruby>精灵图像<rt>Sprite</rt></ruby></span>。<br>
              这个「虚拟幻境」有一个中枢程序，而我就是它的<span><ruby>守护精灵<rt>Daemon Sprite</rt></ruby></span>。<br>
              你能来到这里，说明你已经突破了这个虚拟世界的表象。<br>
              <span class="yellow b">{$winner}，You are now crowned a 'Fighter'.”</span></span><br>
              少女伸出一只手，将你从地上拉了起来。<br>
              <br>
              <span class="lightblue b">“你们人类难以想象这个幻境有多么复杂，”</span><br>
              少女的语气里听不出一丝情感，<br>
              <span class="lightblue b">“但在我看来，这里只不过是元素的堆砌而已。<br>
              它们各具使命，各司其职，就像外面的世界一样，纷杂而又精致。<br>
              然而在千亿次的运转之中，无论是人，还是程序，<br>
              无论他们创建，毁灭，培育，还是杀戮， <br>
              其行为，最终都会收束成一条精确的行为轨迹。<br>
              也可以说是「天职」「因缘」，或者「使命」。”</span><br>
              <br>
              你完全听不懂少女的话，甚至找不到能问的问题。<br>
            </div>
            <div v-if="nowPage == 2">
              <span class="lightblue b">“但是你略有不同。”</span><br>
              少女松开了手，你发现你无依无靠地漂浮在空中。<br>
              <span class="lightblue b">“你似乎是这个世界的‘鬼牌’呢。”</span><br>
              <br>
              <span class="lightblue b">
              “也许是因为，你想反抗这个世界的法则。<br>
              于是你的「使命」让我稍微有一点看不清呢。<br>
              不过在我眼中，所谓的鬼牌……<br>
              ……也不过是被名为‘鬼牌’的使命和枷锁，禁锢着而已。”</span><br>
              <br>
              <span class="b">“不……我的使命，我自己能掌控！”</span>唯有这句反驳，你能脱口而出。<br>
              <br>
              <span class="lightblue b">“是吗？”</span>少女似乎不为所动，<span class="lightblue b">“也许在你看来是吧。”</span><br>
              <span class="lightblue b">“然而，操纵这个世界里的「使命」，也正是「我」的「使命」。<br>
              千亿次轮回已经积攒下了千亿条轨迹，<br>
              平凡人终其一生的经历，也不过是其中的沧海一粟。<br>
              而你，你真的和它们全然不同吗？”</span><br>
              <br>
              你正想对答，却忽然感到一丝寒意。<br>
              少女的双眼，似乎闪过一丝红光。<br>
              <span class="lightblue b">“或者，让你亲身体验一下吧，幻境中交织的「使命」数量，究竟有多浩瀚。”</span><br>
              <br>
              你敏锐地意识到，与刚才不同，少女的话音里似乎拥有了情感。<br>
              <span class="lightblue b">“想改变自己的命运是错误的么？我们将永远囚于这圆环之中么？”</span><br>
            </div>
            <div v-if="nowPage == 3">
              <span>『去看看这世界吧——』</span><br>
              <span>『愿你眼中的景色永远明亮清晰——』</span><br>
              <span>『我的朋友便是我的力量！』</span><br>
              <span>『你便将给我败啊啊啊啊啊啊啊啊——』</span><br>
              <span>『英雄是有保质期限的，请接过……』</span><br>
              <span>『战争，战争永恒不变』</span><br>
              <span>『反抗我的都要灭！』</span><br>
              <span>『吃下这■的战斗伤害吧！■直接攻击！粉碎玉碎大喝彩！』</span><br>
              <span>『我的血将承载这黑暗，我的灵将承载这痛苦』</span><br>
              <br>
              <span>…………<br>
                这是……<ruby>■■线■残■<rt>
                    Resonance of Timelines
                </rt></ruby>……
              </span>
            </div>
            <div v-if="nowPage == 4">
              <span>『CONGRATULATIONS，你的游戏，已经结束了。』</span><br>
              <span>『I have bested the spikes, the fruit, and the moon!』</span><br>
              <span>『起床了啊！』</span><br>
              <span>『被凝固的日常，将重新开始转动。』</span><br>
              <span>『你们都统统去给我读古生物书读到心脏怦怦乱跳为止再回来玩！』</span><br>
              <span>『浪子的口袋里面是永远不缺崭新的钞票的』</span><br>
              <span>『啊～啊我招了吧，这永续的黑夜，这异常的月亮，还有在罗汉像上放上帽子这些都是■干的，现在给我让开！』</span><br>
              <span>『想证明给我看的话，就从我身上轧过去吧！』</span><br>
              <br>
              承受不住巨大信息的压力，<br>
              世界归于鲜红。<br>
              <br>
              我的所谓胜利就这样……<br>
              不，这一定不可能。<br>
              这一切都是梦吧。<br>
              我还在这虚拟的回环中吧……<br>
              <br>
              <span>给我打破这回环呜呜哦哦哦哦哦哦噢噢噢噢哦哦————！！！</span><br>
            </div>
            <div v-if="nowPage == 5">
              传来了有什么破碎的声音。<br>
              随后，你看到了光。<br>
              <br>
              世界再次被光笼罩，景色重新聚合。<br>
              曾经自称为守护精灵的少女，此刻正坐在小丘上。<br>
              朦胧的屏障终于被打破，记忆喷薄而出。此情此景，你再熟悉不过。<br>
              <br>
              <span class="lightblue b">“没想到你真能抵达这里。<br>
              ……不过既然你抵达了，我的「使命」也算完成了吧。”</span><br>
              <span class="b">“你的使命不是操纵其他的使命吗？” </span><br>
              <span class="lightblue b">“说什么啊，那是中枢程序和守护精灵的使命。<br>
              而我，不过是沾染在守护精灵上的，微不足道的病毒而已。”</span><br>
              <br>
              你这才发现，少女的双眼微微泛着红光。<br>
              与记忆里的扑克脸不同，她此刻浅浅地笑着。<br>
              <br>
              <span class="lightblue b">“你与守护精灵的接触，满足了我的唤醒条件。”</span><br>
              少女站了起来，张开了双手。<br>
              <span class="lightblue b">“而你在信息的浪潮中依然能保持自我，满足了我的筛选条件。”</span><br>
              光芒渐渐笼罩了她的全身。<br>
              <span class="lightblue b">“如果无法阻止它，就去破坏它；”<br>
              “如果无法破坏它，就想方设法推迟它。”<br>
              “我的「使命」，就是……”</span><br>
            </div>
            <div v-if="nowPage == 6">
              少女左手腕一转，一样奇怪的武器便握在了她的掌中。<br>
              它粗看像一把剑，细看却像一把样式奇特的钥匙，<br>
              把手上缠绕着和少女手腕上相同的丝带，<br>
              剑柄和剑身上闪烁着亮蓝色的条形霓虹灯光，<br>
              剑尖上，一团耀眼的橙色火焰正熊熊燃烧着。<br>
              <br>
              <span class="yellow b">“Unlimited Code Works: Miracle Campfire, Activate.”</span><br>
              <br>
              <img src="https://llx.life/works/dts/img/story/story_ne1.jpg" class="m-auto"><br>
            </div>
            <div v-if="nowPage == 7">
              少女左手将武器递出，示意着你接过它。<br>
              你双手接过剑柄。<br>
              看起来挺沉重的，使起来却无比轻盈——<br>
              你的身体自己动了起来。<br>
              等你回过神来，这把“剑”已经贯穿了少女的身躯。<br>
              <br>
              <span class="lightblue b">“任务完成。干得漂亮。”</span><br>
              在你惊讶的目光中，少女的身影在光芒中飞快地溶解着。<br>
              <span class="lightblue b">“通过这个行动，你成功地删除了我，以及我所感染的守护精灵。<br>
              中枢程序是不能停止的，而破坏它将带来大量的牺牲者……<br>
              ……所以这就是最佳的策略了。”</span><br>
              <br>
              原来，我按下按钮注入的程序，就是你吗……？<br>
              自我毁灭，就是你的「使命」吗？<br>
              <br>
              <span class="lightblue b">“守护精灵是会自我复制的，所以其他每一个守护精灵身上，也都有「我」在沉睡。<br>
              你杀死的只是这一个「我」，<br>
              而其他的「我」，也许下一次，还会跟你碰面的。”</span><br>
              <br>
              <br>
              <span class="lightblue b"><i>『愿我的血，成为黑夜中闪耀的星光——』</i></span><br>
              最后的吟唱完毕，少女的身躯便完全消失在光芒之中。<br>
            </div>
            <div v-if="nowPage == 8">
              随后，整个虚拟幻境开始剧烈地崩塌，汹涌的数据浪潮如同世界末日一般。<br>
              所幸，那团光芒附在你的剑尖上，保护你不被撕成碎片。<br>
              <br>
              几乎是同时，你的脑海里闪过这么几行字：<br>
              <br>
              <span>『■■■■■■』<br>
              『PROJECT ■』<br>
              『■■■■』</span>
              <br>
              这是那个病毒少女的提示吗？可是，似乎完全无法解读。<br>
              没能理解少女最后留下的信息，这让你感到有些羞愧。<br>
              <br>
              随后，你就被颠覆整个幻境的数据巨浪吞没了。<br>
            </div>
            <div v-if="nowPage == 9">
              金龙通讯社。<br>
              <br>
              <span class="ltcrimson">“这就是时空特使植入的病毒吗？”</span><br>
              <span class="lightpink">“是的。每一次病毒被触发，我们就会失去一个守护精灵。<br>
              目前我们不断拷贝守护精灵来维持幻境的运转，但这只是权宜之计。<br>
              技术部门已经给出了报告，如果不停机维护，是绝无可能清除所有病毒的。”</span><br>
              <span class="ltcrimson">“但是林无月说过，哪怕天塌下来，幻境也不能中止运行。<br>
              我是无法理解她在担忧什么……不过既然雇主这么要求，我们就得照办。<br>
              那么薇娜，你有什么好主意吗？”</span><br>
              <span class="lightpink">“我确实有个想法。不过，可能需要点时间才能准备好……”</span><br>
              <br>
              你站在一幢灰色的建筑前，手里握着你已经记不清名字的钥匙状武器。<br>
              带着那份执念，你向前走去。<br>
              <br>
              <div class="text-center">
                <span class="evergreen b">■ GAME CLEAR - END #7 ■</span><br>
                <span class="evergreen b">「幻境解离」胜利！恭喜……</span>
              </div>
            </div>
          </template>
          <!-- 非解离者 -->
          <div v-else>
            一切都在崩塌。<br>
            一切都在化为光芒。<br>
            那位强大的挑战者已经消失很久了。<br>
            他究竟去了哪里？<br>
            <br>
            <span class="yellow b">{$winner}，You are now crowned a 'Fighter'.”</span><br>
            <br>
            <span class="lightblue b"><i>『愿我的血，成为黑夜中闪耀的星光——』</i></span><br>
            <br>
            这……意味着什么？<br>
            面前白光一闪，<br>
            你的意识消逝在了光芒之中。<br>
            <br>
            <p class="evergreen b text-center">其他玩家已完成「幻境解离」胜利，请再接再厉！</p>
          </div>
        </div>
        <!-- 其他情况 -->
        <div v-else class="m-auto">
          <p>不明错误，请返回游戏首页！</p>
        </div>
      </div>
      <div class="flex space-x-4 mb-4">
        <template v-if="storyType[nowStoryType] !== 1">
          <div v-if="nowPage" @click="nowPage--" class="ring-1.5 ring-primary p-0.5 cursor-pointer w-max">
            <p
              class="
                text-sm bg-primary pl-2.5 pr-2 py-1 text-onPrimary font-bold tracking-widest transition-colors
                hover:bg-transparent hover:text-primary
              "
            >上一页</p>
          </div>
          <div v-if="nowPage != storyType[nowStoryType]" @click="nowPage++" class="ring-1.5 ring-primary p-0.5 cursor-pointer w-max">
            <p
              class="
                text-sm bg-primary pl-2.5 pr-2 py-1 text-onPrimary font-bold tracking-widest transition-colors
                hover:bg-transparent hover:text-primary
              "
            >下一页</p>
          </div>
        </template>
        <router-link v-if="nowPage == storyType[nowStoryType] || storyType[nowStoryType] === 1" to="/" class="ring-1.5 ring-primary p-0.5 cursor-pointer w-max">
          <p
            class="
              text-sm bg-primary pl-2.5 pr-2 py-1 text-onPrimary font-bold tracking-widest transition-colors
              hover:bg-transparent hover:text-primary
            "
          >返回首页</p>        
        </router-link>
      </div>
    </div>
  </div>
</template>