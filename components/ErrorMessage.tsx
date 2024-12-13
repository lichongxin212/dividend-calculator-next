interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4 my-4">
      <p className="text-red-700 text-sm m-0">{message}</p>
    </div>
  );
} 