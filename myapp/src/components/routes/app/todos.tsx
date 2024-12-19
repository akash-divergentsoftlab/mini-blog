import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { gql, useMutation } from '@apollo/client'
import { useAuthQuery } from '@nhost/react-apollo'
import { Edit, Info, Plus, Trash } from 'lucide-react'
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
  const [contents, setContents] = useState('')
  const [title, setTitle] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [fromDate, setFromDate] = useState<string>('')
  const [toDate, setToDate] = useState<string>('')
  const [selectedObj, setSelectedObj] = useState<{
    id: string
    title: string
    content: string
  } | null>(null)

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

  const [updatePost] = useMutation<{
    update_Posts_by_pk?: {
      id: string
      title: string
      content: string
      author_id: string
    }
  }>(gql`
   mutation UpdatePost($id: uuid!, $title: String!, $content: String!) {
      update_Posts_by_pk(
        pk_columns: { id: $id }
        _set: { title: $title, content: $content }
      ) {
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
          toast.error(error.message ? "You are not allowed to add this post" : "")
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
        toast.error(error.message ? "You are not allowed to delete this post" : "")
      }
    })
  }

  const handleEditPost = async () => {
    await updatePost({
      variables: { id: selectedObj?.id, title: title, content: contents },
      onCompleted: async () => {
        await refetchTodos()
        toast.success('Post edited successfully!')
        setIsModalOpen(false)
        setTitle("")
        setContents("")
      },
      onError: (error) => {
        toast.error(error.message ? "You are not allowed to edit this post" : "")
      }
    })
  }

  const handleEditPostModal = (post: { id: string; title: string; content: string }) => {
    setSelectedObj(post)
    setTitle(post.title)
    setContents(post.content)
    setIsModalOpen(true)
  }

  const handleEditCancel = () => {
    setIsModalOpen(false)
    setTitle("")
    setContents("")
  }

  // const handleDateFilter = () => {
  //   if (fromDate && toDate) {
  //     const filteredPosts = data?.Posts.filter((post) => {
  //       const postDate = moment(post.created_at)
  //       const from = moment(fromDate)
  //       const to = moment(toDate)
  //       return postDate.isBetween(from, to, 'day', '[]') // Inclusive of both dates
  //     })
  //     return filteredPosts || []
  //   }
  //   return data?.Posts || []
  // }

  // const filteredPosts = handleDateFilter()

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
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter</h3>
            <div className="flex flex-row gap-4">
              <div className="flex flex-col flex-3">
                <label htmlFor="fromDate" className="text-sm font-medium text-gray-900">
                  From
                </label>
                <Input
                  id="fromDate"
                  type="date"
                  value={fromDate}
                  onChange={(e) => { setFromDate(e.target.value); }}
                  className="mt-1"
                />
              </div>
              <div className="flex flex-col flex-3">
                <label htmlFor="toDate" className="text-sm font-medium text-gray-900">
                  To
                </label>
                <Input
                  id="toDate"
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
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
                <div>
                  <Button
                    variant="ghost"
                    onClick={() => handleEditPostModal(post)}
                  >
                    <Edit className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    <Trash className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Post</h3>
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mb-4"
            />
            <Input
              placeholder="Content"
              value={contents}
              onChange={(e) => setContents(e.target.value)}
              className="mb-4"
            />
            <div className="flex justify-end gap-2">
              <Button onClick={() => handleEditCancel()}>Cancel</Button>
              <Button onClick={() => handleEditPost()}>Add</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
