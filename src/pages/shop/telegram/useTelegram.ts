export const useTelegram = () => {
  // @ts-ignore
  const telegram = window.Telegram.WebApp;

  return {
    telegram
  }
};