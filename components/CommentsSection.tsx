import { useEffect, useState } from 'react'
import { useActionState } from 'react'
import { createComment, updateComment, deleteComment } from '@/app/actions/tasks'
import { ErrorMessage } from '@/components/ErrorMessage'
import { TaskComment } from '@/app/lib/definitions'

export function CommentsSection({
    projectId,
    taskId,
    comments,
    currentUserId,
}: {
    projectId: string
    taskId: string
    comments: TaskComment[]
    currentUserId?: string
}) {
    const createCommentWithIds = createComment.bind(null, projectId, taskId)
    const [state, action, pending] = useActionState(createCommentWithIds, undefined)

    return (
        <div className="flex flex-col gap-3 border-t border-(--form-grey) pt-4">
            <ul className="flex flex-col gap-3">
                {comments.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        projectId={projectId}
                        taskId={taskId}
                        comment={comment}
                        canDelete={comment.authorId === currentUserId}
                        canEdit={comment.authorId === currentUserId}
                    />
                ))}
            </ul>
            <form action={action} className="flex flex-col gap-2 pb-3 lg:pb-0">
                {state?.message && <ErrorMessage message={state.message} />}
                <label htmlFor="content" className="sr-only">Ajouter un commentaire</label>
                <textarea
                    id="content"
                    name="content"
                    rows={2}
                    placeholder="Ajouter un commentaire"
                    className="border border-(--form-grey) rounded px-3 py-2 text-sm"
                />
                {state?.errors?.content && <ErrorMessage message={state.errors.content.join(', ')} />}
                <button type="submit" className="self-end px-4 py-2 rounded bg-(--light-orange) text-sm cursor-pointer">
                    {pending ? 'Envoi...' : 'Commenter'}
                </button>
            </form>
        </div>
    )
}

function CommentItem({
    projectId,
    taskId,
    comment,
    canDelete,
    canEdit,
}: {
    projectId: string
    taskId: string
    comment: TaskComment
    canDelete: boolean
    canEdit: boolean
}) {
    const updateCommentWithIds = updateComment.bind(null, projectId, taskId, comment.id)
    const [state, action, pending] = useActionState(updateCommentWithIds, undefined)
    const [editing, setEditing] = useState(false)

    useEffect(() => {
        if (state?.success) setEditing(false)
    }, [state])

    async function handleDelete() {
        if (!confirm('Supprimer ce commentaire ?')) return
        await deleteComment(projectId, taskId, comment.id)
    }

    return (
        <li className="flex flex-col gap-1 text-sm">
            <div className="flex items-center justify-between">
                <span className="font-medium">{comment.author.name}</span>
                <div className="flex gap-3 text-xs">
                    {canEdit && (
                        <button onClick={() => setEditing((v) => !v)} className="text-(--dark-orange) underline cursor-pointer">
                            Modifier
                        </button>
                    )}
                    {canDelete && (
                        <button onClick={handleDelete} className="text-(--error-red) underline cursor-pointer">
                            Supprimer
                        </button>
                    )}
                </div>
            </div>
            {editing ? (
                <form action={action} className="flex flex-col gap-2">
                    {state?.message && <ErrorMessage message={state.message} />}
                    <textarea name="content" rows={2} defaultValue={comment.content} className="border border-(--form-grey) rounded px-3 py-2" />
                    <button type="submit" className="self-end px-3 py-1 rounded bg-(--light-orange) text-xs cursor-pointer">
                        {pending ? '...' : 'Enregistrer'}
                    </button>
                </form>
            ) : (
                <p className='text-xs text-(--neutral-grey)'>{comment.content}</p>
            )}
        </li>
    )
}