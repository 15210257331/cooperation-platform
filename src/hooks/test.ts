import { watch } from 'vue';

export function useTest(data: any) {
  const stopOptionWatch = watch(data, newValue => {
    console.log(newValue);
  });
  return data.toString();
}
