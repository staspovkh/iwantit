<script setup lang="ts">
useSeoMeta({
  title: 'Запрошення',
})
</script>
<template>
  <div
    class="-mx-4 text-[min(5.6vw,1.75rem)] text-center font-cursive tracking-wide"
  >
    <div class="max-w-lg mx-auto px-[1em]">
      <Image
        src="/images/flowers.png"
        alt="flowers"
        width="320"
        class="mx-auto mb-[2.4em] px-[0.5em]"
      />
      <p class="tracking-widest text-amber-950">
        запрошуємо вас на
        <span class="block text-[2.2em] mt-[0.17em]">Хрещення</span>
        нашого сина
        <span class="block text-[2.2em] mt-[0.17em]">Назарія</span>
      </p>
      <Image
        src="/images/divider.png"
        alt="divider"
        width="160"
        class="w-1/2 mx-auto mt-[2em] mb-[2.4em]"
      />
      <p>Чекаємо на вас у неділю, 1 червня</p>
      <p class="mt-[1.2em]">
        <span class="font-bold">12:00</span> -<br />
        Храм преподобного Амфілохія Почаївського,<br />
        м. Ужгород, вул. Станційна, 8
      </p>
      <p class="mt-[1.2em]">
        <span class="font-bold">13:30</span> - <br />
        Ресторан "Грант", <br />
        м. Ужгород, вул. Собранецька, 44
      </p>
      <p class="relative px-[2.5em] mt-[2.4em]">
        <Image
          class="absolute -z-1 top-1/2 left-1/2 -translate-1/2 w-full"
          src="/images/flowers2.png"
          alt="flowers"
          width="320"
        />
        <span class="block text-[0.8em]">
          Ідеями для подарунку можна надихнутись
          <Action
            class="!inline font-bold underline !transition-none"
            :to="'/nazar'"
            target="_blank"
            >тут</Action
          >, однак
        </span>
        <span class="block mt-[0.4em]"
          >Ваша присутність -<br />
          найкращий подарунок для нас!</span
        >
      </p>
    </div>
  </div>
</template>
