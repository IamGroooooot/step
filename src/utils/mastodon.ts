export interface MastodonAccount {
  id: string
  username: string
  acct: string
  display_name: string
  avatar: string
  url: string
}

export interface MastodonStatus {
  id: string
  created_at: string
  account: MastodonAccount
  content: string
  url: string
  in_reply_to_id: string | null
  replies_count: number
  reblogs_count: number
  favourites_count: number
}

export interface MastodonContext {
  ancestors: MastodonStatus[]
  descendants: MastodonStatus[]
}

/**
 * Fetch Mastodon comments for a given status
 * @param statusId - The Mastodon status ID
 * @param instanceUrl - The Mastodon instance URL (e.g., 'https://mastodon.social')
 * @returns Array of direct replies to the status
 */
export async function getMastodonComments(
  statusId: string,
  instanceUrl: string,
): Promise<MastodonStatus[]> {
  if (!statusId || !instanceUrl) {
    return []
  }

  try {
    const response = await fetch(
      `${instanceUrl}/api/v1/statuses/${statusId}/context`,
    )

    if (!response.ok) {
      console.error(`Failed to fetch Mastodon comments: ${response.statusText}`)
      return []
    }

    const data: MastodonContext = await response.json()

    // Filter to get only direct replies to the original status
    const comments = data.descendants.filter(
      comment => comment.in_reply_to_id === statusId,
    )

    return comments
  }
  catch (error) {
    console.error('Error fetching Mastodon comments:', error)
    return []
  }
}

/**
 * Build a nested comment tree from flat array of comments
 * @param comments - Flat array of Mastodon status objects
 * @param parentId - Parent status ID to build tree from
 * @returns Nested array of comments with their replies
 */
export function buildCommentTree(
  comments: MastodonStatus[],
  parentId: string,
): (MastodonStatus & { replies?: MastodonStatus[] })[] {
  const replies = comments.filter(
    comment => comment.in_reply_to_id === parentId,
  )

  return replies.map((reply) => {
    const nestedReplies = buildCommentTree(comments, reply.id)
    return nestedReplies.length > 0 ? { ...reply, replies: nestedReplies } : reply
  })
}
