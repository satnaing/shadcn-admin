import { useState } from "react";
import { Fragment } from "react/jsx-runtime";
import dayjs from "dayjs";
import {
  IconDotsVertical,
  IconEdit,
  IconMail,
  IconPaperclip,
  IconSearch,
  IconSend,
  IconTrash,
  IconArchive,
  IconMailCancel,
  IconCornerUpLeft,
  IconCornerUpLeftDouble,
  IconCornerUpRight,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Layout } from "@/components/custom/layout";
import { Search } from "@/components/search";
import ThemeSwitch from "@/components/theme-switch";
import { UserNav } from "@/components/user-nav";
import { Button } from "@/components/custom/button";

import { Sidebar } from "./components/sidebar";
import { Textarea } from "@/components/ui/textarea";

// Fake Data (you'll need to create this)
import { emails } from "@/data/emails.json";

type Email = typeof emails[number];

export default function EmailPage() {
  const [search, setSearch] = useState("");
  const [selectedEmail, setSelectedEmail] = useState<Email>(emails[0]);
  const [mobileSelectedEmail, setMobileSelectedEmail] = useState<Email | null>(
    null
  );

  // Filtered data based on the search query
  const filteredEmails = emails.filter(({ subject, sender }) =>
    `${subject} ${sender}`.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <Layout fixed>
      {/* ===== Top Heading ===== */}
      <Layout.Header>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      <Layout.Body className="sm:overflow-hidden">
        <section className="flex h-full gap-6">
          <Sidebar />

          <div className="flex w-full flex-col gap-2 sm:w-56 lg:w-72 2xl:w-80">
            <div className="sticky top-0 z-10 -mx-4 bg-background px-4 pb-3 shadow-md sm:static sm:z-auto sm:mx-0 sm:p-0 sm:shadow-none">
              <div className="flex items-center justify-between py-2">
                <div className="flex gap-2 items-center">
                  <IconMail className="mt-1" size={25} />
                  <h1 className="text-2xl font-bold">Inbox</h1>
                </div>

                <Button size="icon" variant="ghost" className="rounded-lg">
                  <IconEdit size={24} className="stroke-muted-foreground" />
                </Button>
              </div>

              <label className="flex h-12 w-full items-center space-x-0 rounded-md border border-input pl-2 focus-within:outline-none focus-within:ring-1 focus-within:ring-ring">
                <IconSearch size={15} className="mr-2 stroke-slate-500" />
                <span className="sr-only">Search</span>
                <input
                  type="text"
                  className="w-full flex-1 bg-inherit text-sm focus-visible:outline-none"
                  placeholder="Search emails..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
            </div>

            <div className="-mx-3 h-full overflow-auto p-3">
              {filteredEmails.map((email) => (
                <Fragment key={email.id}>
                  <button
                    type="button"
                    className={cn(
                      `-mx-1 flex w-full rounded-md px-2 py-2 text-left text-sm hover:bg-secondary/75`,
                      selectedEmail.id === email.id && "sm:bg-muted"
                    )}
                    onClick={() => {
                      setSelectedEmail(email);
                      setMobileSelectedEmail(email);
                    }}
                  >
                    <div className="flex w-full gap-2">
                      <Avatar>
                        <AvatarImage src={email.avatar} alt={email.sender} />
                        <AvatarFallback>{email.sender[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <div className="font-medium">{email.name}</div>
                        <div className="truncate text-muted-foreground">
                          {email.subject}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {dayjs(email.date).format("MMM D")}
                        </div>
                      </div>
                    </div>
                  </button>
                  <Separator className="my-1" />
                </Fragment>
              ))}
            </div>
          </div>

          {/* Right Side */}
          <div
            className={cn(
              "absolute inset-0 left-full z-50 flex w-full flex-1 flex-col rounded-md border bg-primary-foreground shadow-sm transition-all duration-200 sm:static sm:z-auto sm:flex",
              mobileSelectedEmail && "left-0"
            )}
          >
            {/* Top Part */}
            <div className="mb-1 flex flex-col rounded-t-md bg-secondary p-4 shadow-lg">
              {/* Left */}
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon">
                    <IconArchive size={20} />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <IconMailCancel size={20} />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <IconTrash size={20} />
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon">
                    <IconCornerUpLeft size={20} />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <IconCornerUpLeftDouble size={20} />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <IconCornerUpRight size={20} />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <IconDotsVertical size={20} />
                  </Button>
                </div>
              </div>
              <Separator orientation="horizontal" />
              <div className="flex items-center gap-2 mt-2">
                <Avatar>
                  <AvatarImage
                    src={selectedEmail.avatar}
                    alt={selectedEmail.sender}
                  />
                  <AvatarFallback>{selectedEmail.sender[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col ">
                  <div className=" font-medium ">{selectedEmail.subject}</div>
                  <div className=" text-sm text-muted-foreground">
                    Reply-to: {selectedEmail.sender}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {dayjs(selectedEmail.date).format("MMM D")}
                  </div>
                </div>
              </div>
            </div>

            {/* Email Content */}
            <div className="flex flex-1 flex-col gap-2 rounded-md px-4 pb-4 pt-0">
              <div className="flex size-full flex-1">
                <div className="email-content-container relative -mr-4 flex flex-1 flex-col overflow-y-hidden">
                  <div className="email-content flex h-40 w-full flex-grow flex-col justify-start gap-4 overflow-y-auto py-2 pb-4 pr-4">
                    <div className="whitespace-pre-wrap">
                      {selectedEmail.body}
                    </div>
                  </div>
                </div>
              </div>
              <form className="flex w-full flex-none gap-2">
                <div className="flex flex-1 items-center gap-2 rounded-md  px-2 py-1 lg:gap-4">
                  <Button
                    size="icon"
                    type="button"
                    variant="ghost"
                    className="h-8 rounded-md"
                  >
                    <IconPaperclip
                      size={20}
                      className="stroke-muted-foreground"
                    />
                  </Button>
                  <label className="flex-1">
                    <span className="sr-only">Reply</span>
                    <Textarea
                      rows={2}
                      placeholder="Type your reply..."
                      className="h-8 w-full bg-inherit focus-visible:outline-none"
                    />
                  </label>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden sm:inline-flex"
                  >
                    <IconSend size={20} />
                  </Button>
                </div>
                <Button
                  className="h-full sm:hidden"
                  rightSection={<IconSend size={18} />}
                >
                  Send
                </Button>
              </form>
            </div>
          </div>
        </section>
      </Layout.Body>
    </Layout>
  );
}
