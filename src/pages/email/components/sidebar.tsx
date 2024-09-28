import {
  IconInbox,
  IconSend as IconSentMail,
  IconFileText,
  IconMailCancel,
  IconTrash,
  IconArchive,
} from "@tabler/icons-react";

export function Sidebar() {
  const sidebarItems = [
    { icon: IconInbox, label: "Inbox", count: 24 },
    { icon: IconSentMail, label: "Sent" },
    { icon: IconFileText, label: "Drafts", count: 2 },
    { icon: IconMailCancel, label: "Junk", count: 3 },
    { icon: IconTrash, label: "Trash" },
    { icon: IconArchive, label: "Archive" },
  ];

  return (
    <div className="w-56 flex-shrink-0 border-r p-4">
      <h2 className="mb-4 font-semibold">Folders</h2>
      {sidebarItems.map((item, index) => (
        <button
          key={index}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-secondary"
        >
          <item.icon size={18} />
          <span className="flex-grow text-left">{item.label}</span>
          {item.count && (
            <span className="rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground">
              {item.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
