export const colorsBg = {
  white: 'bg-white text-black',
  light: 'bg-gray-100 text-black',
  success: 'bg-emerald-500 text-white',
  danger: 'bg-red-500 text-white',
  warning: 'bg-orange-400 text-white',
  info: 'bg-blue-500 text-white',
  login: 'main-button text-white'
}

export const colorsBgHover = {
  white: 'hover:bg-gray-50',
  light: 'hover:bg-gray-200',
  success: 'hover:bg-emerald-600',
  danger: 'hover:bg-red-600',
  warning: 'hover:bg-orange-500',
  info: 'hover:bg-blue-600',
  login: 'main-button text-white'
}

export const colorsBorders = {
  white: 'border-gray-300',
  light: 'border-gray-200 dark:border-gray-400',
  success: 'border-emerald-600',
  danger: 'border-red-600',
  warning: 'border-orange-600',
  info: 'border-blue-600',
  login: 'border-none rounded-lg'
}

export const colorsText = {
  white: 'text-black dark:text-gray-100',
  light: 'text-gray-700 dark:text-gray-400',
  success: 'text-emerald-500',
  danger: 'text-red-500',
  warning: 'text-orange-500',
  info: 'text-blue-500',
  login: 'text-white'
}

export const colorsOutline = {
  white: [colorsText.white, colorsBorders.white],
  light: [colorsText.light, colorsBorders.light],
  success: [colorsText.success, colorsBorders.success],
  danger: [colorsText.danger, colorsBorders.danger],
  warning: [colorsText.warning, colorsBorders.warning],
  info: [colorsText.info, colorsBorders.info]
}

export const colorsOutlineHover = {
  white: 'hover:bg-gray-100 hover:text-gray-900 dark:hover:text-gray-900',
  light: 'hover:bg-gray-100 hover:text-gray-900 dark:hover:text-gray-900',
  success: 'hover:bg-emerald-500 hover:text-white',
  danger: 'hover:bg-red-500 hover:text-white',
  warning: 'hover:bg-orange-500 hover:text-white',
  info: 'hover:bg-blue-500 hover:text-white'
}

export const getButtonColor = (color, isOutlined, hasHover) => {
  const base = [
    isOutlined ? colorsText[color] : colorsBg[color],
    colorsBorders[color]
  ]

  if (hasHover) {
    base.push(isOutlined ? colorsOutlineHover[color] : colorsBgHover[color])
  }

  return base
}
