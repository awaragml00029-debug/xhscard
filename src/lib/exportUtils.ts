import html2canvas from 'html2canvas'

/**
 * 将DOM元素导出为PNG图片
 */
export async function exportCardToPNG(
  element: HTMLElement,
  filename: string
): Promise<void> {
  try {
    const canvas = await html2canvas(element, {
      backgroundColor: null,
      scale: 2, // 2倍分辨率，保证清晰度
      useCORS: true,
      logging: false,
    })

    // 转换为blob并下载
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error('导出失败')
      }

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.click()
      URL.revokeObjectURL(url)
    }, 'image/png')
  } catch (error) {
    console.error('导出卡片失败:', error)
    throw new Error('导出卡片失败，请重试')
  }
}

/**
 * 批量导出所有卡片
 */
export async function exportAllCards(
  elements: HTMLElement[],
  baseFilename: string
): Promise<void> {
  for (let i = 0; i < elements.length; i++) {
    const filename = `${baseFilename}_${i + 1}.png`
    await exportCardToPNG(elements[i], filename)
    // 添加延迟，避免同时下载太多文件
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
}
