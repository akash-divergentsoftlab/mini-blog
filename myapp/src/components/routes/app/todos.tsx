import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { gql, useMutation } from '@apollo/client'
import { useAuthQuery } from '@nhost/react-apollo'
import { Info, Plus, Trash } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function Todos() {
  const { data, refetch: refetchTodos } = useAuthQuery<{
    Posts: Array<{
      id: string
      title: string
      content: string
    }>
  }>(gql`
    query {
      Posts {
        id
        title
        content
      }
    }
  `)
console.log('data',data)
  const [contents, setContents] = useState('')
  const [title, setTitle] = useState('')

  // Insert Post Mutation
  const [addPost] = useMutation<{
    insert_Posts_one?: {
      id: string
      title: string
      content: string
      author_id: string
    }
  }>(gql`
    mutation InsertPost(
      $title: String!
      $content: String!
      $author_id: uuid!
      $created_at: timestamptz!
      $updated_at: timestamptz!
    ) {
      insert_Posts_one(
        object: {
          title: $title
          content: $content
          author_id: $author_id
          created_at: $created_at
          updated_at: $updated_at
        }
      ) {
        id
        title
        content
        author_id
      }
    }
  `)

  // Delete Post Mutation
  const [deletePost] = useMutation<{
    delete_Posts_by_pk?: {
      id: string
      title: string
      content: string
      author_id: string
    }
  }>(gql`
    mutation DeletePost($id: uuid!) {
      delete_Posts_by_pk(id: $id) {
        id
        title
        content
        author_id
      }
    }
  `)

  const handleAddPost = () => {
    if (contents && title) {
      addPost({
        variables: {
          title,
          content: contents,
          author_id: 'be310675-e447-41cd-a298-980df23c1c54',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        onCompleted: async () => {
          setContents('')
          setTitle('')
          await refetchTodos()
          toast.success('Post added successfully!')
        },
        onError: (error) => {
          toast.error(error.message)
        }
      })
    } else {
      toast.error('Please fill in all fields')
    }
  }

  const handleDeletePost = async (postId: string) => {
    await deletePost({
      variables: { id: postId },
      onCompleted: async () => {
        await refetchTodos()
        toast.success('Post deleted successfully!')
      },
      onError: (error) => {
        toast.error(error.message)
      }
    })
  }

  return (
    <div className="w-full">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Posts</CardTitle>
        </CardHeader>
      </Card>
      <Card className="w-full pt-6">
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-row gap-4">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              placeholder="Content"
              value={contents}
              onChange={(e) => setContents(e.target.value)}
              onKeyDown={(e) => e.code === 'Enter' && handleAddPost()}
            />
            <Button className="m-0" onClick={handleAddPost}>
              <Plus />
              Add
            </Button>
          </div>
          <div>
            {data?.Posts.length === 0 && (
              <Alert className="w-full">
                <Info className="w-4 h-4" />
                <AlertTitle>Empty</AlertTitle>
                <AlertDescription className="mt-2">
                  Start by adding a post
                </AlertDescription>
              </Alert>
            )}
            {data?.Posts.map((post) => (
              <div
                key={post.id}
                className="flex flex-row items-center justify-between w-full p-4 border-b last:pb-0 last:border-b-0"
              >
                <div className="flex flex-col gap-2">
                  <span className="font-bold">{post.title}</span>
                  <span>{post.content}</span>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => handleDeletePost(post.id)}
                >
                  <Trash className="w-5 h-5" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
