function debounce(func: any, timeout = 500) {
  // let timer: string | number | NodeJS.Timeout;
  // return (...args: any) => {
  //   console.log('debounce')
  //   if (!timer) {
  //     // @ts-ignore
  //     func.apply(this, args);
  //   }
  //   clearTimeout(timer);
  //   timer = setTimeout(() => {
  //     timer = undefined;
  //   }, timeout);
  // };

  let timer: string | number | NodeJS.Timeout
  return (...args: any) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      // @ts-ignore
      func.apply(this, args)
    }, timeout)
  }
}

export { debounce }