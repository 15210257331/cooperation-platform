import { computed, ref } from 'vue';

/**
 * 倒计时
 * @param second - 倒计时的时间(s)
 */
export function useCountDown() {
  // 倒计时的秒数
  const counts = ref(0);
  // 是否还在计时中
  const isCounting = computed(() => Boolean(counts.value));

  let intervalId: any;

  /**
   * 开始计时
   * @param updateSecond - 更改初时传入的倒计时时间
   */
  function startCountDown(second: number = 60) {
    if (!counts.value) {
      counts.value = second;
      intervalId = setInterval(() => {
        counts.value -= 1;
        if (counts.value <= 0) {
          clearInterval(intervalId);
        }
      }, 1000);
    }
  }

  return {
    counts,
    isCounting,
    startCountDown
  };
}
