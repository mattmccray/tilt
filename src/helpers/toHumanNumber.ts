const formatter = new Intl.NumberFormat()

export const toHumanNumber = (num: number) => formatter.format(num)

export default toHumanNumber