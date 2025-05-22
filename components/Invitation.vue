<script setup lang="ts">
useSeoMeta({
  title: 'Запрошення',
})
</script>
<template>
  <div class="max-w-xs mx-auto text-center text-xl font-cursive tracking-wide">
    <Image
      src="/images/flowers.png"
      alt="flowers"
      width="320"
      class="mx-auto mb-12"
    />
    <p class="tracking-widest text-amber-950">
      запрошуємо вас на
      <span class="block text-[2.2em] mt-2">Хрещення</span>
      нашого сина
      <span class="block text-[2.2em] mt-2">Назарія</span>
    </p>
    <Image
      src="/images/divider.png"
      alt="divider"
      width="160"
      class="w-40 mx-auto mt-10 mb-12"
    />
    <p>Чекаємо на вас у неділю, 1 червня</p>
    <p class="mt-6">
      <span class="font-bold">12:00</span> -<br />
      Храм преподобного Амфілохія Почаївського,<br />
      м. Ужгород, вул. Станційна, 8
    </p>
    <p class="mt-6">
      <span class="font-bold">13:30</span> - <br />
      Ресторан "Грант", <br />
      м. Ужгород, вул. Собранецька, 44
    </p>
    <p class="relative px-16 mt-12">
      <Image
        class="absolute -z-1 top-1/2 left-1/2 -translate-1/2 w-80"
        src="/images/flowers2.png"
        alt="flowers"
        width="320"
      />
      <span class="block text-[0.8em] mb-2">
        Ідеями для подарунку можна надихнутись
        <Action
          class="!inline font-bold underline"
          :to="'/nazar'"
          target="_blank"
          >тут</Action
        >, однак
      </span>
      <span
        >Ваша присутність -<br />
        найкращий подарунок для нас!</span
      >
    </p>
  </div>
</template>
