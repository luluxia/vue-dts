<script setup lang="ts">
import { onMounted } from 'vue';
onMounted(() => {
  // 获取 canvas 元素
  const canvas = document.querySelector('canvas')!;
  const ctx = canvas.getContext('2d')!;

  // 设置 canvas 宽高
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // 定义圆环扩散的动画
  class Circle {
    x: number;
    y: number;
    radius: number;
    lineWidth: number;
    alpha: number;
    speed: number;

    constructor(x: number, y: number, radius: number, lineWidth: number, alpha: number, speed: number) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.lineWidth = lineWidth;
      this.alpha = alpha;
      this.speed = speed;
    }

    draw() {
      const color = getComputedStyle(document.documentElement).getPropertyValue('--md-sys-color-on-surface')
      ctx.beginPath();
      ctx.rect(this.x - this.radius / 2, this.y - this.radius / 2, this.radius, this.radius);
      ctx.strokeStyle = `rgba(${color}, ${this.alpha})`;
      ctx.lineWidth = this.lineWidth;
      ctx.lineCap = 'round'; // 设置线条末端样式为圆形
      ctx.stroke();
    }

    update() {
      this.radius += this.speed;
      this.alpha -= 0.04;
    }

    get isDone() {
      return this.alpha <= 0;
    }
  }

  // 存储圆环扩散的动画
  const circles: Circle[] = [];

  // 监听页面点击事件
  document.addEventListener('click', (event) => {
    const { x, y } = event;
    const circle = new Circle(x, y, 0, 1, 1, 1.5);
    circles.push(circle);
  });

  // 动画循环
  function animate() {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 更新并绘制圆环扩散的动画
    for (let i = 0; i < circles.length; i++) {
      const circle = circles[i];
      circle.update();
      circle.draw();

      // 如果动画已经结束，则从数组中移除
      if (circle.isDone) {
        circles.splice(i, 1);
        i--;
      }
    }

    // 循环调用动画函数
    requestAnimationFrame(animate);
  }

  // 启动动画循环
  animate();
})
</script>

<template>
  <canvas class="fixed z-4 pointer-events-none"></canvas>
</template>