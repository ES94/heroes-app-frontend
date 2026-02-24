interface Props {
  title: string;
  description: string;
}

export const CustomJumbotron = ({ title, description }: Props) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 mb-2">
        {title}
      </h1>
      {description && <p className="text-gray-600">{description}</p>}
    </div>
  );
};
