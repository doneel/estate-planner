export function ANNUAL_GIFT_EXCLUSIONS(number: number): number | undefined {
  if (number < 1997) {
    return undefined;
  } else if (number < 2002) {
    return 10_000;
  } else if (number < 2006) {
    return 11_000;
  } else if (number < 2009) {
    return 12_000;
  } else if (number < 2013) {
    return 13_000;
  } else if (number < 2018) {
    return 14_000;
  } else if (number < 2020) {
    return 15_000;
  } else {
    return 16_000;
  }
}

export function LIFETIME_GIFT_EXCLUSIONS(number: number): number | undefined {
  if (number < 2000) {
    return undefined;
  } else if (number < 2002) {
    return 675_000;
  } else if (number < 2006) {
    return 1_000_000;
  } else if (number < 2011) {
    return 5_000_000;
  } else if (number === 2012) {
    return 5_120_000;
  } else if (number === 2013) {
    return 5_250_000;
  } else if (number === 2014) {
    return 5_340_000;
  } else if (number === 2015) {
    return 5_430_000;
  } else if (number === 2016) {
    return 5_450_000;
  } else if (number === 2017) {
    return 5_490_000;
  } else if (number === 2018) {
    return 11_180_000;
  } else if (number === 2019) {
    return 11_400_000;
  } else if (number === 2020) {
    return 11_580_000;
  } else if (number === 2021) {
    return 11_700_000;
  } else if (number === 2022) {
    return 12_060_000;
  } else if (number >= 2023) {
    return 12_920_000;
  }
}

export function GIFT_TAX_RATE(number: number): number | undefined {
  if (number < 2000) {
    return undefined;
  } else if (number <= 2001) {
    return 0.55;
  } else if (number === 2002) {
    return 0.5;
  } else if (number === 2003) {
    return 0.49;
  } else if (number === 2004) {
    return 0.48;
  } else if (number === 2005) {
    return 0.47;
  } else if (number === 2006) {
    return 0.46;
  } else if (number <= 2009) {
    return 0.45;
  } else if (number <= 2012) {
    return 0.35;
  } else if (number >= 2013) {
    return 0.4;
  }
}
