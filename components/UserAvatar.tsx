import Image from "next/image";

export default function UserAvatar({ user }: { user: any }) {
  return (
    <div className="flex items-center px-4">
      <div className="flex-shrink-0">
        {user?.image ? (
          <Image
            className="h-8 w-8 rounded-full"
            src={user?.image}
            height={32}
            width={32}
            alt={`${user.name} avatar`}
          />
        ) : (
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-500">
            <span className="font-medium leading-none text-white">
              {user.name
                .split(" ")
                .map((part: string) => part[0])
                .join("")}
            </span>
          </span>
        )}
      </div>
      <div className="ml-3">
        <div className="text-sm text-left font-medium text-gray-800">
          {user.name}
        </div>
        <div className="text-xs font-medium text-gray-500">{user.email}</div>
      </div>
    </div>
  );
}
