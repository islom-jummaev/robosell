export const isFilledDependencies = (deps: Array<string | number | undefined>): boolean => {
  let filled = true;

  deps.forEach((item) => {
    if (!item) {
      filled = false;
    }
  });

  return filled;
};

export const isObjectType = (val: any) => {
  return typeof val === "object" && !Array.isArray(val) && val !== null;
};

export const timeDifference = (start: any, end: any): { hours: number; minutes: number } => {
  start = start.split(":");
  end = end.split(":");
  let startDate = new Date(0, 0, 0, start[0], start[1], 0);
  let endDate = new Date(0, 0, 0, end[0], end[1], 0);
  let diff = endDate.getTime() - startDate.getTime();
  let hours = Math.floor(diff / 1000 / 60 / 60);
  diff -= hours * 1000 * 60 * 60;
  let minutes = Math.floor(diff / 1000 / 60);

  if (hours < 0)
    hours = hours + 24;

  return {
    hours,
    minutes
  };
};

export const dateDifference = (date1: string, date2: string): number => {
  const startDate = Math.ceil(Math.abs(new Date(date1).getTime()) / (1000 * 3600 * 24));
  const stopDate =  Math.ceil(Math.abs(new Date(date2).getTime()) / (1000 * 3600 * 24));

  return stopDate >= startDate ? stopDate - startDate : -1;
};

export const getDigitsNums = (val: string): string => {
  if (!val) {
    return "";
  }

  const res = String(val);

  return res.replace(/\D/g, '')
};

export const isValidUrl = (urlString: string): boolean => {
  let urlPattern = new RegExp('^(https?:\\/\\/)'+ // validate protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
    '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
  return !!urlPattern.test(urlString);
}