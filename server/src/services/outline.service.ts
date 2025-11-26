/**
 * Outline 存储服务
 * 开发环境使用内存存储，生产环境可切换到 Redis/MongoDB
 */

import type { Outline, OutlineCard } from '@xhscard/shared/types/index.js'

// 内存存储
const outlineStore = new Map<string, Outline>()

/**
 * 生成唯一 ID
 */
function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * 保存大纲
 */
export function saveOutline(outline: Outline): void {
  outlineStore.set(outline.id, outline)

  // 24小时后自动清理
  const expiresIn = new Date(outline.expiresAt).getTime() - Date.now()
  if (expiresIn > 0) {
    setTimeout(() => {
      outlineStore.delete(outline.id)
      console.log(`✨ Outline ${outline.id} expired and deleted`)
    }, expiresIn)
  }
}

/**
 * 获取大纲
 */
export function getOutline(id: string): Outline | undefined {
  const outline = outlineStore.get(id)

  // 检查是否过期
  if (outline && new Date(outline.expiresAt) < new Date()) {
    outlineStore.delete(id)
    return undefined
  }

  return outline
}

/**
 * 更新大纲
 */
export function updateOutline(id: string, updates: Partial<Outline>): Outline | null {
  const outline = getOutline(id)
  if (!outline) {
    return null
  }

  const updatedOutline: Outline = {
    ...outline,
    ...updates,
    updatedAt: new Date().toISOString()
  }

  saveOutline(updatedOutline)
  return updatedOutline
}

/**
 * 删除大纲
 */
export function deleteOutline(id: string): boolean {
  return outlineStore.delete(id)
}

/**
 * 创建新大纲
 */
export function createOutline(
  topic: string,
  cards: OutlineCard[]
): Outline {
  const now = new Date()
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24小时后过期

  const outline: Outline = {
    id: generateId('outline'),
    topic,
    status: 'draft',
    cards,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString()
  }

  saveOutline(outline)
  return outline
}

/**
 * 获取所有大纲（调试用）
 */
export function getAllOutlines(): Outline[] {
  return Array.from(outlineStore.values())
}

/**
 * 清理所有过期大纲
 */
export function cleanupExpiredOutlines(): number {
  const now = new Date()
  let cleaned = 0

  for (const [id, outline] of outlineStore.entries()) {
    if (new Date(outline.expiresAt) < now) {
      outlineStore.delete(id)
      cleaned++
    }
  }

  if (cleaned > 0) {
    console.log(`✨ Cleaned up ${cleaned} expired outlines`)
  }

  return cleaned
}

// 定期清理过期大纲（每小时）
setInterval(cleanupExpiredOutlines, 60 * 60 * 1000)

console.log('📦 Outline storage service initialized (in-memory)')
