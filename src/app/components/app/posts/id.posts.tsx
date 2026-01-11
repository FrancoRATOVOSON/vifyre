interface IdPostPageProps {
  title: string
  content: string
}
export const IdPostPage = ({ content, title }: IdPostPageProps) => {
  return (
    <div className="mt-16 flex flex-col gap-10">
      <h1 className="text-4xl font-medium text-center">{title}</h1>
      <p className="self-center w-1/2">{content}</p>
    </div>
  )
}
